"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { linkWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const links = [
  { href: "/imoveis", rotulo: "Imóveis", prefixos: ["/imoveis", "/imovel"] },
  { href: "/sobre", rotulo: "Sobre", prefixos: ["/sobre"] },
  { href: "/contato", rotulo: "Contato", prefixos: ["/contato"] },
] as const;

/**
 * Navegacao flutuante: fica sobre o hero na home e preserva uma margem de
 * respiro nas outras paginas. O menu mobile usa Dialog por acessibilidade.
 */
export function Header() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="border-noite-700/70 bg-noite-950/72 pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.95),inset_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:px-5">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label="Cláudio Corretor — página inicial"
        >
          <span
            className="bg-ouro-400 shadow-ouro-500/20 font-display text-noite-950 grid size-9 shrink-0 place-items-center rounded-xl text-lg font-semibold shadow-lg transition-transform duration-300 group-hover:-rotate-3"
            aria-hidden
          >
            C
          </span>
          <span className="min-w-0 leading-none">
            <span className="font-display text-noite-50 block truncate text-lg font-semibold sm:text-xl">
              Cláudio <span className="text-ouro-400">Corretor</span>
            </span>
            <span className="text-noite-500 mt-1 hidden font-sans text-[0.625rem] font-semibold tracking-[0.13em] uppercase sm:block">
              {site.creci} · Rio de Janeiro
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navegação principal"
        >
          {links.map((item) => {
            const ativo = item.prefixos.some((prefixo) => pathname.startsWith(prefixo));
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "motion-link relative rounded-lg px-3 py-2 font-sans text-sm font-medium",
                  ativo
                    ? "text-noite-50 after:bg-ouro-400 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px"
                    : "text-noite-400 hover:text-noite-50 hover:bg-white/[0.04]",
                )}
              >
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "sm", "hidden px-4 sm:inline-flex")}
          >
            <MessageCircle className="size-4" aria-hidden />
            Falar com o Cláudio
          </a>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-button bg-whatsapp text-noite-950 grid size-11 place-items-center rounded-xl sm:hidden"
            aria-label="Falar com o Cláudio no WhatsApp"
          >
            <MessageCircle className="size-5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            className="motion-button border-noite-700 bg-noite-900/80 text-noite-100 grid size-11 place-items-center rounded-xl border md:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={menuAberto} onOpenChange={setMenuAberto} titulo="Navegação">
        <nav className="grid gap-2" aria-label="Navegação mobile">
          {links.map((item, indice) => {
            const ativo = item.prefixos.some((prefixo) => pathname.startsWith(prefixo));
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setMenuAberto(false)}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "border-noite-800 flex min-h-14 items-center justify-between rounded-xl border px-4 font-sans font-semibold",
                  ativo
                    ? "bg-ouro-950/70 text-ouro-300 border-ouro-800"
                    : "bg-noite-900 text-noite-200",
                )}
              >
                <span>{item.rotulo}</span>
                <span className="text-noite-500 font-display text-sm" aria-hidden>
                  0{indice + 1}
                </span>
              </Link>
            );
          })}
        </nav>
        <p className="text-noite-500 mt-6 text-center font-sans text-xs">
          Atendimento direto · {site.creci}
        </p>
      </Sheet>
    </header>
  );
}
