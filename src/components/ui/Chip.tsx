"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Chip de filtro ativo no catalogo ("Jacarepaguá ✕", "2 quartos ✕").
 * Existe para o usuario enxergar o que esta filtrando sem reabrir o painel —
 * sem isso ele ve "nenhum resultado" e nao entende por que.
 */

export function Chip({
  children,
  onRemover,
  className,
}: {
  children: React.ReactNode;
  /** Rotulo acessivel do X e o proprio conteudo do chip. */
  onRemover?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-ouro-950/60 inline-flex items-center gap-1 rounded-[length:var(--radius-pill)] py-1 pr-1 pl-3",
        "text-ouro-300 ring-ouro-800 font-sans text-sm font-medium ring-1 ring-inset",
        className,
      )}
    >
      {children}
      {onRemover && (
        <button
          type="button"
          onClick={onRemover}
          // 28px: unica excecao a regra dos 44px do projeto. Um X de 44px dentro
          // de um chip de filtro ficaria maior que o proprio chip. Atende o
          // minimo de 24px do WCAG 2.5.8 (AA), e o chip nunca e a unica forma de
          // limpar o filtro — sempre existe "Limpar filtros" ao lado.
          className="text-ouro-400 hover:bg-ouro-900 hover:text-noite-50 grid size-7 shrink-0 place-items-center rounded-full transition-colors"
        >
          <X className="size-3.5" aria-hidden />
          <span className="sr-only">Remover filtro</span>
        </button>
      )}
    </span>
  );
}

/**
 * Chip selecionavel (toggle) usado na barra de filtros: quartos, status, construtora.
 * Botao real, com `aria-pressed` — leitor de tela anuncia o estado.
 */
export function ChipToggle({
  ativo,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { ativo: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      className={cn(
        // h-11 (44px): e o controle mais tocado do catalogo no mobile.
        "inline-flex h-11 items-center rounded-[length:var(--radius-pill)] px-4",
        "font-sans text-sm font-medium whitespace-nowrap transition-colors",
        "ring-1 ring-inset",
        ativo
          ? "bg-ouro-400 ring-ouro-400 text-noite-950"
          : "text-noite-300 ring-noite-700 hover:bg-noite-800 bg-noite-900",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
