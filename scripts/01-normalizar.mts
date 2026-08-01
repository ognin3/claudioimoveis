/**
 * Etapa 1 do pipeline: le os `dados.json` do scrape da Cury, cruza com a
 * selecao do corretor e produz um JSON normalizado + relatorio de lacunas.
 *
 *   npm run pipeline:normalizar
 *
 * NAO grava nada no Sanity. So le do disco e escreve em data/.
 *
 * O campo `sold` do scrape e IGNORADO de proposito: ele marca como vendido todos
 * os Lancamentos e Em Obras, que estao a venda. Disponibilidade vem da planilha
 * do corretor. Ver CLAUDE.md 5.1.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  extrairQuartos,
  limparVideo,
  mapearRegiao,
  mapearStatus,
  mapearTipoLocal,
  rotuloTipologia,
  slugDaUrl,
  zonaDaUrl,
} from "./lib/normalizar.mts";

const BASE_SCRAPE = String.raw`C:\projetos\scrapping-curry\output\rj_imoveis`;
const SELECAO = "docs/selecao-corretor.json";
const SAIDA = "data/imoveis.normalizado.json";
/** Acima disso a pagina fica pesada e ninguem rola ate o fim. */
const TETO_FOTOS = 12;

type Selecionado = { pasta: string; nome: string };

type ImagemFonte = { arquivo: string; caminho: string };

export type ImovelNormalizado = {
  slug: string;
  nome: string;
  status: "lancamento" | "obras" | "pronto";
  construtoraSlug: string;
  regiaoSlug: string;
  chamada: string | null;
  quartos: number[];
  tipologias: Array<{ rotulo: string; quartos: number }>;
  diferenciais: string[];
  textoLegal: string | null;
  video: string | null;
  coordenadas: { lat: number; lng: number } | null;
  locais: Array<{
    tipo: "empreendimento" | "stand" | "decorado";
    endereco: string;
    waze: string | null;
    googleMaps: string | null;
  }>;
  capa: ImagemFonte;
  galeria: ImagemFonte[];
  plantas: ImagemFonte[];
  origemCury: string;
};

const avisos: string[] = [];
const erros: string[] = [];

function normalizar(sel: Selecionado): ImovelNormalizado | null {
  const dir = join(BASE_SCRAPE, sel.pasta);
  const bruto = JSON.parse(readFileSync(join(dir, "dados.json"), "utf8"));

  const slug = slugDaUrl(bruto.url);
  const zona = zonaDaUrl(bruto.url);
  const regiaoSlug = mapearRegiao(bruto.region ?? "", zona);
  if (!regiaoSlug) {
    erros.push(`${bruto.title}: regiao "${bruto.region}" sem mapeamento (zona ${zona})`);
    return null;
  }

  const quartos = extrairQuartos(bruto.bedrooms);
  if (quartos.length === 0) {
    erros.push(
      `${bruto.title}: nao consegui extrair quartos de ${JSON.stringify(bruto.bedrooms)}`,
    );
    return null;
  }

  // Fotos: aplica o teto. Plantas entram todas — sao poucas e leves.
  const fotos: ImagemFonte[] = (bruto.photos ?? [])
    .slice(0, TETO_FOTOS)
    .map((f: { file: string }) => ({
      arquivo: f.file,
      caminho: join(dir, "fotos", f.file),
    }));

  const plantas: ImagemFonte[] = (bruto.plants ?? []).map((f: { file: string }) => ({
    arquivo: f.file,
    caminho: join(dir, "plantas", f.file),
  }));

  // Capa: o banner desktop quando existe (24 dos 39 nao tem), senao a 1a foto.
  const banner = bruto.banners?.desktop?.file;
  const capa: ImagemFonte | null = banner
    ? { arquivo: banner, caminho: join(dir, "banners", banner) }
    : (fotos[0] ?? null);
  if (!capa) {
    erros.push(`${bruto.title}: sem banner e sem fotos — impossivel montar a capa`);
    return null;
  }

  if (fotos.length === 0) avisos.push(`${bruto.title}: sem fotos (so a capa)`);
  if (plantas.length === 0) avisos.push(`${bruto.title}: sem plantas`);

  const locais = (bruto.locations ?? [])
    .filter((l: { address?: string }) => l.address?.trim())
    .map((l: { type: string; address: string; waze?: string; google_maps?: string }) => ({
      tipo: mapearTipoLocal(l.type ?? ""),
      endereco: l.address.trim(),
      waze: l.waze?.trim() || null,
      googleMaps: l.google_maps?.trim() || null,
    }));

  const coord = bruto.coordinates?.[0];

  return {
    slug,
    nome: bruto.title.trim(),
    status: mapearStatus(bruto.status?.label ?? ""),
    construtoraSlug: "cury",
    regiaoSlug,
    // `highlight_text` e curto e ja e uma chamada de venda ("2 e 3 quartos Lazer Completo").
    chamada: bruto.highlight_text?.trim() || null,
    quartos,
    tipologias: quartos.map((q) => ({ rotulo: rotuloTipologia(q), quartos: q })),
    diferenciais: (bruto.amenities ?? [])
      .filter((a: { hidden?: boolean }) => !a.hidden)
      .map((a: { name: string }) => a.name.trim())
      .filter(Boolean),
    textoLegal: bruto.legal_text?.trim() || null,
    video: limparVideo(bruto.video_tour) ?? limparVideo(bruto.presentation_video),
    coordenadas: coord ? { lat: coord.lat, lng: coord.lng } : null,
    locais,
    capa,
    // A capa sai da galeria quando veio da 1a foto, para nao repetir a imagem.
    galeria: banner ? fotos : fotos.slice(1),
    plantas,
    origemCury: bruto.url,
    // DESCRICAO NAO E COPIADA: o texto da Cury geraria conteudo duplicado e
    // derrubaria o SEO. Fica vazio para ser reescrito no Studio. Ver CLAUDE.md 5.5.
  };
}

function main() {
  const selecionados: Selecionado[] = JSON.parse(
    readFileSync(SELECAO, "utf8"),
  ).selecionados;

  console.log(`Normalizando ${selecionados.length} imoveis selecionados...\n`);

  const imoveis = selecionados
    .map(normalizar)
    .filter((i): i is ImovelNormalizado => i !== null);

  mkdirSync("data", { recursive: true });
  writeFileSync(SAIDA, JSON.stringify(imoveis, null, 2), "utf8");

  const totalFotos = imoveis.reduce((n, i) => n + i.galeria.length + 1, 0);
  const totalPlantas = imoveis.reduce((n, i) => n + i.plantas.length, 0);

  console.log(`OK: ${imoveis.length} imoveis -> ${SAIDA}`);
  console.log(`   imagens a otimizar: ${totalFotos} fotos + ${totalPlantas} plantas`);
  console.log(
    `   por status: ${["lancamento", "obras", "pronto"]
      .map((s) => `${s} ${imoveis.filter((i) => i.status === s).length}`)
      .join(" | ")}`,
  );

  if (avisos.length) {
    console.log(`\nAVISOS (${avisos.length}) — importa mesmo assim:`);
    for (const a of avisos) console.log(`   - ${a}`);
  }
  if (erros.length) {
    console.log(`\nERROS (${erros.length}) — estes ficaram DE FORA:`);
    for (const e of erros) console.log(`   - ${e}`);
    process.exitCode = 1;
  }
}

main();
