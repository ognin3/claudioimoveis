import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/conversao/LeadForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale diretamente com Cláudio Corretor sobre apartamentos e lançamentos no Rio de Janeiro.",
  alternates: { canonical: "/contato" },
};

export default function PaginaContato() {
  return (
    <section className="relative isolate overflow-hidden pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="bg-ouro-900/20 absolute top-10 left-[-14rem] -z-10 size-[34rem] rounded-full blur-3xl" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <ScrollReveal variante="esquerda">
          <p className="text-ouro-400 font-sans text-sm font-semibold tracking-[0.16em] uppercase">
            Fale direto com o corretor
          </p>
          <h1 className="mt-5 text-[length:var(--text-display)] leading-[1.02] font-semibold">
            Vamos encontrar seu próximo endereço
          </h1>
          <p className="text-noite-300 mt-7 max-w-xl text-lg leading-relaxed">
            Conte o que você procura. O Cláudio responde pessoalmente, confere as opções
            disponíveis e ajuda a entender entrada, subsídio e financiamento.
          </p>

          <address className="mt-10 grid gap-3 not-italic">
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-card border-noite-800 bg-noite-900 flex min-h-20 items-center gap-4 rounded-2xl border px-5"
            >
              <span className="bg-whatsapp/15 text-whatsapp grid size-10 place-items-center rounded-xl">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <span>
                <span className="text-noite-500 block text-xs">WhatsApp</span>
                <span className="text-noite-100 font-sans font-semibold">
                  {site.whatsappExibicao}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="motion-card border-noite-800 bg-noite-900 flex min-h-20 items-center gap-4 rounded-2xl border px-5"
            >
              <span className="bg-ouro-950 text-ouro-400 grid size-10 place-items-center rounded-xl">
                <Mail className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="text-noite-500 block text-xs">E-mail</span>
                <span className="text-noite-100 block truncate font-sans font-semibold">
                  {site.email}
                </span>
              </span>
            </a>
          </address>

          <p className="text-noite-500 mt-7 font-sans text-sm">
            {site.creci} · Atendimento no Grande Rio
          </p>
        </ScrollReveal>

        <ScrollReveal atraso={120} variante="escala">
          <LeadForm className="bg-noite-900/85 shadow-[var(--shadow-lift)] backdrop-blur" />
        </ScrollReveal>
      </div>
    </section>
  );
}
