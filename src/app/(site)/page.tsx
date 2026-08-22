import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  ChevronRight,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CardImovel } from "@/components/imovel/CardImovel";
import { LeadForm } from "@/components/conversao/LeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buscarConfiguracoes,
  buscarImoveisDestaque,
  buscarRegioes,
} from "@/lib/sanity/fetch";
import { linkWhatsApp } from "@/lib/whatsapp";
import { site } from "@/lib/site";

export default async function Home() {
  const [destaques, regioes, configuracoes] = await Promise.all([
    buscarImoveisDestaque(),
    buscarRegioes(),
    buscarConfiguracoes(),
  ]);

  const imagemHero = destaques[0]?.imagemHero ?? destaques[0]?.capa;
  const zonas = [...new Set(regioes.map((r) => r.zona))];
  const perguntas = perguntasFrequentes;
  const regioesDestaque = [...regioes]
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
    .slice(0, 6);
  const fotoClaudio = configuracoes?.fotoCorretor;

  return (
    <>
      <JsonLd
        dados={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: site.nome,
              url: site.url,
              inLanguage: "pt-BR",
              description: site.descricaoCurta,
            },
            {
              "@type": "RealEstateAgent",
              name: site.nome,
              url: site.url,
              description: site.bio,
              telephone: `+${site.whatsapp}`,
              email: site.email,
              identifier: site.creci,
              areaServed: [
                { "@type": "City", name: "Rio de Janeiro" },
                { "@type": "City", name: "Niterói" },
                { "@type": "City", name: "Nova Iguaçu" },
                { "@type": "AdministrativeArea", name: "Baixada Fluminense" },
              ],
              knowsAbout: [
                "Minha Casa Minha Vida",
                "financiamento imobiliário",
                "apartamentos no Rio de Janeiro",
                "lançamentos imobiliários",
              ],
              sameAs: [site.instagram],
            },
            {
              "@type": "FAQPage",
              mainEntity: perguntas.map((item) => ({
                "@type": "Question",
                name: item.pergunta,
                acceptedAnswer: { "@type": "Answer", text: item.resposta },
              })),
            },
          ],
        }}
      />
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate -mt-20 overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          {imagemHero ? (
            <picture className="hero-scroll-media absolute inset-0">
              <source media="(max-width: 640px)" srcSet={srcHeroMobile(imagemHero.url)} />
              <Image
                src={imagemHero.url}
                alt=""
                fill
                sizes="110vw"
                loading="eager"
                fetchPriority="high"
                quality={80}
                placeholder={imagemHero.lqip ? "blur" : "empty"}
                blurDataURL={imagemHero.lqip ?? undefined}
                className="object-cover"
              />
            </picture>
          ) : (
            <div className="from-noite-800 to-noite-950 h-full w-full bg-gradient-to-br" />
          )}
          {/* Escurece o suficiente para o texto passar em contraste AA sobre qualquer foto. */}
          <div className="hero-scroll-shade from-noite-950/95 via-noite-950/80 to-noite-950/35 absolute inset-0 bg-gradient-to-r" />
          <div className="motion-hero-ambient absolute -top-32 right-[8%] size-[34rem] rounded-full" />
        </div>

        <div className="hero-scroll-content mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="motion-hero-item text-ouro-300 font-sans text-sm font-semibold tracking-[0.18em] uppercase">
              Minha Casa Minha Vida · Rio de Janeiro
            </p>

            <h1 className="motion-hero-item motion-delay-1 text-noite-50 mt-5 text-[length:var(--text-display)] leading-[1.05] font-semibold">
              O sonho da casa própria com parcela que cabe no seu bolso
            </h1>

            <p className="motion-hero-item motion-delay-2 text-noite-200 mt-6 max-w-xl text-lg leading-relaxed">
              Lançamentos e imóveis prontos no Rio, Niterói, São Gonçalo e Baixada.
              Entrada facilitada, lazer completo e a ajuda de quem conhece cada
              empreendimento de perto.
            </p>

            <div className="motion-hero-item motion-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/imoveis" className={buttonClasses("accent", "lg")}>
                Ver imóveis disponíveis
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("whatsapp", "lg")}
              >
                <MessageCircle className="size-4" aria-hidden />
                Falar agora no WhatsApp
              </a>
            </div>

            {/* Contadores so aparecem quando o numero ajuda a vender. "1 regiao
                atendida" enfraquece o hero — melhor omitir ate o catalogo encher. */}
            <dl className="motion-hero-item motion-delay-4 mt-12 flex flex-wrap gap-x-10 gap-y-4">
              <Faixa numero={site.creci.replace("CRECI ", "")} rotulo="CRECI" />
              {regioes.length >= 3 && (
                <Faixa numero={String(regioes.length)} rotulo="regiões atendidas" />
              )}
              {zonas.length >= 3 && (
                <Faixa numero={String(zonas.length)} rotulo="áreas do Rio e região" />
              )}
            </dl>
          </div>
        </div>
        <div className="hero-scroll-progress bg-ouro-400 absolute inset-x-0 bottom-0 h-px origin-left" />
      </section>

      {/* --------------------------------------------------------- Em destaque */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-noite-50 text-[length:var(--text-h2)] font-semibold">
                Em destaque agora
              </h2>
              <p className="text-noite-400 mt-2">
                Selecionados pelo Cláudio entre os lançamentos e obras do momento.
              </p>
            </div>
            <Link
              href="/imoveis"
              className="t-learn text-ouro-400 hover:text-ouro-300 focus-visible:outline-ouro-400 inline-flex items-center gap-1 rounded font-sans text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Ver todos
              <SetaAnimada />
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((imovel, i) => (
              <ScrollReveal key={imovel.id} atraso={i * 80}>
                <CardImovel imovel={imovel} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- Regioes SEO */}
      <section className="border-noite-800 mx-auto max-w-6xl border-t px-4 py-16 sm:px-6">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-ouro-400 flex items-center gap-2 font-sans text-sm font-semibold tracking-[0.14em] uppercase">
              <MapPin className="size-4" aria-hidden />
              Rio de Janeiro e região
            </p>
            <h2 className="text-noite-50 mt-3 text-[length:var(--text-h2)] font-semibold">
              Encontre imóveis por região
            </h2>
            <p className="text-noite-400 mt-2">
              Páginas locais com os empreendimentos disponíveis em cada bairro e cidade.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regioesDestaque.map((regiao, i) => (
            <ScrollReveal key={regiao.slug} atraso={(i % 3) * 40} className="h-full">
              <Link
                href={`/imoveis/${regiao.slug}` as Route}
                className="motion-card border-noite-800 bg-noite-900 hover:border-ouro-700 group flex h-full min-h-16 items-center justify-between gap-4 rounded-xl border px-5 py-4"
              >
                <span>
                  <span className="text-noite-100 block font-sans font-semibold">
                    {regiao.nome}
                  </span>
                  <span className="text-noite-500 mt-0.5 block font-sans text-xs">
                    {regiao.total}{" "}
                    {regiao.total === 1 ? "empreendimento" : "empreendimentos"}
                  </span>
                </span>
                <ChevronRight
                  className="text-ouro-500 size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {regioes.length > regioesDestaque.length ? (
          <ScrollReveal className="mt-7 flex justify-center">
            <Link
              href="/imoveis"
              className="t-learn text-ouro-400 hover:text-ouro-300 inline-flex items-center gap-2 font-sans text-sm font-semibold"
            >
              Ver todas as regiões
              <SetaAnimada />
            </Link>
          </ScrollReveal>
        ) : null}
      </section>

      {/* -------------------------------------------------------- Como funciona */}
      <section className="bg-noite-900 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-noite-50 text-center text-[length:var(--text-h2)] font-semibold">
              Como funciona
            </h2>
            <p className="text-noite-400 mx-auto mt-3 max-w-xl text-center">
              Do primeiro contato às chaves na mão, sem burocracia e sem custo para você.
            </p>
          </ScrollReveal>

          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            <Passo
              numero={1}
              atraso={0}
              Icone={Search}
              titulo="Escolha o imóvel"
              texto="Filtre por bairro e número de quartos e veja fotos, plantas e o que cada condomínio oferece."
            />
            <Passo
              numero={2}
              atraso={80}
              Icone={MessageCircle}
              titulo="Fale com o Cláudio"
              texto="Ele simula o financiamento, verifica seu subsídio do MCMV e diz exatamente quanto fica a parcela."
            />
            <Passo
              numero={3}
              atraso={160}
              Icone={KeyRound}
              titulo="Assine e receba as chaves"
              texto="Acompanhamento em toda a documentação, da proposta até a entrega do apartamento."
            />
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Sobre */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="border-noite-800 bg-noite-900 grid overflow-hidden rounded-[1.75rem] border lg:grid-cols-[0.72fr_1.28fr]">
          <ScrollReveal
            variante="escala"
            className="relative min-h-[25rem] lg:min-h-[38rem]"
          >
            {fotoClaudio ? (
              <Image
                src={fotoClaudio.url}
                alt="Cláudio, corretor de imóveis no Rio de Janeiro"
                fill
                sizes="(min-width: 1024px) 440px, 100vw"
                quality={90}
                placeholder={fotoClaudio.lqip ? "blur" : "empty"}
                blurDataURL={fotoClaudio.lqip ?? undefined}
                className="object-cover object-top"
              />
            ) : (
              <div className="from-noite-800 to-noite-950 h-full bg-gradient-to-br" />
            )}
            <div className="from-noite-950/80 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-6 pt-24 lg:hidden">
              <p className="font-display text-noite-50 text-2xl font-semibold">
                Cláudio Corretor
              </p>
              <p className="text-noite-300 mt-1 text-sm">{site.creci}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            className="flex flex-col justify-center p-7 sm:p-10 lg:p-14"
            atraso={100}
            variante="esquerda"
          >
            <p className="text-ouro-400 font-sans text-sm font-semibold tracking-[0.16em] uppercase">
              Quem fala com você é quem acompanha sua compra
            </p>
            <h2 className="mt-4 text-[length:var(--text-h2)] font-semibold">
              Atendimento direto com o Cláudio
            </h2>
            <p className="text-noite-300 mt-5 text-lg leading-relaxed">{site.bio}</p>
            <p className="text-noite-400 mt-4 leading-relaxed">
              Corretor credenciado, com atuação nos empreendimentos da Cury, JV,
              Direcional, Você RJ e Rebouças. Sem call center e sem troca de atendente no
              meio do caminho.
            </p>

            <div className="border-noite-800 mt-7 grid gap-4 border-y py-5 sm:grid-cols-3">
              <SeloConfianca titulo={site.creci} texto="credenciado" />
              <SeloConfianca titulo="Atendimento direto" texto="do início às chaves" />
              <SeloConfianca titulo="Sem custo" texto="para o comprador" />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "lg")}
              >
                <MessageCircle className="size-4" aria-hidden />
                Tirar uma dúvida
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("outline", "lg")}
              >
                <AtSign className="size-4" aria-hidden />
                Ver Instagram
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- FAQ */}
      <section className="border-noite-800 mx-auto max-w-4xl border-t px-4 py-20 sm:px-6">
        <ScrollReveal>
          <p className="text-ouro-400 text-center font-sans text-sm font-semibold tracking-[0.14em] uppercase">
            Respostas diretas
          </p>
          <h2 className="text-noite-50 mt-3 text-center text-[length:var(--text-h2)] font-semibold">
            Dúvidas sobre Minha Casa Minha Vida
          </h2>
          <p className="text-noite-400 mx-auto mt-3 max-w-2xl text-center">
            O essencial para começar sua busca com mais segurança.
          </p>
        </ScrollReveal>
        <div className="mt-8 space-y-3">
          {perguntas.map((item, i) => (
            <ScrollReveal key={item.pergunta} atraso={Math.min(i * 40, 200)}>
              <details className="motion-card border-noite-800 bg-noite-900 open:border-ouro-800 rounded-[length:var(--radius-card)] border px-5 py-4">
                <summary className="text-noite-100 cursor-pointer font-sans font-semibold">
                  {item.pergunta}
                </summary>
                <p className="text-noite-400 mt-3 max-w-3xl leading-relaxed">
                  {item.resposta}
                </p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA final */}
      <section className="bg-noite-900">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
          <ScrollReveal variante="esquerda">
            <p className="text-ouro-400 font-sans text-sm font-semibold tracking-[0.16em] uppercase">
              Simulação gratuita
            </p>
            <h2 className="text-noite-50 mt-3 text-[length:var(--text-h2)] font-semibold">
              Ainda dá tempo de sair do aluguel este ano
            </h2>
            <p className="text-noite-300 mt-4 max-w-xl text-lg leading-relaxed">
              Deixe seu contato para o Cláudio verificar subsídio, entrada e uma parcela
              possível para sua renda. Atendimento direto, sem call center.
            </p>
            <Link
              href="/imoveis"
              className="t-learn text-ouro-400 hover:text-ouro-300 mt-7 inline-flex items-center gap-2 font-sans text-sm font-semibold"
            >
              Prefiro escolher um imóvel primeiro
              <SetaAnimada />
            </Link>
          </ScrollReveal>
          <ScrollReveal atraso={120} variante="escala">
            <LeadForm />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

const perguntasFrequentes = [
  {
    pergunta: "Quem pode comprar pelo Minha Casa Minha Vida?",
    resposta:
      "O enquadramento depende da renda familiar, do imóvel e das regras vigentes no momento da análise. O Cláudio confere seu perfil e indica as opções compatíveis, sem compromisso.",
  },
  {
    pergunta: "Posso usar meu FGTS na compra do apartamento?",
    resposta:
      "Em muitos casos, sim. O uso do FGTS depende das regras do financiamento e da situação do comprador e do imóvel. A análise individual confirma se ele pode compor a entrada ou reduzir o saldo.",
  },
  {
    pergunta: "Preciso ter todo o valor da entrada?",
    resposta:
      "Não necessariamente. Algumas construtoras permitem parcelar parte da entrada durante a obra, mas as condições variam por empreendimento e perfil de crédito.",
  },
  {
    pergunta: "Como descubro se tenho direito a subsídio?",
    resposta:
      "O valor possível depende da renda, da composição familiar, da cidade e das regras atuais do programa. Uma simulação com seus dados mostra a condição real, sem prometer valor antes da análise.",
  },
  {
    pergunta: "Onde ficam os imóveis atendidos pelo Cláudio?",
    resposta:
      "Há opções no Rio de Janeiro, Porto Maravilha, São Cristóvão, Zona Norte, Zona Oeste, Niterói e Baixada Fluminense. O catálogo mostra apenas empreendimentos publicados e sujeitos à disponibilidade.",
  },
  {
    pergunta: "O atendimento do corretor tem custo para o comprador?",
    resposta:
      "Não. A orientação sobre escolha do imóvel, simulação e documentação não gera cobrança adicional para o comprador; a remuneração do corretor é feita pela construtora.",
  },
] as const;

function Faixa({ numero, rotulo }: { numero: string; rotulo: string }) {
  return (
    // `flex-col-reverse`: o <dt> vem antes no DOM (exigencia do <dl>) mas o
    // numero aparece em cima. Sem isso o rotulo seria lido duas vezes pelo
    // leitor de tela — um <dt> sr-only mais um <p> visivel com o mesmo texto.
    <div className="flex flex-col-reverse">
      <dt className="text-noite-300 mt-0.5 font-sans text-sm">{rotulo}</dt>
      <dd className="font-display text-noite-50 text-2xl font-semibold">{numero}</dd>
    </div>
  );
}

function SeloConfianca({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <BadgeCheck className="text-ouro-400 size-4 shrink-0" aria-hidden />
        <p className="text-noite-100 font-sans text-sm font-semibold">{titulo}</p>
      </div>
      <p className="text-noite-500 mt-1 pl-6 font-sans text-xs">{texto}</p>
    </div>
  );
}

function Passo({
  numero,
  atraso,
  Icone,
  titulo,
  texto,
}: {
  numero: number;
  atraso: number;
  Icone: React.ComponentType<{ className?: string }>;
  titulo: string;
  texto: string;
}) {
  return (
    <ScrollReveal
      as="li"
      atraso={atraso}
      className="motion-card bg-noite-900 rounded-[length:var(--radius-card)] p-7 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-3">
        <span className="bg-ouro-400 text-noite-950 grid size-9 shrink-0 place-items-center rounded-full font-sans text-sm font-semibold">
          {numero}
        </span>
        <Icone className="text-ouro-500 size-5" />
      </div>
      <h3 className="text-noite-50 mt-4 text-lg font-semibold">{titulo}</h3>
      <p className="text-noite-400 mt-2 text-sm leading-relaxed">{texto}</p>
    </ScrollReveal>
  );
}

function SetaAnimada() {
  return (
    <span className="t-learn-chevron" aria-hidden>
      <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current stroke-[1.5]">
        <path d="M2 8h8" />
        <path className="t-learn-arm t-learn-arm-top" d="M6 4l4 4" />
        <path className="t-learn-arm t-learn-arm-bot" d="M10 8l-4 4" />
      </svg>
    </span>
  );
}

/**
 * No mobile o hero e vertical, mas a foto de origem e horizontal. Recortar no
 * CDN evita baixar os pixels laterais que o `object-cover` descartaria de todo
 * jeito; o enquadramento continua central e a economia passa de 60%.
 */
function srcHeroMobile(src: string) {
  const url = new URL(src);
  url.searchParams.set("w", "480");
  url.searchParams.set("h", "1000");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("crop", "center");
  url.searchParams.set("q", "80");
  url.searchParams.set("auto", "format");
  return url.toString();
}
