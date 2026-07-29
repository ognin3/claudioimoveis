/**
 * Popula construtoras e regioes — a base que os imoveis referenciam.
 * Idempotente: usa `createOrReplace` com _id deterministico, entao rodar duas
 * vezes nao duplica nada.
 *
 *   npm run seed
 *
 * Precisa de SANITY_API_WRITE_TOKEN em .env.local.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Faltam variaveis. Preencha NEXT_PUBLIC_SANITY_PROJECT_ID e SANITY_API_WRITE_TOKEN\n" +
      "em .env.local. O token sai de manage.sanity.io > API > Tokens (permissao Editor).",
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

const construtoras = [
  { slug: "cury", nome: "Cury" },
  { slug: "jv", nome: "JV — Jerônimo da Veiga" },
  { slug: "direcional", nome: "Direcional" },
  { slug: "voce-rj", nome: "Construtora Você RJ" },
  { slug: "reboucas", nome: "Rebouças" },
];

/**
 * Zonas atribuidas por nos, NAO derivadas da URL da Cury.
 *
 * Motivo: a URL da Cury e inconsistente para a mesma regiao — "Epicentro" fica
 * em /centro/ mas e Porto Maravilha, "Residencial Cartola" fica em
 * /zona-portuaria/ mas e Sao Cristovao. Herdar aquilo espalharia o mesmo bairro
 * por duas zonas no filtro.
 *
 * "Centro" foi dividido em dois: o scrape usa o mesmo nome para o Centro do Rio
 * (Saudosa Praca Onze) e para o Centro de Niteroi (Orla Central, Rio Branco 220).
 * Sem separar, quem filtra Centro do Rio receberia imovel em Niteroi.
 */
const regioes = [
  // Zona portuaria — o nucleo do portfolio (44% dos selecionados)
  { slug: "porto-maravilha", nome: "Porto Maravilha", zona: "zona-portuaria" },
  { slug: "santo-cristo", nome: "Santo Cristo", zona: "zona-portuaria" },
  {
    slug: "imperial-sao-cristovao",
    nome: "Imperial de São Cristóvão",
    zona: "zona-portuaria",
  },

  // Zona norte
  { slug: "sao-cristovao", nome: "São Cristóvão", zona: "zona-norte" },
  { slug: "iraja", nome: "Irajá", zona: "zona-norte" },
  { slug: "bonsucesso", nome: "Bonsucesso", zona: "zona-norte" },
  { slug: "olaria", nome: "Olaria", zona: "zona-norte" },
  { slug: "piedade", nome: "Piedade", zona: "zona-norte" },

  // Zona oeste
  { slug: "jacarepagua", nome: "Jacarepaguá", zona: "zona-oeste" },
  { slug: "campo-grande", nome: "Campo Grande", zona: "zona-oeste" },
  { slug: "recreio", nome: "Recreio dos Bandeirantes", zona: "zona-oeste" },

  // Centro do Rio
  { slug: "centro-rio", nome: "Centro", zona: "centro" },

  // Niteroi — "Centro" do scrape que na verdade e Niteroi
  { slug: "centro-niteroi", nome: "Centro de Niterói", zona: "niteroi" },
  { slug: "niteroi", nome: "Niterói", zona: "niteroi" },

  // Baixada — entrada dos lancamentos de JV e Direcional
  { slug: "nova-iguacu", nome: "Nova Iguaçu", zona: "baixada-fluminense" },
];

async function main() {
  const transacao = client.transaction();

  for (const c of construtoras) {
    transacao.createOrReplace({
      _id: `construtora-${c.slug}`,
      _type: "construtora",
      nome: c.nome,
      slug: { _type: "slug", current: c.slug },
    });
  }

  for (const r of regioes) {
    transacao.createOrReplace({
      _id: `regiao-${r.slug}`,
      _type: "regiao",
      nome: r.nome,
      zona: r.zona,
      slug: { _type: "slug", current: r.slug },
    });
  }

  await transacao.commit();
  console.log(
    `OK: ${construtoras.length} construtoras e ${regioes.length} regioes gravadas em "${dataset}".`,
  );
}

main().catch((erro) => {
  console.error("Falhou:", erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
