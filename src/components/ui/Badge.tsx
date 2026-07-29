import { cn } from "@/lib/utils";

/**
 * Selo de status do imovel. As tres cores vem dos tokens e sao as MESMAS no card,
 * no filtro e na pagina do imovel — status precisa ser reconhecivel de relance.
 * Ver globals.css: --color-status-*.
 */

export type StatusImovel = "lancamento" | "obras" | "pronto";

export const rotuloStatus: Record<StatusImovel, string> = {
  lancamento: "Lançamento",
  obras: "Em obras",
  pronto: "Pronto para morar",
};

const coresStatus: Record<StatusImovel, string> = {
  lancamento: "bg-status-lancamento/10 text-status-lancamento ring-status-lancamento/20",
  obras: "bg-status-obras/10 text-status-obras ring-status-obras/20",
  pronto: "bg-status-pronto/10 text-status-pronto ring-status-pronto/20",
};

export function BadgeStatus({
  status,
  className,
}: {
  status: StatusImovel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[length:var(--radius-pill)] px-2.5 py-1",
        "font-sans text-xs font-semibold ring-1 ring-inset",
        coresStatus[status],
        className,
      )}
    >
      {rotuloStatus[status]}
    </span>
  );
}

/** Selo neutro para construtora, bairro, nº de vagas etc. */
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-sand-100 inline-flex items-center rounded-[length:var(--radius-pill)] px-2.5 py-1",
        "text-sand-700 ring-sand-200 font-sans text-xs font-medium ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </span>
  );
}
