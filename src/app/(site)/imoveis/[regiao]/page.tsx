import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { CardImovel } from "@/components/imovel/CardImovel";
import { CardImovelDestaque } from "@/components/imovel/CardImovelDestaque";
import { LeadForm } from "@/components/conversao/LeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buscarRegiao, buscarRegioes } from "@/lib/sanity/fetch";
import { ROTULOS_ZONA } from "@/lib/filtros";
import { descreverQuartos } from "@/lib/utils";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const regioes = await buscarRegioes();
  return regioes.map((regiao) => ({ regiao: regiao.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ regiao: string }>;
}): Promise<Metadata> {
  const { regiao: slug } = await params;
  const regiao = await buscarRegiao(slug);
  if (!regiao) return {};

  const titulo = `Apartamentos à venda em ${regiao.nome}`;
  const descricao = `Veja ${regiao.imoveis.length} ${regiao.imoveis.length === 1 ? "empreendimento" : "empreendimentos"} em ${regiao.nome}. Fotos, plantas e condições do Minha Casa Minha Vida com atendimento direto do corretor.`;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/imoveis/${regiao.slug}` },
    openGraph: {
      title: `${titulo} — ${site.nome}`,
      description: descricao,
      url: `/imoveis/${regiao.slug}`,
      images: regiao.imoveis[0]?.capa.url
        ? [{ url: regiao.imoveis[0].capa.url }]
        : undefined,
    },
  };
}

export default async function PaginaRegiao({
  params,
}: {
  params: Promise<{ regiao: string }>;
}) {
  const { regiao: slug } = await params;
  const regiao = await buscarRegiao(slug);
  if (!regiao) notFound();

  const quartos = [...new Set(regiao.imoveis.flatMap((imovel) => imovel.quartos))].sort(
    (a, b) => a - b,
  );
  const zona = ROTULOS_ZONA[regiao.zona] ?? regiao.zona;
  const descricaoDireta =
    regiao.descricao ??
    `${regiao.nome} tem opções de apartamentos e lançamentos na ${zona}. Compare fotos, plantas, número de quartos e estágio da obra antes de consultar as condições com o Cláudio.`;
  const resumoDireto = resumirDescricao(descricaoDireta);
  const perguntas = criarPerguntas(regiao.nome, regiao.imoveis.length, quartos);

  return (
    <>
      <JsonLd
        dados={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: `Apartamentos à venda em ${regiao.nome}`,
              url: `${site.url}/imoveis/${regiao.slug}`,
              description: descricaoDireta,
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: regiao.imoveis.length,
                itemListElement: regiao.imoveis.map((imovel, indice) => ({
                  "@type": "ListItem",
                  position: indice + 1,
                  name: imovel.nome,
                  url: `${site.url}/imovel/${imovel.slug}`,
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: site.url },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Imóveis",
                  item: `${site.url}/imoveis`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: regiao.nome,
                  item: `${site.url}/imoveis/${regiao.slug}`,
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: perguntas.map((pergunta) => ({
                "@type": "Question",
                name: pergunta.pergunta,
                acceptedAnswer: { "@type": "Answer", text: pergunta.resposta },
              })),
            },
          ],
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Você está em" className="text-noite-500 font-sans text-xs">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-noite-300">
                Início
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <Link href="/imoveis" className="hover:text-noite-300">
                Imóveis
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="text-noite-300">
              {regiao.nome}
            </li>
          </ol>
        </nav>

        <header className="border-noite-800 mt-8 border-b pb-10">
          <p className="text-ouro-400 flex items-center gap-2 font-sans text-sm font-semibold tracking-[0.14em] uppercase">
            <MapPin className="size-4" aria-hidden />
            {zona}
          </p>
          <h1 className="text-noite-50 mt-3 max-w-4xl text-[length:var(--text-h1)] font-semibold">
            Apartamentos à venda em {regiao.nome}
          </h1>
          <p className="text-noite-300 mt-5 max-w-3xl text-lg leading-relaxed">
            {resumoDireto}
          </p>
          <p className="text-noite-400 mt-4 font-sans text-sm">
            {regiao.imoveis.length}{" "}
            {regiao.imoveis.length === 1
              ? "empreendimento disponível"
              : "empreendimentos disponíveis"}
            {quartos.length > 0 ? ` · ${descreverQuartos(quartos)}` : ""}
          </p>
        </header>

        <section className="py-12" aria-labelledby="imoveis-regiao">
          <h2
            id="imoveis-regiao"
            className="text-noite-50 text-[length:var(--text-h3)] font-semibold"
          >
            Imóveis disponíveis em {regiao.nome}
          </h2>
          {regiao.imoveis.length === 1 ? (
            <div className="mt-6">
              <CardImovelDestaque imovel={regiao.imoveis[0]} />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regiao.imoveis.map((imovel, indice) => (
                <CardImovel key={imovel.id} imovel={imovel} prioridade={indice === 0} />
              ))}
            </div>
          )}
        </section>

        {descricaoDireta !== resumoDireto ? (
          <section
            className="border-noite-800 border-t py-12"
            aria-labelledby="sobre-regiao"
          >
            <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <h2
                id="sobre-regiao"
                className="text-noite-50 text-[length:var(--text-h3)] font-semibold"
              >
                Morar em {regiao.nome}
              </h2>
              <p className="text-noite-300 leading-relaxed">{descricaoDireta}</p>
            </div>
          </section>
        ) : null}

        <section className="border-noite-800 grid gap-10 border-t py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
              Dúvidas sobre imóveis em {regiao.nome}
            </h2>
            <div className="mt-6 space-y-3">
              {perguntas.map((item) => (
                <details
                  key={item.pergunta}
                  className="border-noite-800 bg-noite-900 rounded-[length:var(--radius-card)] border px-5 py-4"
                >
                  <summary className="text-noite-100 cursor-pointer font-sans font-semibold">
                    {item.pergunta}
                  </summary>
                  <p className="text-noite-400 mt-3 text-sm leading-relaxed">
                    {item.resposta}
                  </p>
                </details>
              ))}
            </div>
          </div>
          <LeadForm />
        </section>

        <Link
          href="/imoveis"
          className="text-ouro-400 hover:text-ouro-300 inline-flex items-center gap-2 font-sans text-sm font-semibold"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Ver todas as regiões
        </Link>
      </div>
    </>
  );
}

function resumirDescricao(descricao: string) {
  const primeiraFrase = descricao.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  if (primeiraFrase && primeiraFrase.length >= 70) return primeiraFrase;
  if (descricao.length <= 190) return descricao;
  return `${descricao.slice(0, 187).trimEnd()}…`;
}

function criarPerguntas(nome: string, total: number, quartos: number[]) {
  return [
    {
      pergunta: `Existem imóveis Minha Casa Minha Vida em ${nome}?`,
      resposta: `A disponibilidade muda conforme o empreendimento e a análise de cada comprador. Esta página reúne ${total} ${total === 1 ? "opção publicada" : "opções publicadas"} em ${nome}; o Cláudio confirma quais unidades podem se enquadrar no programa no momento do atendimento.`,
    },
    {
      pergunta: `Quais tipos de apartamento estão disponíveis em ${nome}?`,
      resposta:
        quartos.length > 0
          ? `O catálogo atual possui ${descreverQuartos(quartos)}. Abra cada empreendimento para comparar fotos, plantas, área e lazer.`
          : "As tipologias variam por empreendimento. Abra os imóveis da região para comparar fotos, plantas e características.",
    },
    {
      pergunta: "Como consultar entrada, subsídio e valor da parcela?",
      resposta:
        "Preencha o formulário desta página. O Cláudio verifica disponibilidade e simula as condições de acordo com sua renda e seu perfil, sem custo e sem compromisso.",
    },
  ];
}
