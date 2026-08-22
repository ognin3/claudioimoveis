import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { buscarConfiguracoes } from "@/lib/sanity/fetch";
import { site } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Sobre o Cláudio",
  description:
    "Conheça Cláudio, corretor credenciado no Rio de Janeiro e especialista em imóveis Minha Casa Minha Vida.",
  alternates: { canonical: "/sobre" },
};

export default async function PaginaSobre() {
  const configuracoes = await buscarConfiguracoes();
  const foto = configuracoes?.fotoCorretor;

  return (
    <>
      <section className="relative isolate overflow-hidden pt-14 pb-24 sm:pt-20 sm:pb-32">
        <div className="bg-ouro-900/20 absolute top-0 right-[-12rem] -z-10 size-[32rem] rounded-full blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.72fr] lg:gap-20">
          <ScrollReveal variante="esquerda">
            <p className="text-ouro-400 font-sans text-sm font-semibold tracking-[0.16em] uppercase">
              Atendimento de verdade, do início às chaves
            </p>
            <h1 className="mt-5 text-[length:var(--text-display)] leading-[1.02] font-semibold">
              Um corretor ao seu lado, não um call center
            </h1>
            <p className="text-noite-300 mt-7 max-w-2xl text-lg leading-relaxed">
              {configuracoes?.sobreTexto || site.bio}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("whatsapp", "lg")}
              >
                <MessageCircle className="size-4" aria-hidden />
                Conversar com o Cláudio
              </a>
              <Link href="/imoveis" className={buttonClasses("accent", "lg")}>
                Conhecer os imóveis
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal atraso={120} variante="escala">
            <figure className="border-noite-700 bg-noite-900 relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border shadow-[var(--shadow-lift)]">
              {foto ? (
                <Image
                  src={foto.url}
                  alt="Cláudio, corretor de imóveis no Rio de Janeiro"
                  fill
                  sizes="(min-width: 1024px) 420px, 80vw"
                  quality={90}
                  placeholder={foto.lqip ? "blur" : "empty"}
                  blurDataURL={foto.lqip ?? undefined}
                  className="object-cover object-top"
                />
              ) : (
                <div className="from-noite-800 to-noite-950 grid h-full place-items-center bg-gradient-to-br">
                  <span className="text-ouro-400/80 font-display text-8xl font-semibold">
                    C
                  </span>
                </div>
              )}
              <figcaption className="from-noite-950 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-6 pt-20">
                <p className="font-display text-noite-50 text-xl font-semibold">
                  Cláudio Corretor
                </p>
                <p className="text-noite-300 mt-1 text-sm">{site.creci}</p>
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-noite-800 bg-noite-900/50 border-y py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <ScrollReveal>
            <p className="text-ouro-400 font-sans text-sm font-semibold tracking-[0.14em] uppercase">
              Como é o atendimento
            </p>
            <h2 className="mt-4 text-[length:var(--text-h2)] font-semibold">
              Clareza antes de qualquer decisão
            </h2>
            <p className="text-noite-400 mt-4 leading-relaxed">
              Cada família tem uma renda, uma rotina e um objetivo. Por isso, o ponto de
              partida é entender seu momento e mostrar apenas opções que façam sentido.
            </p>
          </ScrollReveal>

          <ol className="border-noite-800 border-l pl-6 sm:pl-10">
            <Etapa numero="01" titulo="Entender o que cabe no seu plano">
              Conversa direta sobre região, renda, entrada, FGTS e prazo para comprar.
            </Etapa>
            <Etapa numero="02" titulo="Comparar os empreendimentos certos">
              Fotos, plantas, lazer, localização e estágio da obra explicados sem pressa.
            </Etapa>
            <Etapa numero="03" titulo="Acompanhar até a assinatura">
              Apoio na simulação, proposta e documentação, sempre com o mesmo corretor.
            </Etapa>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <ScrollReveal className="border-ouro-800 bg-ouro-950/35 grid gap-8 rounded-[1.75rem] border p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <BadgeCheck className="text-ouro-400 size-7" aria-hidden />
            <h2 className="mt-4 text-[length:var(--text-h2)] font-semibold">
              Atendimento credenciado e sem custo para o comprador
            </h2>
            <p className="text-noite-400 mt-3 max-w-2xl leading-relaxed">
              Atuação no Rio de Janeiro, Niterói, São Gonçalo e Baixada, com foco em
              lançamentos e imóveis do programa Minha Casa Minha Vida.
            </p>
          </div>
          <div className="text-noite-200 flex items-center gap-3 font-sans text-sm font-semibold lg:justify-end">
            <MapPin className="text-ouro-400 size-5" aria-hidden />
            Grande Rio · {site.creci}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

function Etapa({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-noite-800 grid gap-2 border-b py-7 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-6">
      <span className="text-ouro-500 font-display text-lg" aria-hidden>
        {numero}
      </span>
      <div>
        <h3 className="text-xl font-semibold">{titulo}</h3>
        <p className="text-noite-400 mt-2 leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
