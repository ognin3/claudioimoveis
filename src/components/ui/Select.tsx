"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Select acessivel. Reservado para listas longas onde chip nao cabe —
 * ordenacao do catalogo e escolha de bairro dentro de uma zona.
 * Para poucas opcoes mutuamente exclusivas, prefira ChipToggle: 1 toque em vez de 2.
 */

export type OpcaoSelect = { valor: string; rotulo: string };

export function Select({
  valor,
  onValorChange,
  opcoes,
  placeholder = "Selecione",
  rotuloAcessivel,
  className,
}: {
  valor?: string;
  onValorChange: (valor: string) => void;
  opcoes: readonly OpcaoSelect[];
  placeholder?: string;
  /** Obrigatorio quando nao ha <label> visivel ligada ao gatilho. */
  rotuloAcessivel: string;
  className?: string;
}) {
  return (
    <RadixSelect.Root value={valor} onValueChange={onValorChange}>
      <RadixSelect.Trigger
        aria-label={rotuloAcessivel}
        className={cn(
          "bg-noite-900 inline-flex h-11 items-center justify-between gap-2 rounded-[length:var(--radius-pill)] px-4",
          "text-noite-200 ring-noite-700 font-sans text-sm font-medium ring-1 ring-inset",
          "hover:bg-noite-950 transition-colors",
          "focus-visible:ring-ouro-400 focus-visible:ring-2 focus-visible:outline-none",
          "data-[placeholder]:text-noite-500",
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="text-noite-500 size-4" aria-hidden />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="ring-noite-800 bg-noite-900 z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl shadow-[var(--shadow-lift)] ring-1 motion-safe:data-[state=open]:animate-[fade-in_140ms_ease-out]"
        >
          <RadixSelect.Viewport className="p-1.5">
            {opcoes.map((opcao) => (
              <RadixSelect.Item
                key={opcao.valor}
                value={opcao.valor}
                className={cn(
                  "relative flex h-10 cursor-pointer items-center rounded-lg pr-8 pl-3",
                  "text-noite-200 font-sans text-sm select-none",
                  "data-[highlighted]:bg-noite-800 data-[highlighted]:text-noite-50 data-[highlighted]:outline-none",
                  "data-[state=checked]:font-semibold",
                )}
              >
                <RadixSelect.ItemText>{opcao.rotulo}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="absolute right-2.5">
                  <Check className="text-ouro-400 size-4" aria-hidden />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
