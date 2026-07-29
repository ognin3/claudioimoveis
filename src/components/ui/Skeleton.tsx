import { cn } from "@/lib/utils";

/**
 * Placeholder de carregamento. Com Cache Components o shell estatico ja vem
 * pronto, entao skeleton so aparece em fallback de <Suspense> de conteudo que
 * depende de request. Sempre com a MESMA altura do conteudo final, senao
 * introduz layout shift e derruba a meta de CLS < 0.05.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bg-sand-200/70 animate-pulse rounded-lg", className)}
    />
  );
}

/** Esqueleto de um card do catalogo — espelha as proporcoes do CardImovel. */
export function SkeletonCardImovel() {
  return (
    <div className="overflow-hidden rounded-[length:var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
