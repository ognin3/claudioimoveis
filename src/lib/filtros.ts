import type { CardImovel } from "@/types/imovel";
import type { StatusImovel } from "@/components/ui/Badge";

/**
 * Filtro do catalogo. Roda 100% no cliente sobre a lista ja carregada — nenhum
 * request por clique, resposta instantanea. So faz sentido porque a projecao do
 * card e enxuta; se ela crescer, isto deixa de ser barato.
 *
 * O estado vive na URL para que um link filtrado possa ser anunciado no Meta:
 * /imoveis?quartos=2&status=lancamento
 */

export type Filtros = {
  regiao: string[];
  quartos: number[];
  status: StatusImovel[];
  construtora: string[];
};

export const filtrosVazios: Filtros = {
  regiao: [],
  quartos: [],
  status: [],
  construtora: [],
};

export function lerFiltros(params: URLSearchParams): Filtros {
  const lista = (chave: string) => (params.get(chave) ?? "").split(",").filter(Boolean);

  return {
    regiao: lista("regiao"),
    quartos: lista("quartos")
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 0),
    status: lista("status").filter((s): s is StatusImovel =>
      ["lancamento", "obras", "pronto"].includes(s),
    ),
    construtora: lista("construtora"),
  };
}

/** Devolve a query string canonica; vazia quando nao ha filtro. */
export function escreverFiltros(filtros: Filtros): string {
  const params = new URLSearchParams();
  if (filtros.regiao.length) params.set("regiao", filtros.regiao.join(","));
  if (filtros.quartos.length) params.set("quartos", filtros.quartos.join(","));
  if (filtros.status.length) params.set("status", filtros.status.join(","));
  if (filtros.construtora.length)
    params.set("construtora", filtros.construtora.join(","));
  return params.toString();
}

export function temFiltroAtivo(filtros: Filtros): boolean {
  return (
    filtros.regiao.length > 0 ||
    filtros.quartos.length > 0 ||
    filtros.status.length > 0 ||
    filtros.construtora.length > 0
  );
}

export function aplicarFiltros(
  imoveis: readonly CardImovel[],
  filtros: Filtros,
): CardImovel[] {
  return imoveis.filter((imovel) => {
    if (filtros.regiao.length && !filtros.regiao.includes(imovel.regiao.slug)) {
      return false;
    }
    if (
      filtros.construtora.length &&
      !filtros.construtora.includes(imovel.construtora.slug)
    ) {
      return false;
    }
    if (filtros.status.length && !filtros.status.includes(imovel.status)) {
      return false;
    }
    if (filtros.quartos.length) {
      // "3" no filtro significa "3 ou mais" — quem quer 3 aceita 4.
      const atende = filtros.quartos.some((q) =>
        q >= 3 ? imovel.quartos.some((n) => n >= 3) : imovel.quartos.includes(q),
      );
      if (!atende) return false;
    }
    return true;
  });
}

/** Alterna um valor dentro de uma lista de filtro. */
export function alternar<T>(lista: readonly T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

export const ROTULOS_QUARTOS: Array<{ valor: number; rotulo: string }> = [
  { valor: 0, rotulo: "Studio" },
  { valor: 1, rotulo: "1 quarto" },
  { valor: 2, rotulo: "2 quartos" },
  { valor: 3, rotulo: "3+ quartos" },
];

export const ROTULOS_ZONA: Record<string, string> = {
  "zona-portuaria": "Zona Portuária",
  "zona-norte": "Zona Norte",
  "zona-oeste": "Zona Oeste",
  centro: "Centro",
  niteroi: "Niterói",
  "sao-goncalo": "São Gonçalo",
  "baixada-fluminense": "Baixada Fluminense",
};
