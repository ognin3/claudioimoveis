/**
 * Cria UM imovel completo no Sanity, com imagens reais, para validar a cadeia
 * inteira antes da Fase 4: upload de asset -> documento -> projecao GROQ.
 *
 *   npm run exemplo -- <pasta-com-os-renders>
 *
 * Dados da ficha tecnica extraidos do book oficial (docs/MATERIAL-NOVO.md secao 3).
 * Idempotente: _id fixo, entao rodar de novo substitui em vez de duplicar.
 *
 * ESTE SCRIPT E TEMPORARIO. A importacao de verdade e a Fase 4; quando ela
 * existir, este arquivo pode sair.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const pastaRenders = process.argv[2];

if (!projectId || !token) {
  console.error(
    "Faltam NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_API_WRITE_TOKEN em .env.local.",
  );
  process.exit(1);
}
if (!pastaRenders) {
  console.error("Uso: npm run exemplo -- <pasta-com-os-renders>");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-01",
  useCdn: false,
});

/** Sobe um arquivo e devolve a referencia pronta para o campo `image`. */
async function subirImagem(arquivo: string, alt: string) {
  const binario = await readFile(join(pastaRenders, arquivo));
  const asset = await client.assets.upload("image", binario, { filename: arquivo });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
    alt,
  };
}

const galeriaFontes: Array<[string, string]> = [
  ["cc_06_p07.jpeg", "Fachada do Conceito Califórnia"],
  ["cc_09_p10.jpeg", "Quadra poliesportiva"],
  ["cc_11_p12.jpeg", "Espaço fitness coberto"],
  ["cc_12_p13.jpeg", "Quadra de beach tennis"],
  ["cc_16_p17.jpeg", "Churrasqueira coberta"],
  ["cc_18_p19.jpeg", "Salão de festas"],
  ["cc_19_p20.jpeg", "Playground infantil"],
  ["cc_24_p25.jpeg", "Pet place"],
  ["cc_28_p29.jpeg", "Living do apartamento decorado"],
  ["cc_30_p31.jpeg", "Dormitório do apartamento decorado"],
];

async function main() {
  console.log("Subindo imagens...");
  const capa = await subirImagem(
    "cc_13_p14.jpeg",
    "Complexo aquático do Conceito Califórnia",
  );

  const galeria = [];
  for (const [arquivo, alt] of galeriaFontes) {
    try {
      galeria.push({
        _key: arquivo.replace(/\W/g, ""),
        ...(await subirImagem(arquivo, alt)),
      });
    } catch {
      console.warn(`  aviso: ${arquivo} nao encontrado, seguindo sem ele`);
    }
  }
  console.log(`  capa + ${galeria.length} fotos na galeria`);

  const doc = {
    _id: "imovel-conceito-california",
    _type: "imovel",
    nome: "Conceito Califórnia",
    slug: { _type: "slug", current: "conceito-california" },
    publicado: true,
    destaque: true,
    ordem: 1,
    status: "lancamento",
    construtora: { _type: "reference", _ref: "construtora-jv" },
    regiao: { _type: "reference", _ref: "regiao-nova-iguacu" },
    endereco: "Rua Carlos Laert, 35 — Vila Nova, Nova Iguaçu - RJ",
    chamada: "2 quartos com varanda e lazer completo em Nova Iguaçu",
    descricao: [
      {
        _key: "p1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "s1",
            _type: "span",
            marks: [],
            text:
              "Um condomínio de 900 apartamentos em Nova Iguaçu, pensado para quem quer " +
              "sair do aluguel sem abrir mão de lazer. São 6 blocos com apartamentos de " +
              "2 quartos com varanda, além de 60 unidades garden com área privativa maior.",
          },
        ],
      },
      {
        _key: "p2",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "s2",
            _type: "span",
            marks: [],
            text:
              "A área de lazer é o ponto forte: complexo aquático, quadra poliesportiva, " +
              "beach tennis, fitness coberto e ao ar livre, salão de festas, churrasqueiras, " +
              "playground, pet place, horta e até mini mercado dentro do condomínio.",
          },
        ],
      },
    ],
    diferenciais: [
      "Complexo aquático",
      "Quadra poliesportiva",
      "Beach tennis",
      "Espaço fitness interno",
      "Espaço fitness externo",
      "Churrasqueira coberta",
      "Churrasqueira americana",
      "Salão de festas",
      "Mini mercado",
      "Pet place",
      "Car wash",
      "Playground baby",
      "Playground kids",
      "Horta",
      "Bicicletário",
    ],
    tipologias: [
      {
        _key: "tipo",
        _type: "tipologia",
        rotulo: "Apartamento tipo",
        quartos: 2,
        areaPrivativa: 45.6,
        vagas: 1,
      },
      {
        _key: "garden",
        _type: "tipologia",
        rotulo: "Garden",
        quartos: 2,
        areaPrivativa: 124.4,
        vagas: 1,
      },
    ],
    fichaTecnica: {
      areaTerreno: 14325,
      blocos: 6,
      pavimentos: 15,
      totalUnidades: 900,
      totalVagas: 502,
    },
    capa,
    galeria,
  };

  await client.createOrReplace(doc);
  console.log('OK: imovel "Conceito Califórnia" criado e publicado.');
}

main().catch((erro) => {
  console.error("Falhou:", erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
