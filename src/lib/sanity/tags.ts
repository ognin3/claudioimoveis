/**
 * Tags de cache. Centralizadas para que a query e o webhook nunca discordem —
 * uma tag escrita errada de um lado significa conteudo que nunca atualiza.
 *
 * Invalidacao acontece em src/app/api/revalidate/route.ts, via `revalidateTag`.
 * (`updateTag` NAO serve ali: so funciona dentro de Server Action.)
 */
export const tags = {
  imoveis: "imoveis",
  imovel: (slug: string) => `imovel:${slug}`,
  regioes: "regioes",
  regiao: (slug: string) => `regiao:${slug}`,
  construtoras: "construtoras",
  depoimentos: "depoimentos",
  configuracoes: "configuracoes",
} as const;

/** Tipos de documento do Sanity que disparam invalidacao ao serem publicados. */
export function tagsParaDocumento(tipo: string, slug?: string): string[] {
  switch (tipo) {
    case "imovel":
      return slug ? [tags.imoveis, tags.imovel(slug)] : [tags.imoveis];
    case "regiao":
      // Mexer numa regiao muda os filtros do catalogo inteiro.
      return slug
        ? [tags.regioes, tags.regiao(slug), tags.imoveis]
        : [tags.regioes, tags.imoveis];
    case "construtora":
      return [tags.construtoras, tags.imoveis];
    case "depoimento":
      return [tags.depoimentos];
    case "configuracoes":
      return [tags.configuracoes];
    default:
      return [];
  }
}
