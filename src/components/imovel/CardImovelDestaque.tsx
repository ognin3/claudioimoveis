import Image from "next/image";
import Link from "next/link";
import { BedDouble, Camera, Car, MapPin, Ruler } from "lucide-react";
import { LeadCaptureButton } from "@/components/conversao/LeadCaptureButton";
import { buttonClasses } from "@/components/ui/Button";
import { descreverQuartos } from "@/lib/utils";
import type { CardImovel as TipoCard } from "@/types/imovel";

export function CardImovelDestaque({ imovel }: { imovel: TipoCard }) {
  const area =
    imovel.areaMin && imovel.areaMax && imovel.areaMin !== imovel.areaMax
      ? `${imovel.areaMin} a ${imovel.areaMax} m²`
      : imovel.areaMin
        ? `${imovel.areaMin} m²`
        : null;

  return (
    <article className="border-noite-800 bg-noite-900 motion-card overflow-hidden rounded-[length:var(--radius-card)] border lg:grid lg:grid-cols-[1.35fr_0.9fr]">
      <Link
        href={`/imovel/${imovel.slug}`}
        className="group relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[25rem]"
      >
        <Image
          src={imovel.capa.url}
          alt={`Conheça o ${imovel.nome}`}
          fill
          sizes="(min-width: 1024px) 700px, 100vw"
          placeholder={imovel.capa.lqip ? "blur" : "empty"}
          blurDataURL={imovel.capa.lqip ?? undefined}
          loading="eager"
          fetchPriority="high"
          quality={90}
          className="motion-card-image object-cover"
        />
        <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 font-sans text-xs font-medium text-white backdrop-blur">
          <Camera className="size-3.5" aria-hidden />
          {imovel.totalFotos ?? "Ver fotos"}
        </span>
      </Link>

      <div className="flex flex-col p-6 sm:p-8">
        <p className="text-ouro-400 flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.12em] uppercase">
          <MapPin className="size-4" aria-hidden />
          {imovel.regiao.nome}
        </p>
        <h3 className="mt-3 text-2xl leading-tight font-semibold sm:text-3xl">
          <Link href={`/imovel/${imovel.slug}`}>{imovel.nome}</Link>
        </h3>
        {imovel.chamada ? (
          <p className="text-noite-400 mt-3 leading-relaxed">{imovel.chamada}</p>
        ) : null}

        <dl className="border-noite-800 text-noite-200 mt-6 grid gap-3 border-y py-5 font-sans text-sm">
          <Dado Icone={BedDouble} valor={descreverQuartos(imovel.quartos)} />
          {area ? <Dado Icone={Ruler} valor={area} /> : null}
          {imovel.vagasMax ? (
            <Dado
              Icone={Car}
              valor={`${imovel.vagasMax} vaga${imovel.vagasMax > 1 ? "s" : ""}`}
            />
          ) : null}
        </dl>

        <div className="mt-auto pt-7">
          <p className="font-display text-noite-50 text-xl font-semibold">
            Consulte entrada e financiamento
          </p>
          <p className="text-noite-500 mt-1 font-sans text-xs">
            Simulação gratuita com atendimento direto
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <LeadCaptureButton
              imovel={{
                id: imovel.id,
                nome: imovel.nome,
                bairro: imovel.regiao.nome,
              }}
              className="w-full"
            />
            <Link
              href={`/imovel/${imovel.slug}`}
              className={buttonClasses("outline", "md", "w-full")}
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Dado({
  Icone,
  valor,
}: {
  Icone: React.ComponentType<{ className?: string }>;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icone className="text-ouro-500 size-4" aria-hidden />
      <dt className="sr-only">Característica</dt>
      <dd>{valor}</dd>
    </div>
  );
}
