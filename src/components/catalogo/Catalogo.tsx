"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Chip, ChipToggle } from "@/components/ui/Chip";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";
import { CardImovel } from "@/components/imovel/CardImovel";
import { rotuloStatus, type StatusImovel } from "@/components/ui/Badge";
import { linkWhatsApp } from "@/lib/whatsapp";
import {
  ROTULOS_QUARTOS,
  ROTULOS_ZONA,
  alternar,
  aplicarFiltros,
  escreverFiltros,
  filtrosVazios,
  lerFiltros,
  ordenar,
  temFiltroAtivo,
  type Filtros,
  type Ordenacao,
} from "@/lib/filtros";
import type {
  CardImovel as TipoCard,
  ConstrutoraResumo,
  RegiaoResumo,
} from "@/types/imovel";

const STATUS: StatusImovel[] = ["lancamento", "obras", "pronto"];
const POR_PAGINA = 12;

const OPCOES_ORDEM = [
  { valor: "destaque", rotulo: "Destaques primeiro" },
  { valor: "lancamento", rotulo: "Lançamentos primeiro" },
  { valor: "az", rotulo: "Nome (A–Z)" },
] as const;

/**
 * Catalogo. Layout inspirado nos portais de imovel: coluna fixa de filtros a
 * esquerda no desktop, resultados a direita, contagem sempre visivel.
 *
 * A coluna e `sticky` de proposito — o portal ensina que rolar a lista sem
 * perder o filtro de vista e o que faz a pessoa refinar em vez de desistir.
 * No mobile a mesma coluna vira bottom sheet.
 */
