import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
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
import { buscarImoveisDestaque, buscarRegioes } from "@/lib/sanity/fetch";
import { linkWhatsApp } from "@/lib/whatsapp";
import { site } from "@/lib/site";

export default async function Home() {
  const [destaques, regioes] = await Promise.all([
    buscarImoveisDestaque(),
    buscarRegioes(),
  ]);

  const imagemHero = destaques[0]?.capa;
  const zonas = [...new Set(regioes.map((r) => r.zona))];
  const perguntas = perguntasFrequentes;

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
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {imagemHero ? (
            <Image
              src={imagemHero.url}
              alt=""
              fill
              sizes="100vw"
              priority
              fetchPriority="high"
              quality={45}
              placeholder={imagemHero.lqip ? "blur" : "empty"}
              blurDataURL={imagemHero.lqip ?? undefined}
              className="object-cover"
            />
          ) : (
            <div className="from-noite-800 to-noite-950 h-full w-full bg-gradient-to-br" />
          )}
          {/* Escurece o suficiente para o texto passar em contraste AA sobre qualquer foto. */}
          <div className="from-noite-950/95 via-noite-950/80 to-noite-950/35 absolute inset-0 bg-gradient-to-r" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-ouro-300 font-sans text-sm font-semibold tracking-[0.18em] uppercase">
              Minha Casa Minha Vida · Rio de Janeiro
            </p>

            <h1 className="text-noite-50 mt-5 text-[length:var(--text-display)] leading-[1.05] font-semibold">
              O sonho da casa própria com parcela que cabe no seu bolso
            </h1>

            <p className="text-noite-200 mt-6 max-w-xl text-lg leading-relaxed">
              Lançamentos e imóveis prontos no Rio, Niterói, São Gonçalo e Baixada.
              Entrada facilitada, lazer completo e a ajuda de quem conhece cada
              empreendimento de perto.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              <Faixa numero={site.creci.replace("CRECI ", "")} rotulo="CRECI" />
              {regioes.length >= 3 && (
                <Faixa numero={String(regioes.length)} rotulo="regiões atendidas" />
              )}
              {zonas.length >= 3 && (
                <Faixa numero={String(zonas.length)} rotulo="zonas do Grande Rio" />
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Em destaque */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
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
              className="text-ouro-400 hover:text-ouro-300 focus-visible:outline-ouro-400 inline-flex items-center gap-1 rounded font-sans text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Ver todos
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-ouro-400 flex items-center gap-2 font-sans text-sm font-semibold tracking-[0.14em] uppercase">
              <MapPin className="size-4" aria-hidden />
              Grande Rio
            </p>
            <h2 className="text-noite-50 mt-3 text-[length:var(--text-h2)] font-semibold">
              Encontre imóveis por região
            </h2>
            <p className="text-noite-400 mt-2">
              Páginas locais com os empreendimentos disponíveis em cada bairro e cidade.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regioes.map((regiao) => (
            <Link
              key={regiao.slug}
              href={`/imoveis/${regiao.slug}` as Route}
              className="border-noite-800 bg-noite-900 hover:border-ouro-700 hover:bg-noite-800 group flex min-h-16 items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-colors"
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
                className="text-ouro-500 size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- Como funciona */}
      <section className="bg-noite-900 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-noite-50 text-center text-[length:var(--text-h2)] font-semibold">
            Como funciona
          </h2>
          <p className="text-noite-400 mx-auto mt-3 max-w-xl text-center">
            Do primeiro contato às chaves na mão, sem burocracia e sem custo para você.
          </p>

          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            <Passo
              numero={1}
              Icone={Search}
              titulo="Escolha o imóvel"
              texto="Filtre por bairro e número de quartos e veja fotos, plantas e o que cada condomínio oferece."
            />
            <Passo
              numero={2}
              Icone={MessageCircle}
              titulo="Fale com o Cláudio"
              texto="Ele simula o financiamento, verifica seu subsídio do MCMV e diz exatamente quanto fica a parcela."
            />
            <Passo
              numero={3}
              Icone={KeyRound}
              titulo="Assine e receba as chaves"
              texto="Acompanhamento em toda a documentação, da proposta até a entrega do apartamento."
            />
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Sobre */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <h2 className="text-noite-50 text-[length:var(--text-h2)] font-semibold">
              Quem vai te atender
            </h2>
            <p className="text-noite-300 mt-4 text-lg leading-relaxed">{site.bio}</p>
            <p className="text-noite-400 mt-4 leading-relaxed">
              Corretor credenciado ({site.creci}), com atuação nos empreendimentos da
              Cury, JV, Direcional, Você RJ e Rebouças. O atendimento é direto com ele —
              sem call center, sem intermediário.
            </p>
            <div className="mt-8">
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "lg")}
              >
                <MessageCircle className="size-4" aria-hidden />
                Tirar uma dúvida
              </a>
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="bg-ouro-950 ring-ouro-800 rounded-[length:var(--radius-card)] p-8 ring-1">
              <BadgeCheck className="text-ouro-400 size-8" aria-hidden />
              <p className="font-display text-noite-50 mt-4 text-xl leading-snug font-semibold">
                Assessoria sem custo
              </p>
              <p className="text-noite-400 mt-2 text-sm leading-relaxed">
                A comissão do corretor é paga pela construtora. Você recebe orientação
                completa sobre subsídio, FGTS e financiamento sem pagar nada a mais por
                isso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- FAQ */}
      <section className="border-noite-800 mx-auto max-w-4xl border-t px-4 py-20 sm:px-6">
        <p className="text-ouro-400 text-center font-sans text-sm font-semibold tracking-[0.14em] uppercase">
          Respostas diretas
        </p>
        <h2 className="text-noite-50 mt-3 text-center text-[length:var(--text-h2)] font-semibold">
          Dúvidas sobre Minha Casa Minha Vida
        </h2>
        <p className="text-noite-400 mx-auto mt-3 max-w-2xl text-center">
          O essencial para começar sua busca com mais segurança.
        </p>
        <div className="mt-8 space-y-3">
          {perguntas.map((item) => (
            <details
              key={item.pergunta}
              className="border-noite-800 bg-noite-900 open:border-ouro-800 rounded-[length:var(--radius-card)] border px-5 py-4"
            >
              <summary className="text-noite-100 cursor-pointer font-sans font-semibold">
                {item.pergunta}
              </summary>
              <p className="text-noite-400 mt-3 max-w-3xl leading-relaxed">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA final */}
      <section className="bg-noite-900">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
          <div>
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
              className="text-ouro-400 hover:text-ouro-300 mt-7 inline-flex items-center gap-2 font-sans text-sm font-semibold"
            >
              Prefiro escolher um imóvel primeiro
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <LeadForm />
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

function Passo({
  numero,
  Icone,
  titulo,
  texto,
}: {
  numero: number;
  Icone: React.ComponentType<{ className?: string }>;
  titulo: string;
  texto: string;
}) {
  return (
    <li className="bg-noite-900 rounded-[length:var(--radius-card)] p-7 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <span className="bg-ouro-400 text-noite-950 grid size-9 shrink-0 place-items-center rounded-full font-sans text-sm font-semibold">
          {numero}
        </span>
        <Icone className="text-ouro-500 size-5" />
      </div>
      <h3 className="text-noite-50 mt-4 text-lg font-semibold">{titulo}</h3>
      <p className="text-noite-400 mt-2 text-sm leading-relaxed">{texto}</p>
    </li>
  );
}
