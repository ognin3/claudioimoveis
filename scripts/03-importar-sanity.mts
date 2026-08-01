/**
 * Etapa 3: sobe as imagens otimizadas e cria/atualiza os documentos no Sanity.
 *
 *   npm run pipeline:importar -- --dry-run     (nao escreve nada)
 *   npm run pipeline:importar
 *   npm run pipeline:importar -- --forcar-midia
 *
 * O QUE ESTE SCRIPT NAO SOBRESCREVE NUMA RE-EXECUCAO:
 * `publicado`, `destaque`, `ordem`, `chamada`, `descricao`, `seo` e as imagens.
 * Sao campos editoriais — do corretor, nao do pipeline. Um `createOrReplace`
 * cego republicaria um imovel que ele tirou do ar e apagaria a descricao que ele
 * escreveu. Por isso: `createIfNotExists` semeia tudo, e o patch seguinte toca
 * apenas os campos factuais que vem do scrape.
 *
 * Midia so e substituida com `--forcar-midia`, senao cada rodada desfaria a
 * reordenacao de fotos feita no Studio.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import type { ImovelNormalizado } from "./01-normalizar.mts";

const ENTRADA = "data/imoveis.normalizado.json";
const MANIFESTO = "data/imagens.json";
const DIR_IMAGENS = "data/imagens";
const CACHE_ASSETS = "data/assets-sanity.json";

const dryRun = process.argv.includes("--dry-run");
const forcarMidia = process.argv.includes("--forcar-midia");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Faltam NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_API_WRITE_TOKEN em .env.local.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-01",
  useCdn: false,
});

type Otimizada = { arquivo: string; bytes: number };
const manifesto: Record<string, Otimizada> = JSON.parse(readFileSync(MANIFESTO, "utf8"));

/** arquivo otimizado -> _id do asset no Sanity. Evita re-upload entre rodadas. */
const cacheAssets: Record<string, string> = existsSync(CACHE_ASSETS)
  ? JSON.parse(readFileSync(CACHE_ASSETS, "utf8"))
  : {};

let enviados = 0;
let reaproveitados = 0;

async function subir(caminhoOrigem: string, alt: string) {
  const otimizada = manifesto[caminhoOrigem];
  // Ausente do manifesto = arquivo vazio ou faltando no scrape. Ver etapa 2.
  if (!otimizada) return null;

  const cacheado = cacheAssets[otimizada.arquivo];
  if (cacheado) {
    reaproveitados++;
    return referencia(cacheado, alt, otimizada.arquivo);
  }

  if (dryRun) return referencia("dry-run", alt, otimizada.arquivo);

  const binario = readFileSync(join(DIR_IMAGENS, otimizada.arquivo));
  const asset = await client.assets.upload("image", binario, {
    filename: otimizada.arquivo,
  });
  cacheAssets[otimizada.arquivo] = asset._id;
  enviados++;
  return referencia(asset._id, alt, otimizada.arquivo);
}

function referencia(assetId: string, alt: string, chave: string) {
  return {
    _type: "image" as const,
    _key: createHash("sha1").update(chave).digest("hex").slice(0, 12),
    asset: { _type: "reference" as const, _ref: assetId },
    alt,
  };
}

async function importar(imovel: ImovelNormalizado) {
  const _id = `imovel-${imovel.slug}`;

  const capa = await subir(imovel.capa.caminho, `${imovel.nome} — fachada`);
  if (!capa) {
    console.log(`   ! ${imovel.nome}: capa indisponivel, pulando`);
    return false;
  }

  const galeria = (
    await Promise.all(
      imovel.galeria.map((g, i) => subir(g.caminho, `${imovel.nome} — foto ${i + 1}`)),
    )
  ).filter((x) => x !== null);

  const plantas = (
    await Promise.all(
      imovel.plantas.map((p, i) => subir(p.caminho, `${imovel.nome} — planta ${i + 1}`)),
    )
  ).filter((x) => x !== null);

  const tipologias = imovel.tipologias.map((t) => ({
    _type: "tipologia" as const,
    _key: `q${t.quartos}`,
    rotulo: t.rotulo,
    quartos: t.quartos,
  }));

  const locais = imovel.locais.map((l, i) => ({
    _type: "local" as const,
    _key: `${l.tipo}-${i}`,
    tipo: l.tipo,
    endereco: l.endereco,
    ...(l.waze ? { waze: l.waze } : {}),
    ...(l.googleMaps ? { googleMaps: l.googleMaps } : {}),
  }));

  /** Campos que vem do scrape — seguros de reescrever a cada rodada. */
  const factuais = {
    nome: imovel.nome,
    slug: { _type: "slug" as const, current: imovel.slug },
    status: imovel.status,
    construtora: {
      _type: "reference" as const,
      _ref: `construtora-${imovel.construtoraSlug}`,
    },
    regiao: { _type: "reference" as const, _ref: `regiao-${imovel.regiaoSlug}` },
    locais,
    tipologias,
    diferenciais: imovel.diferenciais,
    origemCury: imovel.origemCury,
    ...(imovel.coordenadas
      ? { coordenadas: { _type: "geopoint" as const, ...imovel.coordenadas } }
      : {}),
    ...(imovel.textoLegal ? { textoLegal: imovel.textoLegal } : {}),
    ...(imovel.video ? { video: imovel.video } : {}),
  };

  const midia = { capa, galeria, plantas };

  /** Editorial: semeado na criacao, nunca reescrito depois. */
  const editorial = {
    publicado: true,
    destaque: false,
    ...(imovel.chamada ? { chamada: imovel.chamada } : {}),
  };

  if (dryRun) {
    console.log(
      `   [dry] ${imovel.nome} — ${galeria.length + 1} fotos, ${plantas.length} plantas, ` +
        `${locais.length} enderecos, ${tipologias.length} tipologias`,
    );
    return true;
  }

  await client.createIfNotExists({
    _id,
    _type: "imovel",
    ...factuais,
    ...midia,
    ...editorial,
  });
  await client
    .patch(_id)
    .set(forcarMidia ? { ...factuais, ...midia } : factuais)
    .commit();

  return true;
}

async function main() {
  const imoveis: ImovelNormalizado[] = JSON.parse(readFileSync(ENTRADA, "utf8"));

  console.log(
    `Importando ${imoveis.length} imoveis para "${dataset}"` +
      `${dryRun ? " (DRY RUN — nada sera escrito)" : ""}` +
      `${forcarMidia ? " [substituindo midia]" : ""}...\n`,
  );

  let ok = 0;
  for (const [i, imovel] of imoveis.entries()) {
    process.stdout.write(
      `\r   ${i + 1}/${imoveis.length} ${imovel.nome.slice(0, 40).padEnd(42)}`,
    );
    if (await importar(imovel)) ok++;
    if (!dryRun)
      writeFileSync(CACHE_ASSETS, JSON.stringify(cacheAssets, null, 2), "utf8");
  }
  process.stdout.write("\n");

  console.log(`\nOK: ${ok}/${imoveis.length} imoveis`);
  console.log(
    `   assets enviados: ${enviados} | reaproveitados do cache: ${reaproveitados}`,
  );
  if (!forcarMidia && !dryRun) {
    console.log(
      `   midia e campos editoriais preservados nos que ja existiam ` +
        `(use --forcar-midia para substituir as imagens)`,
    );
  }
}

main().catch((erro) => {
  console.error("\nFalhou:", erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
