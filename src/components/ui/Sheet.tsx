"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet — painel que sobe pelo rodape. Uso principal: os filtros do
 * catalogo no mobile, onde barra de filtros horizontal nao cabe.
 *
 * O rodape e `sticky` de proposito: o botao "Ver N imoveis" precisa ficar sempre
 * visivel enquanto a pessoa rola as opcoes, senao ela filtra e nao sabe como sair.
 */

export function Sheet({
  open,
  onOpenChange,
  titulo,
  children,
  rodape,
  className,
}: {
  open: boolean;
  onOpenChange: (aberto: boolean) => void;
  titulo: string;
  children: React.ReactNode;
  /** Area fixa no rodape, tipicamente o botao de aplicar. */
  rodape?: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="motion-overlay-enter fixed inset-0 z-50 bg-black/70" />

        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col",
            "bg-noite-950 rounded-t-[length:var(--radius-card)] shadow-[var(--shadow-lift)]",
            "focus:outline-none",
            // Sem animacao de saida — mesma razao do Modal. Ver CLAUDE.md 5.8.
            // `motion-safe:` e obrigatorio aqui: a entrada parte de translateY(100%),
            // entao se a animacao nao progredir o painel fica FORA da tela.
            "motion-sheet-enter",
            className,
          )}
        >
          {/* Alca visual: sinaliza que o painel e arrastavel/fechavel. */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="bg-noite-700 h-1 w-10 rounded-full" aria-hidden />
          </div>

          <div className="border-noite-800 flex items-center justify-between border-b px-5 pb-3">
            <Dialog.Title className="font-display text-noite-50 text-lg font-semibold">
              {titulo}
            </Dialog.Title>
            <Dialog.Close
              className="text-noite-400 hover:bg-noite-900 hover:text-noite-100 grid size-10 place-items-center rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {children}
          </div>

          {rodape && (
            <div className="border-noite-800 bg-noite-950 border-t px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {rodape}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
