"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela o conteudo quando ele entra na viewport. IntersectionObserver puro —
 * a alternativa (Framer Motion) custaria ~40 KB gzip no caminho critico e
 * estouraria a meta de < 110 KB de JS inicial.
 *
 * O CONTEUDO NUNCA COMECA INVISIVEL. Esta e a regra que manda aqui.
 * A versao anterior renderizava `opacity-0` e so revelava quando o observer
 * disparava — e o observer nao dispara se o JS falhar, se o navegador for
 * antigo ou se a pagina nao estiver compondo quadros. Numa landing de vendas
 * isso significa cartao de imovel invisivel e conversao zero, sem nenhum erro
 * no console para denunciar. Verificado aqui: o card ficou em opacity 0.
 *
 * Agora a animacao e puramente decorativa: entra por cima de um conteudo que ja
 * esta visivel. Se nada disparar, a pessoa so nao ve o efeito.
 *
 * Usa ref callback com cleanup (React 19) em vez de useEffect.
 */
export function ScrollReveal({
  children,
  atraso = 0,
  className,
  as: Componente = "div",
  variante = "subir",
}: {
  children: React.ReactNode;
  /** Escalonamento em ms, para revelar cards de uma grade em cascata. */
  atraso?: number;
  className?: string;
  as?: "div" | "li";
  variante?: "subir" | "esquerda" | "escala";
}) {
  const [animar, setAnimar] = useState(false);

  const observarRef = useCallback((elemento: HTMLElement | null) => {
    if (!elemento) return;

    // Quem pediu menos movimento nao recebe animacao nenhuma.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setAnimar(true);
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
    <Componente
      ref={observarRef}
      // `backwards` em vez de `both`: a animacao aplica o quadro inicial so
      // durante o atraso, e o elemento volta ao estado natural (visivel) ao fim.
      className={cn(animar && `motion-reveal motion-reveal--${variante}`, className)}
      style={animar && atraso ? { animationDelay: `${atraso}ms` } : undefined}
    >
      {children}
    </Componente>
  );
}
