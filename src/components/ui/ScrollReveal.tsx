"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela o conteudo quando ele entra na viewport. IntersectionObserver puro —
 * a alternativa (Framer Motion) custaria ~40 KB gzip no caminho critico e
 * estouraria a meta de < 110 KB de JS inicial.
 *
 * Usa ref callback com cleanup (React 19) em vez de useEffect: o observer nasce
 * junto com o no e morre com ele, sem setState no corpo de um efeito.
 */
export function ScrollReveal({
  children,
  atraso = 0,
  className,
}: {
  children: React.ReactNode;
  /** Escalonamento em ms, para revelar cards de uma grade em cascata. */
  atraso?: number;
  className?: string;
}) {
  // "oculto" -> aguardando entrar na viewport
  // "revelando" -> entrou, roda a animacao
  // "imediato" -> reduced-motion: aparece sem animacao nenhuma
  const [estado, setEstado] = useState<"oculto" | "revelando" | "imediato">("oculto");

  const observarRef = useCallback((elemento: HTMLDivElement | null) => {
    if (!elemento) return;

    // Quem pediu menos movimento recebe o conteudo direto, sem observer e sem
    // classe de animacao: com `fill-mode: both`, uma animacao que nao progride
    // deixaria o conteudo travado no quadro inicial (opacity 0).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEstado("imediato");
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setEstado("revelando");
        // Revelar uma unica vez: reanimar ao rolar de volta irrita.
        observador.disconnect();
      },
      // Dispara um pouco antes de entrar de fato, para nao "pipocar" na tela.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={observarRef}
      className={cn(
        estado === "revelando" && "animate-[revelar_600ms_ease-out_both]",
        estado === "oculto" && "opacity-0",
        className,
      )}
      style={
        estado === "revelando" && atraso ? { animationDelay: `${atraso}ms` } : undefined
      }
    >
      {children}
    </div>
  );
}
