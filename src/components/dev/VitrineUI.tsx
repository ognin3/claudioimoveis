"use client";

import { useState } from "react";
import { MessageCircle, SlidersHorizontal } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Badge, BadgeStatus, type StatusImovel } from "@/components/ui/Badge";
import { Chip, ChipToggle } from "@/components/ui/Chip";
import { InputField } from "@/components/ui/Input";
import { Skeleton, SkeletonCardImovel } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Sheet } from "@/components/ui/Sheet";
import { Select } from "@/components/ui/Select";
import { Carousel } from "@/components/ui/Carousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { descreverQuartos } from "@/lib/utils";

const STATUS: StatusImovel[] = ["lancamento", "obras", "pronto"];

const PALETA = [
  {
    familia: "brand",
    tons: [
      { nome: "brand-100", classe: "bg-ouro-900" },
      { nome: "brand-300", classe: "bg-ouro-300" },
      { nome: "brand-500", classe: "bg-ouro-400" },
      { nome: "brand-700", classe: "bg-ouro-600" },
      { nome: "brand-900", classe: "bg-noite-900" },
    ],
  },
  {
    familia: "accent",
    tons: [
      { nome: "accent-100", classe: "bg-ouro-100" },
      { nome: "accent-300", classe: "bg-ouro-300" },
      { nome: "accent-500", classe: "bg-ouro-500" },
      { nome: "accent-700", classe: "bg-ouro-700" },
      { nome: "accent-900", classe: "bg-ouro-900" },
    ],
  },
  {
    familia: "sand",
    tons: [
      { nome: "noite-900", classe: "bg-noite-900" },
      { nome: "noite-700", classe: "bg-noite-700" },
      { nome: "noite-500", classe: "bg-noite-500" },
      { nome: "noite-300", classe: "bg-noite-300" },
      { nome: "noite-100", classe: "bg-noite-100" },
    ],
  },
] as const;

