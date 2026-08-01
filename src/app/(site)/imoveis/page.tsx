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

function EsqueletoCatalogo() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="bg-sand-200/70 h-9 w-64 animate-pulse rounded-lg" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCardImovel key={i} />
        ))}
      </div>
    </div>
  );
}
