"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileLeadCTA({ alvo = "condicoes" }: { alvo?: string }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const formulario = document.getElementById(alvo);
    if (!formulario) return;

    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(!entrada.isIntersecting),
      { threshold: 0.08 },
    );
    observador.observe(formulario);
    return () => observador.disconnect();
  }, [alvo]);

  return (
    <a
      href={`#${alvo}`}
      aria-hidden={!visivel}
      tabIndex={visivel ? undefined : -1}
      className={cn(
        "bg-ouro-400 text-noite-950 shadow-ouro-950/70 motion-button fixed right-24 bottom-3 left-3 z-30 flex h-14 items-center justify-center gap-2 rounded-full px-4 font-sans text-sm font-semibold shadow-xl transition-[opacity,transform] duration-300 lg:hidden",
        visivel
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-20 opacity-0",
      )}
    >
      Simular entrada e condições
      <ArrowRight className="size-4" aria-hidden />
    </a>
  );
}
