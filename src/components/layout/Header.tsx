import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { linkWhatsApp } from "@/lib/whatsapp";
import { site } from "@/lib/site";

/**
 * Cabecalho. Server Component: sem menu hamburguer no mobile de proposito —
 * sao poucos links, cabem numa linha, e um drawer custaria JS no caminho critico
 * so para esconder duas palavras.
 */
export function Header() {
  return (
    <header className="site-header border-noite-800/80 bg-noite-950/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="focus-visible:outline-ouro-400 rounded focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="font-display text-noite-50 text-lg font-semibold">
            Cláudio
          </span>
          <span className="text-ouro-400 font-display text-lg font-semibold">
            {" "}
            Corretor
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/imoveis"
            className="motion-link text-noite-300 hover:bg-noite-900 hover:text-noite-50 focus-visible:outline-ouro-400 rounded-[length:var(--radius-pill)] px-3 py-2 font-sans text-sm font-medium focus-visible:outline-2"
          >
            Imóveis
          </Link>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "sm", "px-4")}
          >
            <MessageCircle className="size-4" aria-hidden />
            <span className="hidden sm:inline">Falar com o Cláudio</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </nav>
      </div>
      <span className="sr-only">{site.creci}</span>
    </header>
  );
}
