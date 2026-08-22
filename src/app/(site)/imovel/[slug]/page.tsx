import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, MapPin } from "lucide-react";
import { rotuloStatus } from "@/components/ui/Badge";
import { LeadForm } from "@/components/conversao/LeadForm";
import { MobileLeadCTA } from "@/components/conversao/MobileLeadCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { CardImovel } from "@/components/imovel/CardImovel";
import { GaleriaImovel } from "@/components/imovel/GaleriaImovel";
import { PlantaAmpliavel } from "@/components/imovel/PlantaAmpliavel";
import { LocalizacaoImovel } from "@/components/imovel/LocalizacaoImovel";
import { buscarImovel, buscarSlugsImoveis } from "@/lib/sanity/fetch";
import { descreverQuartos } from "@/lib/utils";
import { site } from "@/lib/site";
import type { PortableTextBlock } from "next-sanity";

/** Prerenderiza todos os imoveis publicados: sao poucos e viram landing de anuncio. */
export async function generateStaticParams() {
  const slugs = await buscarSlugsImoveis();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await buscarImovel(slug);
  if (!imovel) return {};

  const titulo = imovel.seo?.titulo ?? `${imovel.nome} — ${imovel.regiao.nome}`;
  const descricao =
    imovel.seo?.descricao ??
    imovel.chamada ??
    `${descreverQuartos(imovel.quartos)} em ${imovel.regiao.nome}. ${site.descricaoCurta}`;
  const imagem = imovel.seo?.imagem?.url ?? imovel.capa.url;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/imovel/${imovel.slug}` },
    openGraph: {
      title: titulo,
      description: descricao,
      images: [{ url: imagem, width: 1200, height: 630 }],
    },
  };
}

export default async function PaginaImovel({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const imovel = await buscarImovel(slug);
  if (!imovel) notFound();

  const ficha = imovel.fichaTecnica;
  const linhasFicha = [
    ficha?.totalUnidades && ["Unidades", String(ficha.totalUnidades)],
    ficha?.blocos && ["Blocos", String(ficha.blocos)],
    ficha?.pavimentos && ["Pavimentos", String(ficha.pavimentos)],
    ficha?.totalVagas && ["Vagas", String(ficha.totalVagas)],
    ficha?.areaTerreno && ["Terreno", `${ficha.areaTerreno.toLocaleString("pt-BR")} m²`],
    ficha?.entrega && ["Entrega", ficha.entrega],
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <article className="pb-20 lg:pb-0">
      <JsonLd
        dados={{
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          name: imovel.nome,
          url: `${site.url}/imovel/${imovel.slug}`,
          image: [imovel.capa.url, ...(imovel.galeria ?? []).map((foto) => foto.url)],
          description:
            imovel.chamada ??
            `${descreverQuartos(imovel.quartos)} em ${imovel.regiao.nome}`,
          address: {
            "@type": "PostalAddress",
            streetAddress:
              imovel.locais?.find((local) => local.tipo === "empreendimento")?.endereco ??
              imovel.locais?.[0]?.endereco,
            addressLocality: imovel.regiao.nome,
            addressRegion: "RJ",
            addressCountry: "BR",
          },
          ...(imovel.coordenadas
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: imovel.coordenadas.lat,
                  longitude: imovel.coordenadas.lng,
                },
              }
            : {}),
          ...(imovel.fichaTecnica?.totalUnidades
            ? { numberOfAccommodationUnits: imovel.fichaTecnica.totalUnidades }
            : {}),
        }}
      />
      <JsonLd
        dados={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: site.url },
            {
              "@type": "ListItem",
              position: 2,
              name: imovel.regiao.nome,
              item: `${site.url}/imoveis/${imovel.regiao.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: imovel.nome,
              item: `${site.url}/imovel/${imovel.slug}`,
            },
          ],
        }}
      />
      {/* Cabecalho */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="text-noite-400 flex flex-wrap items-center gap-2 font-sans text-xs font-semibold tracking-[0.1em] uppercase">
          <span className="text-ouro-400">{rotuloStatus[imovel.status]}</span>
          <span className="bg-noite-600 size-1 rounded-full" aria-hidden />
          <span>{imovel.construtora.nome}</span>
        </div>

        <h1 className="text-noite-50 mt-4 text-[length:var(--text-h1)] font-semibold">
          {imovel.nome}
        </h1>

        <p className="text-noite-400 mt-2 flex flex-wrap items-center gap-1.5">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {imovel.locais?.find((l) => l.tipo === "empreendimento")?.endereco ??
            imovel.locais?.[0]?.endereco ??
            imovel.regiao.nome}
        </p>
      </div>

      {/* Galeria */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <GaleriaImovel
          capa={imovel.capa}
          galeria={imovel.galeria ?? []}
          nome={imovel.nome}
        />
        <p className="text-noite-500 mt-2 font-sans text-xs">
          Imagens meramente ilustrativas.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-3">
        {/* Coluna de conteudo */}
        <div className="order-last lg:order-first lg:col-span-2">
          {imovel.descricao && imovel.descricao.length > 0 && (
            <section>
              <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
                Sobre o empreendimento
              </h2>
              <div className="text-noite-300 mt-4 space-y-4 leading-relaxed">
                {imovel.descricao.map((bloco) => (
                  <p key={bloco._key}>{textoDoBloco(bloco)}</p>
                ))}
              </div>
            </section>
          )}

          {imovel.tipologias.length > 0 && (
            <section className="mt-12">
              <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
                Opções de apartamento
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {imovel.tipologias.map((t) => (
                  <div
                    key={t.rotulo}
                    className="border-noite-800 bg-noite-900 rounded-[length:var(--radius-card)] border p-5"
                  >
                    {t.planta?.url && (
                      <PlantaAmpliavel
                        imagem={t.planta}
                        alt={`Planta ${t.rotulo} do ${imovel.nome}`}
                        rotulo={t.rotulo}
                        className="mb-4"
                      />
                    )}
                    <p className="text-noite-50 font-sans font-semibold">{t.rotulo}</p>
                    <p className="text-noite-400 mt-1 text-sm">
                      {t.quartos === 0 ? "Studio" : `${t.quartos} quartos`}
                      {t.areaPrivativa && ` · ${t.areaPrivativa} m²`}
                      {t.vagas ? ` · ${t.vagas} vaga${t.vagas > 1 ? "s" : ""}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Plantas que o scrape trouxe sem indicar a qual tipologia pertencem.
              Ficam numa galeria propria ate alguem identificar no Studio. */}
          {imovel.plantas && imovel.plantas.length > 0 && (
            <section className="mt-12">
              <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
                Plantas
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imovel.plantas.map((p, i) => (
                  <PlantaAmpliavel
                    key={p.url}
                    imagem={p}
                    alt={p.alt ?? `${imovel.nome} — planta ${i + 1}`}
                    rotulo={p.rotulo ?? `Planta ${i + 1}`}
                  />
                ))}
              </div>
              <p className="text-noite-500 mt-2 font-sans text-xs">
                Imagens meramente ilustrativas. Medidas sujeitas a alteração.
              </p>
            </section>
          )}

          {imovel.diferenciais && imovel.diferenciais.length > 0 && (
            <section className="mt-12">
              <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
                Lazer e diferenciais
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {imovel.diferenciais.map((d) => (
                  <li key={d} className="text-noite-300 flex items-center gap-2 text-sm">
                    <Check className="text-ouro-400 size-4 shrink-0" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {linhasFicha.length > 0 && (
            <section className="mt-12">
              <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
                Ficha técnica
              </h2>
              <dl className="border-noite-800 mt-4 grid gap-x-8 gap-y-3 border-t pt-4 sm:grid-cols-2">
                {linhasFicha.map(([rotulo, valor]) => (
                  <div key={rotulo} className="flex justify-between gap-4">
                    <dt className="text-noite-500 text-sm">{rotulo}</dt>
                    <dd className="text-noite-100 font-sans text-sm font-medium">
                      {valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <LocalizacaoImovel
            locais={imovel.locais}
            coordenadas={imovel.coordenadas}
            textoRegiao={imovel.textoRegiao}
            nome={imovel.nome}
            regiao={imovel.regiao.nome}
          />

          {imovel.textoLegal && (
            <p className="text-noite-400 border-noite-800 mt-12 border-t pt-6 text-xs leading-relaxed">
              {imovel.textoLegal}
            </p>
          )}
        </div>

        {/* Coluna de conversao — sticky no desktop */}
        <aside
          id="condicoes"
          className="order-first scroll-mt-28 lg:order-last lg:col-span-1"
        >
          <div className="sticky top-24 space-y-4">
            <dl className="border-noite-800 bg-noite-900 space-y-2 rounded-[length:var(--radius-card)] border p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-noite-500">Tipologias</dt>
                <dd className="text-noite-100 font-medium">
                  {descreverQuartos(imovel.quartos)}
                </dd>
              </div>
              {imovel.areaMin && (
                <div className="flex justify-between gap-4">
                  <dt className="text-noite-500">Área</dt>
                  <dd className="text-noite-100 font-medium">
                    {imovel.areaMin === imovel.areaMax
                      ? `${imovel.areaMin} m²`
                      : `${imovel.areaMin} a ${imovel.areaMax} m²`}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-noite-500">Região</dt>
                <dd className="text-noite-100 font-medium">{imovel.regiao.nome}</dd>
              </div>
            </dl>
            <LeadForm
              compacto
              imovel={{
                id: imovel.id,
                nome: imovel.nome,
                bairro: imovel.regiao.nome,
              }}
            />
            <p className="text-noite-400 mt-3 text-center font-sans text-xs">
              Resposta direta com o corretor · {site.creci}
            </p>
          </div>
        </aside>
      </div>

      {imovel.relacionados.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
            Outros imóveis em {imovel.regiao.nome}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {imovel.relacionados.map((r) => (
              <CardImovel key={r.id} imovel={r} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <Link
          href="/imoveis"
          className="text-ouro-400 hover:text-ouro-300 font-sans text-sm font-medium"
        >
          ← Ver todos os imóveis
        </Link>
      </div>

      <MobileLeadCTA />
    </article>
  );
}

/** O schema so permite paragrafo simples, entao extrair o texto basta. */
function textoDoBloco(bloco: PortableTextBlock): string {
  if (!Array.isArray(bloco.children)) return "";
  return bloco.children
    .map((filho) =>
      typeof filho === "object" && filho && "text" in filho ? String(filho.text) : "",
    )
    .join("");
}