export function VitrineUI() {
  const [modalAberto, setModalAberto] = useState(false);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [ordem, setOrdem] = useState<string>();
  const [quartos, setQuartos] = useState<number[]>([2]);
  const [chips, setChips] = useState(["Porto Maravilha", "Em obras"]);

  const alternarQuarto = (q: number) =>
    setQuartos((atual) =>
      atual.includes(q) ? atual.filter((x) => x !== q) : [...atual, q],
    );

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-14">
        <p className="text-ouro-400 font-sans text-xs font-semibold tracking-[0.2em] uppercase">
          Fase 2 · uso interno
        </p>
        <h1 className="text-noite-50 mt-3 text-[length:var(--text-h1)] font-semibold">
          Design system
        </h1>
        <p className="text-noite-400 mt-3 max-w-xl">
          Vitrine dos primitivos. Esta rota é <code>noindex</code> e sai do ar antes do
          lançamento.
        </p>
      </header>

      <Secao titulo="Botões" nota="md tem 44px de altura — mínimo de alvo de toque.">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Ver imóveis</Button>
          <Button variant="accent">Quero uma simulação</Button>
          <Button variant="whatsapp">
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </Button>
          <Button variant="outline">Ver plantas</Button>
          <Button variant="ghost">Limpar</Button>
          <Button variant="primary" disabled>
            Desabilitado
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
          <a className={buttonClasses("outline", "md")} href="#botoes">
            Link com cara de botão
          </a>
        </div>
      </Secao>

      <Secao
        titulo="Selos"
        nota="As cores de status são as mesmas no card, no filtro e na página."
      >
        <div className="flex flex-wrap items-center gap-2">
          {STATUS.map((s) => (
            <BadgeStatus key={s} status={s} />
          ))}
          <Badge>Cury</Badge>
          <Badge>2 vagas</Badge>
          <Badge>45,6 m²</Badge>
        </div>
      </Secao>

      <Secao
        titulo="Chips de filtro"
        nota="Toggle para escolher; removível para mostrar o que está ativo."
      >
        <div className="flex flex-wrap items-center gap-2">
          {[0, 1, 2, 3].map((q) => (
            <ChipToggle
              key={q}
              ativo={quartos.includes(q)}
              onClick={() => alternarQuarto(q)}
            >
              {q === 0 ? "Studio" : `${q} quarto${q > 1 ? "s" : ""}`}
            </ChipToggle>
          ))}
        </div>
        <p className="text-noite-500 mt-3 font-sans text-sm">
          Selecionado: {quartos.length ? descreverQuartos(quartos) : "nada"}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <Chip key={c} onRemover={() => setChips((a) => a.filter((x) => x !== c))}>
              {c}
            </Chip>
          ))}
          {chips.length === 0 && (
            <button
              type="button"
              onClick={() => setChips(["Porto Maravilha", "Em obras"])}
              className="text-ouro-400 font-sans text-sm underline"
            >
              restaurar
            </button>
          )}
        </div>
      </Secao>

      <Secao
        titulo="Campos"
        nota="Label sempre visível. Erro ligado por aria-describedby."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Nome" placeholder="Seu nome" required />
          <InputField
            label="WhatsApp"
            type="tel"
            inputMode="numeric"
            placeholder="(21) 90000-0000"
            required
            dica="É por aqui que o Cláudio responde."
          />
          <InputField
            label="E-mail"
            type="email"
            defaultValue="email-invalido"
            erro="Digite um e-mail válido."
          />
        </div>
      </Secao>

      <Secao titulo="Select" nota="Só para listas longas. Poucas opções? Use ChipToggle.">
        <Select
          rotuloAcessivel="Ordenar imóveis"
          placeholder="Ordenar por"
          valor={ordem}
          onValorChange={setOrdem}
          opcoes={[
            { valor: "destaque", rotulo: "Destaques primeiro" },
            { valor: "lancamento", rotulo: "Lançamentos primeiro" },
            { valor: "az", rotulo: "Nome (A–Z)" },
          ]}
        />
      </Secao>

      <Secao titulo="Overlays" nota="Radix cuida de foco preso, Esc e scroll lock.">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setModalAberto(true)}>Abrir modal</Button>
          <Button variant="outline" onClick={() => setSheetAberto(true)}>
            <SlidersHorizontal className="size-4" aria-hidden />
            Abrir bottom sheet
          </Button>
        </div>

        <Modal
          open={modalAberto}
          onOpenChange={setModalAberto}
          titulo="Residencial Cartola"
          descricao="Exemplo do pop-out que a rota interceptada vai usar."
        >
          <div className="px-6 pt-3 pb-6">
            <div className="flex flex-wrap gap-2">
              <BadgeStatus status="obras" />
              <Badge>Cury</Badge>
              <Badge>São Cristóvão</Badge>
            </div>
            <p className="text-noite-300 mt-4">
              Na Fase 5 este mesmo conteúdo aparece como página dedicada em{" "}
              <code>/imovel/[slug]</code> e como este pop-out quando aberto a partir do
              catálogo — sem recarregar a página.
            </p>
          </div>
        </Modal>

        <Sheet
          open={sheetAberto}
          onOpenChange={setSheetAberto}
          titulo="Filtrar imóveis"
          rodape={
            <Button className="w-full" onClick={() => setSheetAberto(false)}>
              Ver 12 imóveis
            </Button>
          }
        >
          <p className="text-noite-200 font-sans text-sm font-medium">Quartos</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((q) => (
              <ChipToggle
                key={q}
                ativo={quartos.includes(q)}
                onClick={() => alternarQuarto(q)}
              >
                {q === 0 ? "Studio" : `${q}+`}
              </ChipToggle>
            ))}
          </div>
          <p className="text-noite-200 mt-6 font-sans text-sm font-medium">Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUS.map((s) => (
              <ChipToggle key={s} ativo={s === "obras"}>
                {s === "lancamento"
                  ? "Lançamento"
                  : s === "obras"
                    ? "Em obras"
                    : "Pronto"}
              </ChipToggle>
            ))}
          </div>
          <div className="h-64" />
        </Sheet>
      </Secao>

      <Secao
        titulo="Carrossel"
        nota="CSS scroll-snap. Arraste com o dedo ou use as setas."
      >
        <Carousel
          rotuloAcessivel="Fotos de exemplo"
          className="overflow-hidden rounded-[length:var(--radius-card)]"
        >
          {["brand", "accent", "sand"].map((tom, i) => (
            <div
              key={tom}
              className={`font-display grid aspect-[16/10] place-items-center text-3xl text-white ${
                tom === "brand"
                  ? "bg-ouro-600"
                  : tom === "accent"
                    ? "bg-ouro-500"
                    : "bg-noite-500"
              }`}
            >
              Foto {i + 1}
            </div>
          ))}
        </Carousel>
      </Secao>

      <Secao
        titulo="Skeleton"
        nota="Mesma altura do conteúdo final, para não gerar layout shift."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonCardImovel />
          <SkeletonCardImovel />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </Secao>

      <Secao
        titulo="ScrollReveal"
        nota="IntersectionObserver puro. Role para ver a cascata."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <ScrollReveal key={i} atraso={i * 90}>
              <div className="bg-noite-900 rounded-[length:var(--radius-card)] p-6 shadow-[var(--shadow-card)]">
                <p className="font-display text-noite-50 text-lg font-semibold">
                  Bloco {i + 1}
                </p>
                <p className="text-noite-400 mt-1 text-sm">
                  Revelado com {i * 90}ms de atraso.
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Tipografia"
        nota="Fraunces no display, Inter no corpo. Escala fluida com clamp()."
      >
        <div className="space-y-3">
          <p className="text-noite-50 text-[length:var(--text-display)] leading-[1.05] font-semibold">
            Display
          </p>
          <p className="text-noite-50 text-[length:var(--text-h1)] font-semibold">
            Título de página
          </p>
          <p className="text-noite-50 text-[length:var(--text-h2)] font-semibold">
            Título de seção
          </p>
          <p className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
            Título de card
          </p>
          <p className="text-noite-300 max-w-prose">
            Corpo de texto em Inter. A escala responde à largura da tela sem media query —
            no celular o display encolhe para 2,25rem e no desktop chega a 4,5rem.
          </p>
        </div>
      </Secao>

      <Secao titulo="Paleta" nota="Petróleo + âmbar sobre neutros quentes.">
        {/* Classes escritas por extenso de proposito: o Tailwind varre o codigo
            como texto, entao `bg-${familia}-${tom}` nunca seria gerado. */}
        <div className="space-y-4">
          {PALETA.map(({ familia, tons }) => (
            <div key={familia}>
              <p className="text-noite-300 mb-1.5 font-sans text-sm font-medium">
                {familia}
              </p>
              <div className="flex overflow-hidden rounded-lg">
                {tons.map(({ nome, classe }) => (
                  <div key={nome} className={`h-12 flex-1 ${classe}`} title={nome} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Secao>
    </div>
  );
}

function Secao({
  titulo,
  nota,
  children,
}: {
  titulo: string;
  nota?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-noite-800 mb-14 border-t pt-8">
      <h2 className="text-noite-50 text-[length:var(--text-h3)] font-semibold">
        {titulo}
      </h2>
      {nota && <p className="text-noite-500 mt-1 mb-5 font-sans text-sm">{nota}</p>}
      {!nota && <div className="mb-5" />}
      {children}
    </section>
  );
}
