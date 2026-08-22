"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Carrossel sobre CSS scroll-snap. Sem biblioteca: o navegador ja faz arrasto,
 * inercia e snap nativamente, o que da rolagem melhor no mobile do que qualquer
 * lib JS — e custa ~1 KB em vez de 15-30 KB.
 *
 * Uso: galeria de fotos e de plantas do imovel (Fase 5).
 * Acessibilidade: a trilha e focavel e rola por teclado; cada slide e um listitem.
 */
export function Carousel({
  children,
  rotuloAcessivel,
  className,
}: {
  children: React.ReactNode[];
  rotuloAcessivel: string;
  className?: string;
}) {
  const trilhaRef = useRef<HTMLUListElement>(null);
  const [indice, setIndice] = useState(0);
  const total = children.length;

  const irPara = useCallback((alvo: number) => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const slide = trilha.children[alvo] as HTMLElement | undefined;
    if (!slide) return;
    // Atualiza o indicador na hora, sem esperar o scroll suave terminar: o dot
    // acender junto com o clique da a sensacao de resposta imediata. O listener
    // de scroll abaixo continua cuidando do caso de arrastar com o dedo.
    setIndice(alvo);
    trilha.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  // Deriva o indice da posicao real de scroll — mantem os dots corretos mesmo
  // quando a pessoa arrasta com o dedo em vez de usar as setas.
  useEffect(() => {
    const trilha = trilhaRef.current;
    if (!trilha) return;

    // Sem requestAnimationFrame de proposito: o navegador ja limita o evento de
    // scroll a taxa de quadros, e rAF fica estrangulado em aba oculta — os dots
    // e o aviso de leitor de tela congelariam no slide errado.
    const aoRolar = () => {
      const largura = trilha.clientWidth;
      if (largura <= 0) return;
      const atual = Math.round(trilha.scrollLeft / largura);
      setIndice((anterior) => (anterior === atual ? anterior : atual));
    };

    trilha.addEventListener("scroll", aoRolar, { passive: true });
    return () => trilha.removeEventListener("scroll", aoRolar);
  }, []);

  if (total === 0) return null;

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotuloAcessivel}
    >
      <ul
        ref={trilhaRef}
        tabIndex={0}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {children.map((slide, i) => (
          <li
            key={i}
            className="w-full shrink-0 snap-center"
            aria-label={`${i + 1} de ${total}`}
          >
            {slide}
          </li>
        ))}
      </ul>

      {total > 1 && (
        <>
          <BotaoNavegacao
            lado="anterior"
            desabilitado={indice === 0}
            onClick={() => irPara(indice - 1)}
          />
          <BotaoNavegacao
            lado="proximo"
            desabilitado={indice >= total - 1}
            onClick={() => irPara(indice + 1)}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {children.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-200",
                  i === indice ? "bg-noite-900 w-5" : "bg-noite-900/50 w-1.5",
                )}
              />
            ))}
          </div>

          {/* Estado textual para leitor de tela, sem poluir o visual. */}
          <p className="sr-only" aria-live="polite">
            Imagem {indice + 1} de {total}
          </p>
        </>
      )}
    </div>
  );
}

function BotaoNavegacao({
  lado,
  desabilitado,
  onClick,
}: {
  lado: "anterior" | "proximo";
  desabilitado: boolean;
  onClick: () => void;
}) {
  const Icone = lado === "anterior" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      aria-label={lado === "anterior" ? "Imagem anterior" : "Próxima imagem"}
      className={cn(
        "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full",
        "text-noite-100 bg-noite-900/80 ring-noite-700 shadow-[var(--shadow-card)] ring-1 backdrop-blur",
        "hover:bg-noite-700 transition-[transform,background-color,opacity] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-0",
        lado === "anterior" ? "left-3" : "right-3",
      )}
    >
      <Icone className="size-5" aria-hidden />
    </button>
  );
}
