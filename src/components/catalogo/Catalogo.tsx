"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip, ChipToggle } from "@/components/ui/Chip";
import { Sheet } from "@/components/ui/Sheet";
import { CardImovel } from "@/components/imovel/CardImovel";
import { rotuloStatus, type StatusImovel } from "@/components/ui/Badge";
import { linkWhatsApp } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import {
  ROTULOS_QUARTOS,
  ROTULOS_ZONA,
  alternar,
  aplicarFiltros,
  escreverFiltros,
  filtrosVazios,
  lerFiltros,
  temFiltroAtivo,
  type Filtros,
} from "@/lib/filtros";
import type {
  CardImovel as TipoCard,
  ConstrutoraResumo,
  RegiaoResumo,
} from "@/types/imovel";

const STATUS: StatusImovel[] = ["lancamento", "obras", "pronto"];
const POR_PAGINA = 12;

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

  const [sheetAberto, setSheetAberto] = useState(false);
  const [visiveis, setVisiveis] = useState(POR_PAGINA);

  const resultados = useMemo(() => aplicarFiltros(imoveis, filtros), [imoveis, filtros]);

  function atualizar(novos: Filtros) {
    const qs = escreverFiltros(novos);
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

  const controles = (
    <div className="space-y-6">
      <GrupoFiltro titulo="Quartos">
        {ROTULOS_QUARTOS.map(({ valor, rotulo }) => (
          <ChipToggle
            key={valor}
            ativo={filtros.quartos.includes(valor)}
            onClick={() =>
              atualizar({ ...filtros, quartos: alternar(filtros.quartos, valor) })
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
            onClick={() => atualizar({ ...filtros, status: alternar(filtros.status, s) })}
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
                atualizar({ ...filtros, regiao: alternar(filtros.regiao, r.slug) })
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
                atualizar({
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-brand-900 text-[length:var(--text-h1)] font-semibold">
          Imóveis disponíveis
        </h1>
        <p className="text-sand-600 mt-2">
          {resultados.length === imoveis.length
            ? `${imoveis.length} ${imoveis.length === 1 ? "empreendimento" : "empreendimentos"} no Grande Rio.`
            : `${resultados.length} de ${imoveis.length} empreendimentos.`}
        </p>
      </header>

      {/* Filtros: barra no desktop, bottom sheet no mobile. */}
      <div className="mb-8 hidden lg:block">{controles}</div>

      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <Button variant="outline" onClick={() => setSheetAberto(true)} className="flex-1">
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtrar
          {temFiltroAtivo(filtros) && (
            <span className="bg-brand-800 ml-1 grid size-5 place-items-center rounded-full text-xs text-white">
              {filtros.regiao.length +
                filtros.quartos.length +
                filtros.status.length +
                filtros.construtora.length}
            </span>
          )}
        </Button>
      </div>

      {temFiltroAtivo(filtros) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filtros.quartos.map((q) => (
            <Chip
              key={`q${q}`}
              onRemover={() =>
                atualizar({ ...filtros, quartos: alternar(filtros.quartos, q) })
              }
            >
              {ROTULOS_QUARTOS.find((r) => r.valor === q)?.rotulo}
            </Chip>
          ))}
          {filtros.status.map((s) => (
            <Chip
              key={s}
              onRemover={() =>
                atualizar({ ...filtros, status: alternar(filtros.status, s) })
              }
            >
              {rotuloStatus[s]}
            </Chip>
          ))}
          {filtros.regiao.map((slug) => (
            <Chip
              key={slug}
              onRemover={() =>
                atualizar({ ...filtros, regiao: alternar(filtros.regiao, slug) })
              }
            >
              {regioes.find((r) => r.slug === slug)?.nome ?? slug}
            </Chip>
          ))}
          {filtros.construtora.map((slug) => (
            <Chip
              key={slug}
              onRemover={() =>
                atualizar({
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
            onClick={() => atualizar(filtrosVazios)}
            className="text-brand-600 hover:text-brand-800 ml-1 font-sans text-sm font-medium underline underline-offset-2"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {resultados.length === 0 ? (
        <VazioSemResultado onLimpar={() => atualizar(filtrosVazios)} />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.slice(0, visiveis).map((imovel, i) => (
              <CardImovel key={imovel.id} imovel={imovel} prioridade={i < 3} />
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

      <Sheet
        open={sheetAberto}
        onOpenChange={setSheetAberto}
        titulo="Filtrar imóveis"
        rodape={
          <div className="flex gap-3">
            {temFiltroAtivo(filtros) && (
              <Button variant="ghost" onClick={() => atualizar(filtrosVazios)}>
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
    <div>
      <p className="text-sand-800 mb-2 font-sans text-sm font-semibold">{titulo}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function VazioSemResultado({ onLimpar }: { onLimpar: () => void }) {
  return (
    <div className="border-sand-200 rounded-[length:var(--radius-card)] border border-dashed py-16 text-center">
      <p className="font-display text-brand-900 text-xl font-semibold">
        Nenhum imóvel com esses filtros
      </p>
      <p className="text-sand-600 mx-auto mt-2 max-w-sm text-sm">
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
