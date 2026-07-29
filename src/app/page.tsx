import { site } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

/**
 * Placeholder da Fase 1. Existe para validar tokens, fontes e o pipeline de deploy.
 * A home de verdade e construida na Fase 5 — ver docs/PLANO-DE-ACAO.md.
 */
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl text-center">
        <p className="text-brand-500 font-sans text-sm font-medium tracking-[0.2em] uppercase">
          {site.creci}
        </p>

        <h1 className="text-brand-900 mt-6 text-[length:var(--text-display)] leading-[1.05] font-semibold">
          {site.nome}
        </h1>

        <p className="text-sand-700 mx-auto mt-6 max-w-md text-lg leading-relaxed">
          {site.bio}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-whatsapp hover:bg-whatsapp-dark inline-flex h-12 w-full items-center justify-center rounded-[length:var(--radius-pill)] px-8 font-sans font-semibold text-white shadow-[var(--shadow-card)] transition-colors sm:w-auto"
          >
            Falar no WhatsApp
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="border-sand-300 text-sand-800 hover:bg-sand-100 inline-flex h-12 w-full items-center justify-center rounded-[length:var(--radius-pill)] border px-8 font-sans font-medium transition-colors sm:w-auto"
          >
            Instagram
          </a>
        </div>

        <p className="text-sand-500 mt-12 font-sans text-sm">
          Site em construção — catálogo completo em breve.
        </p>
      </div>
    </main>
  );
}
