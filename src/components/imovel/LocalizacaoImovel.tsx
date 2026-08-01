import { MapPin, Navigation } from "lucide-react";
import type { Local, TipoLocal } from "@/types/imovel";

/**
 * Bloco de localizacao: enderecos com atalho para Waze e Google Maps, texto da
 * regiao e o mapa.
 *
 * O mapa e um iframe do Google com `loading="lazy"`. Sem chave de API — a URL
 * `?output=embed` e publica. E lazy porque o embed do Google puxa mais de 1 MB
 * de script; carregar isso no topo derrubaria o LCP, e este bloco fica bem
 * abaixo da dobra. Server Component: nao custa 1 byte de JS.
 */

const ROTULO_TIPO: Record<TipoLocal, string> = {
  empreendimento: "Empreendimento",
  stand: "Stand de vendas",
  decorado: "Apartamento decorado",
};

export function LocalizacaoImovel({
  locais,
  coordenadas,
  textoRegiao,
  nome,
  regiao,
}: {
  locais: Local[] | null;
  coordenadas: { lat: number; lng: number } | null;
  textoRegiao: string | null;
  nome: string;
  regiao: string;
}) {
  const temAlgo = (locais && locais.length > 0) || coordenadas || textoRegiao;
  if (!temAlgo) return null;

  // Sem coordenada, cai no endereco em texto — o Google resolve bem.
  const consulta = coordenadas
    ? `${coordenadas.lat},${coordenadas.lng}`
    : `${locais?.[0]?.endereco ?? nome}, ${regiao}, RJ`;
  const urlMapa = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&z=15&output=embed`;

  return (
    <section className="mt-16">
      <h2 className="flex items-center gap-2.5 text-[length:var(--text-h3)] font-semibold">
        <MapPin className="text-ouro-400 size-6 shrink-0" aria-hidden />
        Localização
      </h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="flex flex-col gap-4">
          {locais?.map((local) => (
            <div
              key={`${local.tipo}-${local.endereco}`}
              className="border-noite-800 bg-noite-900 rounded-[length:var(--radius-card)] border p-5"
            >
              <div className="flex items-start gap-3">
                <span className="bg-noite-800 text-ouro-400 mt-0.5 grid size-9 shrink-0 place-items-center rounded-full">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-noite-500 font-sans text-xs font-semibold tracking-[0.14em] uppercase">
                    {ROTULO_TIPO[local.tipo]}
                  </p>
                  <p className="text-noite-100 mt-1 font-sans text-sm leading-snug font-medium">
                    {local.endereco}
                  </p>
                </div>
              </div>

              {(local.waze || local.googleMaps) && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 pl-12">
                  {local.waze && <AtalhoMapa href={local.waze} rotulo="Waze" />}
                  {local.googleMaps && (
                    <AtalhoMapa href={local.googleMaps} rotulo="Google Maps" />
                  )}
                </div>
              )}
            </div>
          ))}

          {textoRegiao && (
            <div className="border-noite-800 bg-noite-900 rounded-[length:var(--radius-card)] border p-5">
              <h3 className="font-display text-noite-50 text-lg font-semibold">
                Sobre a região
              </h3>
              <p className="text-noite-400 mt-2 text-sm leading-relaxed">{textoRegiao}</p>
            </div>
          )}
        </div>

        <div className="border-noite-800 h-80 overflow-hidden rounded-[length:var(--radius-card)] border lg:h-auto lg:min-h-[24rem]">
          <iframe
            src={urlMapa}
            title={`Mapa da localização do ${nome}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}

function AtalhoMapa({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ouro-400 hover:text-ouro-300 inline-flex items-center gap-1.5 font-sans text-sm font-medium transition-colors"
    >
      <Navigation className="size-3.5 shrink-0" aria-hidden />
      {rotulo}
    </a>
  );
}
