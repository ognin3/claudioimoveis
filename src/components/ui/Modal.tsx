"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dialog centralizado. Dois usos previstos:
 *  1. pop-out do imovel na rota interceptada @modal/(.)imovel/[slug] (Fase 5);
 *  2. lightbox de foto e planta na galeria.
 *
 * Radix cuida de foco preso, Esc, scroll lock e aria — nao reimplementar a mao.
 * `Title` e obrigatorio para leitor de tela; se for visualmente escondido,
 * passar `tituloOculto`.
 *
 * SEM ANIMACAO DE SAIDA — de proposito. O Presence do Radix so desmonta o no
 * depois do `animationend`. Se a animacao nao progride (aba em segundo plano,
 * pagina sem compor frames, ou `prefers-reduced-motion` zerando a duracao), o
 * dialog fecha visualmente mas continua montado e o overlay trava a pagina
 * inteira. Num site de captacao isso derruba a conversao a zero.
 * Sem animacao de saida, `animationName` e `none` no fechamento e o Radix
 * desmonta na hora. Ver CLAUDE.md secao 5.8.
 */

export function Modal({
  open,
  onOpenChange,
  titulo,
  tituloOculto = false,
  descricao,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (aberto: boolean) => void;
  titulo: string;
  tituloOculto?: boolean;
  descricao?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm motion-safe:data-[state=open]:animate-[fade-in_200ms_ease-out]" />

        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain",
            "bg-noite-950 rounded-[length:var(--radius-card)] shadow-[var(--shadow-lift)]",
            "focus:outline-none",
            "motion-safe:data-[state=open]:animate-[modal-in_220ms_ease-out]",
            className,
          )}
        >
          {tituloOculto ? (
            <Dialog.Title className="sr-only">{titulo}</Dialog.Title>
          ) : (
            <Dialog.Title className="text-noite-50 px-6 pt-6 text-[length:var(--text-h3)] font-semibold">
              {titulo}
            </Dialog.Title>
          )}

          {descricao ? (
            <Dialog.Description className="sr-only">{descricao}</Dialog.Description>
          ) : null}

          <Dialog.Close
            className="text-noite-300 hover:text-noite-100 bg-noite-800/90 ring-noite-700 hover:bg-noite-700 absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full shadow-[var(--shadow-card)] ring-1 backdrop-blur transition-colors"
            aria-label="Fechar"
          >
            <X className="size-5" aria-hidden />
          </Dialog.Close>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
