import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalogo } from "@/components/catalogo/Catalogo";
import { SkeletonCardImovel } from "@/components/ui/Skeleton";
import { buscarConstrutoras, buscarImoveis, buscarRegioes } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Imóveis à venda no Rio de Janeiro",
  description:
    "Apartamentos Minha Casa Minha Vida no Rio, Niterói, São Gonçalo e Baixada. " +
    "Filtre por bairro, quartos e situação da obra.",
  alternates: { canonical: "/imoveis" },
};

/**
 * Catalogo. Os dados sao buscados no servidor (entram no shell estatico via
 * "use cache") e o filtro roda no cliente sobre a lista ja carregada — zero
 * request por clique.
 *
 * O <Suspense> e obrigatorio: o Catalogo usa `useSearchParams`, que conta como
 * dado de request sob Cache Components. Sem a fronteira, o build quebra.
 */
export default async function PaginaImoveis() {
  const [imoveis, regioes, construtoras] = await Promise.all([
    buscarImoveis(),
    buscarRegioes(),
    buscarConstrutoras(),
  ]);

  return (
    <Suspense fallback={<EsqueletoCatalogo />}>
      <Catalogo imoveis={imoveis} regioes={regioes} construtoras={construtoras} />
    </Suspense>
  );
}

/** Espelha o layout real (sidebar + grade) para nao haver salto ao hidratar. */
function EsqueletoCatalogo() {
  return (
    <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6">
      <div className="bg-noite-800/70 h-4 w-32 animate-pulse rounded" />
      <div className="mt-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
        <div className="border-noite-800 bg-noite-900 hidden h-[32rem] animate-pulse rounded-[length:var(--radius-card)] border lg:block" />
        <div>
          <div className="bg-noite-800/70 h-8 w-72 animate-pulse rounded-lg" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCardImovel key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