export function Catalogo({
  imoveis,
  regioes,
  construtoras,
}: {
  imoveis: TipoCard[];
  regioes: RegiaoResumo[];
  construtoras: ConstrutoraResumo[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const filtros = useMemo(() => lerFiltros(new URLSearchParams(params)), [params]);
  const ordem = (params.get("ordem") ?? "destaque") as Ordenacao;

  const [sheetAberto, setSheetAberto] = useState(false);
  const [visiveis, setVisiveis] = useState(POR_PAGINA);

  const resultados = useMemo(
    () => ordenar(aplicarFiltros(imoveis, filtros), ordem),
    [imoveis, filtros, ordem],
  );

  function navegar(novos: Filtros, novaOrdem: Ordenacao = ordem) {
    const qs = escreverFiltros(novos, novaOrdem);
    // `scroll: false`: mexer no filtro nao deve jogar a pessoa para o topo.
    router.replace(qs ? `/imoveis?${qs}` : "/imoveis", { scroll: false });
    setVisiveis(POR_PAGINA);
  }

  const regioesPorZona = useMemo(() => {
    const mapa = new Map<string, RegiaoResumo[]>();
    for (const r of regioes) {
      const atual = mapa.get(r.zona) ?? [];
      atual.push(r);
      mapa.set(r.zona, atual);
    }
    return [...mapa.entries()];
  }, [regioes]);

  const qtdFiltros =
    filtros.regiao.length +
    filtros.quartos.length +
    filtros.status.length +
    filtros.construtora.length;

  const controles = (
    <div className="divide-noite-800 divide-y">
      <GrupoFiltro titulo="Quartos">
        {ROTULOS_QUARTOS.map(({ valor, rotulo }) => (
          <ChipToggle
            key={valor}
            ativo={filtros.quartos.includes(valor)}
            onClick={() =>
              navegar({ ...filtros, quartos: alternar(filtros.quartos, valor) })
            }
          >
            {rotulo}
          </ChipToggle>
        ))}
      </GrupoFiltro>

      <GrupoFiltro titulo="Situação da obra">
        {STATUS.map((s) => (
          <ChipToggle
            key={s}
            ativo={filtros.status.includes(s)}
            onClick={() => navegar({ ...filtros, status: alternar(filtros.status, s) })}
          >
            {rotuloStatus[s]}
          </ChipToggle>
        ))}
      </GrupoFiltro>

      {regioesPorZona.map(([zona, lista]) => (
        <GrupoFiltro key={zona} titulo={ROTULOS_ZONA[zona] ?? zona}>
          {lista.map((r) => (
            <ChipToggle
              key={r.slug}
              ativo={filtros.regiao.includes(r.slug)}
              onClick={() =>
                navegar({ ...filtros, regiao: alternar(filtros.regiao, r.slug) })
              }
            >
              {r.nome}
              {r.total ? <span className="ml-1.5 opacity-60">{r.total}</span> : null}
            </ChipToggle>
          ))}
        </GrupoFiltro>
      ))}

      {construtoras.length > 1 && (
        <GrupoFiltro titulo="Construtora">
          {construtoras.map((c) => (
            <ChipToggle
              key={c.slug}
              ativo={filtros.construtora.includes(c.slug)}
              onClick={() =>
                navegar({
                  ...filtros,
                  construtora: alternar(filtros.construtora, c.slug),
                })
              }
            >
              {c.nome}
            </ChipToggle>
          ))}
        </GrupoFiltro>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6">
      <nav aria-label="Você está em" className="text-noite-500 font-sans text-xs">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-noite-300 transition-colors">
              Início
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="text-noite-300">
            Imóveis
          </li>
        </ol>
      </nav>

      <div className="mt-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
        {/* ------------------------------------------------ Coluna de filtros */}
        <aside className="hidden lg:block">
          <div className="border-noite-800 bg-noite-900 sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-[length:var(--radius-card)] border px-5 py-1">
            <div className="border-noite-800 flex items-center justify-between border-b py-4">
              <p className="text-noite-50 font-sans text-sm font-semibold">Filtros</p>
              {temFiltroAtivo(filtros) && (
                <button
                  type="button"
                  onClick={() => navegar(filtrosVazios)}
                  className="text-ouro-400 hover:text-ouro-300 font-sans text-xs font-medium"
                >
                  Limpar ({qtdFiltros})
                </button>
              )}
            </div>
            {controles}
          </div>
        </aside>

        {/* --------------------------------------------------- Resultados */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[length:var(--text-h3)] font-semibold">
              {resultados.length}{" "}
              {resultados.length === 1
                ? "empreendimento disponível"
                : "empreendimentos disponíveis"}
              <span className="text-noite-400 font-sans text-base font-normal">
                {" "}
                no Grande Rio
              </span>
            </h1>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSheetAberto(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="size-4" aria-hidden />
                Filtrar
                {qtdFiltros > 0 && (
                  <span className="bg-ouro-400 text-noite-950 ml-1 grid size-5 place-items-center rounded-full text-xs font-semibold">
                    {qtdFiltros}
                  </span>
                )}
              </Button>

              <Select
                rotuloAcessivel="Ordenar imóveis"
                valor={ordem}
                onValorChange={(v) => navegar(filtros, v as Ordenacao)}
                opcoes={OPCOES_ORDEM}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {temFiltroAtivo(filtros) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {filtros.quartos.map((q) => (
                <Chip
                  key={`q${q}`}
                  onRemover={() =>
                    navegar({ ...filtros, quartos: alternar(filtros.quartos, q) })
                  }
                >
                  {ROTULOS_QUARTOS.find((r) => r.valor === q)?.rotulo}
                </Chip>
              ))}
              {filtros.status.map((s) => (
                <Chip
                  key={s}
                  onRemover={() =>
                    navegar({ ...filtros, status: alternar(filtros.status, s) })
                  }
                >
                  {rotuloStatus[s]}
                </Chip>
              ))}
              {filtros.regiao.map((slug) => (
                <Chip
                  key={slug}
                  onRemover={() =>
                    navegar({ ...filtros, regiao: alternar(filtros.regiao, slug) })
                  }
                >
                  {regioes.find((r) => r.slug === slug)?.nome ?? slug}
                </Chip>
              ))}
              {filtros.construtora.map((slug) => (
                <Chip
                  key={slug}
                  onRemover={() =>
                    navegar({
                      ...filtros,
                      construtora: alternar(filtros.construtora, slug),
                    })
                  }
                >
                  {construtoras.find((c) => c.slug === slug)?.nome ?? slug}
                </Chip>
              ))}
              <button
                type="button"
                onClick={() => navegar(filtrosVazios)}
                className="text-ouro-400 hover:text-ouro-300 ml-1 font-sans text-sm font-medium underline underline-offset-2"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {resultados.length === 0 ? (
            <VazioSemResultado onLimpar={() => navegar(filtrosVazios)} />
          ) : (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {resultados.slice(0, visiveis).map((imovel, i) => (
                  <CardImovel
                    key={imovel.id}
                    imovel={imovel}
                    prioridade={i === 0}
                    nivelTitulo="h2"
                  />
                ))}
              </div>

              {resultados.length > visiveis && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisiveis((v) => v + POR_PAGINA)}
                  >
                    Carregar mais ({resultados.length - visiveis} restantes)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet
        open={sheetAberto}
        onOpenChange={setSheetAberto}
        titulo="Filtrar imóveis"
        rodape={
          <div className="flex gap-3">
            {temFiltroAtivo(filtros) && (
              <Button variant="ghost" onClick={() => navegar(filtrosVazios)}>
                Limpar
              </Button>
            )}
            <Button className="flex-1" onClick={() => setSheetAberto(false)}>
              Ver {resultados.length} {resultados.length === 1 ? "imóvel" : "imóveis"}
            </Button>
          </div>
        }
      >
        {controles}
      </Sheet>
    </div>
  );
}

function GrupoFiltro({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4">
      <p className="text-noite-200 mb-3 font-sans text-sm font-semibold">{titulo}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function VazioSemResultado({ onLimpar }: { onLimpar: () => void }) {
  return (
    <div className="border-noite-800 mt-6 rounded-[length:var(--radius-card)] border border-dashed py-16 text-center">
      <p className="font-display text-noite-50 text-xl font-semibold">
        Nenhum imóvel com esses filtros
      </p>
      <p className="text-noite-400 mx-auto mt-2 max-w-sm text-sm">
        Talvez o Cláudio tenha algo parecido que ainda não está no site. Vale perguntar.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button variant="outline" onClick={onLimpar}>
          Limpar filtros
        </Button>
        <a
          href={linkWhatsApp({ tipo: "catalogo" })}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "md")}
        >
          Perguntar no WhatsApp
        </a>
      </div>
    </div>
  );
}
