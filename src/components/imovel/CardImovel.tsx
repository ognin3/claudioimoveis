import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { BadgeStatus } from "@/components/ui/Badge";
import { descreverQuartos } from "@/lib/utils";
import type { CardImovel as TipoCard } from "@/types/imovel";

/**
 * Card do catalogo e da home. Server Component — nao precisa de JS no cliente.
 *
 * `aspect-[4/3]` fixo + `blurDataURL` do LQIP: a altura do card e conhecida antes
 * da imagem chegar, entao a grade nao pula quando as fotos carregam (meta de CLS).
 */
export function CardImovel({
  imovel,
  prioridade = false,
}: {
  imovel: TipoCard;
  /** Ligar apenas nos 1-2 primeiros cards visiveis: eles costumam ser o LCP. */
  prioridade?: boolean;
}) {
  const area =
    imovel.areaMin && imovel.areaMax && imovel.areaMin !== imovel.areaMax
      ? `${imovel.areaMin} a ${imovel.areaMax} m²`
      : imovel.areaMin
        ? `${imovel.areaMin} m²`
        : null;

  return (
    <Link
      href={`/imovel/${imovel.slug}`}
      className="group focus-visible:outline-ouro-400 bg-noite-900 block overflow-hidden rounded-[length:var(--radius-card)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imovel.capa.url}
          alt={imovel.capa.alt ?? imovel.nome}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholder={imovel.capa.lqip ? "blur" : "empty"}
          blurDataURL={imovel.capa.lqip ?? undefined}
          priority={prioridade}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <BadgeStatus status={imovel.status} />
        </div>
      </div>

      <div className="p-4">
        <p className="text-noite-500 flex items-center gap-1 font-sans text-xs">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {imovel.regiao.nome}
          <span aria-hidden>·</span>
          <span>{imovel.construtora.nome}</span>
        </p>

        <h3 className="text-noite-50 mt-1.5 text-lg leading-snug font-semibold">
          {imovel.nome}
        </h3>

        {imovel.chamada && (
          <p className="text-noite-400 mt-1 line-clamp-2 text-sm">{imovel.chamada}</p>
        )}

        <p className="text-noite-300 mt-3 font-sans text-sm font-medium">
          {descreverQuartos(imovel.quartos)}
          {area && <span className="text-noite-400"> · {area}</span>}
        </p>
      </div>
    </Link>
  );
}
