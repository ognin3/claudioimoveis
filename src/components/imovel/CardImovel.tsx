import Image from "next/image";
import Link from "next/link";
import { BedDouble, Camera, Car, MapPin, Ruler } from "lucide-react";
import { BadgeStatus } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { linkWhatsApp } from "@/lib/whatsapp";
import { descreverQuartos } from "@/lib/utils";
import type { CardImovel as TipoCard } from "@/types/imovel";

/**
 * Card do catalogo e da home. Server Component — nao custa JS.
 *
 * Formato inspirado nos portais (ZAP, VivaReal), com uma diferenca deliberada:
 * onde eles poem o preco, aqui vai "Consulte condicoes". O site nao exibe valor
 * (decisao 3 do CLAUDE.md), entao aquele espaco vira gancho de conversa em vez
 * de ficar vazio.
 *
 * O CTA de WhatsApp fica DENTRO do card: no portal e o que mais converte, porque
 * quem ja se decidiu pela foto nao precisa abrir a pagina inteira para falar.
 *
 * `aspect-video` fixo + `blurDataURL` do LQIP: a altura e conhecida antes da
 * imagem chegar, entao a grade nao pula quando as fotos carregam (meta de CLS).
 */
export function CardImovel({
  imovel,
  prioridade = false,
  nivelTitulo = "h3",
}: {
  imovel: TipoCard;
  /** Ligar apenas nos primeiros cards visiveis: eles costumam ser o LCP. */
  prioridade?: boolean;
  /** No catalogo o card vem logo depois do h1; em secoes, depois de um h2. */
  nivelTitulo?: "h2" | "h3";
}) {
  const Titulo = nivelTitulo;
  const area =
    imovel.areaMin && imovel.areaMax && imovel.areaMin !== imovel.areaMax
      ? `${imovel.areaMin} a ${imovel.areaMax} m²`
      : imovel.areaMin
        ? `${imovel.areaMin} m²`
        : null;

  const vagas = imovel.vagasMax ?? null;

  return (
    <article className="motion-card group border-noite-800 bg-noite-900 hover:border-ouro-800/70 relative flex flex-col overflow-hidden rounded-[length:var(--radius-card)] border">
      {/* A foto inteira e link: e o alvo natural de clique num catalogo. */}
      <Link
        href={`/imovel/${imovel.slug}`}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-video overflow-hidden"
      >
        <Image
          src={imovel.capa.url}
          alt=""
          fill
          sizes="(min-width: 1024px) 640px, (min-width: 640px) 80vw, 140vw"
          placeholder={imovel.capa.lqip ? "blur" : "empty"}
          blurDataURL={imovel.capa.lqip ?? undefined}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : undefined}
          quality={80}
          className="motion-card-image object-cover"
        />

        {/* "Lancamento" e o estado dominante do catalogo e virava ruido verde
            em quase todos os cards. Os estados que informam prazo continuam. */}
        {imovel.status !== "lancamento" && (
          <div className="absolute top-3 left-3">
            <BadgeStatus status={imovel.status} />
          </div>
        )}

        {imovel.totalFotos ? (
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-[length:var(--radius-pill)] bg-black/65 px-2.5 py-1 font-sans text-xs font-medium text-white backdrop-blur">
            <Camera className="size-3.5" aria-hidden />
            {imovel.totalFotos}
          </span>
        ) : null}

        {/* Nome da construtora sobre a foto, como os portais fazem com a imobiliaria. */}
        <span className="absolute bottom-3 left-3 max-w-[65%] truncate rounded-[length:var(--radius-pill)] bg-black/65 px-3 py-1 font-sans text-xs font-medium text-white backdrop-blur">
          {imovel.construtora.nome}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-noite-500 flex items-center gap-1.5 font-sans text-xs">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{imovel.regiao.nome}</span>
        </p>

        <Titulo className="mt-1.5 text-lg leading-snug font-semibold">
          {/* Link "esticado": o card inteiro fica clicavel sem aninhar <a> dentro de <a>. */}
          <Link
            href={`/imovel/${imovel.slug}`}
            className="focus-visible:outline-ouro-400 after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {imovel.nome}
          </Link>
        </Titulo>

        {imovel.chamada && (
          <p className="text-noite-400 mt-1 line-clamp-2 text-sm">{imovel.chamada}</p>
        )}

        <dl className="text-noite-300 border-noite-800 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3 font-sans text-sm">
          {area && <Spec Icone={Ruler} rotulo="Área" valor={area} />}
          <Spec
            Icone={BedDouble}
            rotulo="Quartos"
            valor={descreverQuartos(imovel.quartos)}
          />
          {vagas ? (
            <Spec
              Icone={Car}
              rotulo="Vagas"
              valor={`${vagas} vaga${vagas > 1 ? "s" : ""}`}
            />
          ) : null}
        </dl>

        <div className="mt-auto pt-4">
          <p className="font-display text-noite-50 text-lg font-semibold">
            Consulte condições
          </p>
          <p className="text-noite-500 mt-0.5 font-sans text-xs">
            Entrada facilitada · Minha Casa Minha Vida
          </p>

          {/* `relative z-10`: fica acima do link esticado, senao o clique cairia no card. */}
          <a
            href={linkWhatsApp({
              tipo: "imovel",
              nome: imovel.nome,
              bairro: imovel.regiao.nome,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "md", "relative z-10 mt-3 w-full")}
          >
            Falar sobre este imóvel
          </a>
        </div>
      </div>
    </article>
  );
}

function Spec({
  Icone,
  rotulo,
  valor,
}: {
  Icone: React.ComponentType<{ className?: string }>;
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icone className="text-noite-500 size-4 shrink-0" />
      <dt className="sr-only">{rotulo}</dt>
      <dd className="whitespace-nowrap">{valor}</dd>
    </div>
  );
}
