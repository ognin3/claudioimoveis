/**
 * Etapa 2: reencoda as imagens do scrape antes de subir para o Sanity.
 *
 *   npm run pipeline:imagens
 *
 * As fotos da Cury vem em WebP 1440x900 pesando ~526 KB — muito para o formato.
 * Reencodar em q80 mantendo a resolucao nativa corta ~53% sem degradar visivel
 * (medido: 224 KB -> 104 KB por foto na amostra). Nao vale comprimir mais: a
 * fonte ja e lossy, e recomprimir agressivamente comeca a marcar.
 *
 * NAO gera AVIF aqui. O CDN do Sanity converte sob demanda com `auto=format`,
 * entao o que sobe e apenas o master; gerar AVIF agora so dobraria o upload.
 *
 * A saida e enderecada por conteudo (`<hash>.webp`), entao imagem repetida entre
 * imoveis vira um arquivo so — a desduplicacao cai de graca. Ver CLAUDE.md 5.4c.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import type { ImovelNormalizado } from "./01-normalizar.mts";

const ENTRADA = "data/imoveis.normalizado.json";
const DIR_SAIDA = "data/imagens";
const MANIFESTO = "data/imagens.json";
const LARGURA_MAX = 1920;
const QUALIDADE = 80;
/** Sharp ja usa varias threads; muitas tarefas em paralelo so brigam por CPU. */
const CONCORRENCIA = 6;

type Otimizada = { arquivo: string; bytes: number; largura: number; altura: number };

const manifesto: Record<string, Otimizada> = {};
let lidos = 0;
let bytesOrig = 0;
let bytesFinal = 0;
let reaproveitados = 0;
const falhas: string[] = [];
/** Arquivos que o scraper baixou vazios — ver comentario em `otimizar`. */
const vazios: string[] = [];

async function otimizar(caminho: string): Promise<void> {
  if (manifesto[caminho]) return;

  if (!existsSync(caminho)) {
    falhas.push(`arquivo nao encontrado: ${caminho}`);
    return;
  }

  const origem = readFileSync(caminho);

  // O scraper deixou 2 arquivos de 0 byte (download que falhou em silencio).
  // Nao e falha do pipeline: a imagem simplesmente nao existe. Fica de fora do
  // manifesto, e o import da etapa 3 nem chega a ve-la.
  if (origem.length === 0) {
    vazios.push(caminho);
    return;
  }

  bytesOrig += origem.length;

  // Hash do CONTEUDO de origem: mesma foto em dois imoveis => um arquivo so.
  const hash = createHash("sha256").update(origem).digest("hex").slice(0, 16);
  const nomeSaida = `${hash}.webp`;
  const destino = join(DIR_SAIDA, nomeSaida);

  if (existsSync(destino)) {
    // Ja otimizado numa rodada anterior ou por outro imovel.
    const meta = await sharp(destino).metadata();
    manifesto[caminho] = {
      arquivo: nomeSaida,
      bytes: statSync(destino).size,
      largura: meta.width ?? 0,
      altura: meta.height ?? 0,
    };
    bytesFinal += manifesto[caminho].bytes;
    reaproveitados++;
    return;
  }

  try {
    const saida = await sharp(origem)
      // `withoutEnlargement`: a fonte tem 1440px, nao inventa pixel que nao existe.
      .resize({ width: LARGURA_MAX, withoutEnlargement: true })
      .webp({ quality: QUALIDADE })
      .toBuffer({ resolveWithObject: true });

    writeFileSync(destino, saida.data);
    manifesto[caminho] = {
      arquivo: nomeSaida,
      bytes: saida.data.length,
      largura: saida.info.width,
      altura: saida.info.height,
    };
    bytesFinal += saida.data.length;
  } catch (erro) {
    falhas.push(`${caminho}: ${erro instanceof Error ? erro.message : erro}`);
  }
}

async function emLotes<T>(itens: T[], tamanho: number, fn: (item: T) => Promise<void>) {
  for (let i = 0; i < itens.length; i += tamanho) {
    await Promise.all(itens.slice(i, i + tamanho).map(fn));
    lidos = Math.min(i + tamanho, itens.length);
    process.stdout.write(`\r   ${lidos}/${itens.length} imagens...`);
  }
  process.stdout.write("\n");
}

async function main() {
  const imoveis: ImovelNormalizado[] = JSON.parse(readFileSync(ENTRADA, "utf8"));
  mkdirSync(DIR_SAIDA, { recursive: true });

  const caminhos = [
    ...new Set(
      imoveis.flatMap((i) => [
        i.capa.caminho,
        ...i.galeria.map((g) => g.caminho),
        ...i.plantas.map((p) => p.caminho),
      ]),
    ),
  ];

  console.log(`Otimizando ${caminhos.length} imagens unicas (webp q${QUALIDADE})...`);
  await emLotes(caminhos, CONCORRENCIA, otimizar);

  writeFileSync(MANIFESTO, JSON.stringify(manifesto, null, 2), "utf8");

  const unicos = new Set(Object.values(manifesto).map((o) => o.arquivo)).size;
  const mb = (n: number) => (n / 1e6).toFixed(1);
  console.log(`\nOK: ${unicos} arquivos em ${DIR_SAIDA} -> ${MANIFESTO}`);
  console.log(`   ${mb(bytesOrig)} MB  ->  ${mb(bytesFinal)} MB`);
  console.log(`   reducao: ${Math.round((1 - bytesFinal / bytesOrig) * 100)}%`);
  if (caminhos.length !== unicos) {
    console.log(`   duplicatas desduplicadas por hash: ${caminhos.length - unicos}`);
  }
  if (reaproveitados)
    console.log(`   reaproveitados de rodada anterior: ${reaproveitados}`);

  if (vazios.length) {
    console.log(`\nVAZIOS no scrape (${vazios.length}) — ignorados, nao sao erro daqui:`);
    for (const v of vazios) console.log(`   - ${v.split(/[\\/]/).slice(-3).join("/")}`);
  }

  if (falhas.length) {
    console.log(`\nFALHAS (${falhas.length}):`);
    for (const f of falhas) console.log(`   - ${f}`);
    process.exitCode = 1;
  }
}

main();
