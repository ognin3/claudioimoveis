"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * Studio embutido: o corretor entra em /studio, no mesmo dominio do site.
 *
 * POR QUE "use client" AQUI:
 * o padrao da doc do next-sanity e uma pagina server component, mas ai o
 * `sanity.config.ts` entra no grafo do servidor, o pacote `sanity` resolve pela
 * condicao `react-server` e o build morre em
 * `Export default doesn't exist in target module` — o build react-server do `swr`
 * nao tem export default. Marcando a pagina como client, o config so e resolvido
 * no grafo do navegador, onde o `swr` tem default. Ver CLAUDE.md secao 5.10.
 *
 * `metadata` e `viewport` ficam em ../layout.tsx, porque client component nao
 * pode exporta-los.
 */
export default function PaginaStudio() {
  return <NextStudio config={config} />;
}
