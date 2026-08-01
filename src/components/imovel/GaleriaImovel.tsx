"use client";

import { useState } from "react";
import Image from "next/image";
import { Carousel } from "@/components/ui/Carousel";
import { Modal } from "@/components/ui/Modal";
import type { ImagemSanity } from "@/types/imovel";

/**
 * Galeria do imovel: carrossel no topo, com lightbox ao clicar.
 * A primeira imagem e o LCP da pagina — por isso `priority` nela e so nela.
 */
export function GaleriaImovel({
  capa,
  galeria,
  nome,
}: {
  capa: ImagemSanity;
  galeria: ImagemSanity[];
  nome: string;
}) {
  const imagens = [capa, ...galeria];
  const [ampliada, setAmpliada] = useState<number | null>(null);

  return (
    <>
      <Carousel
        rotuloAcessivel={`Fotos do ${nome}`}
        className="overflow-hidden rounded-[length:var(--radius-card)]"
      >
        {imagens.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setAmpliada(i)}
            aria-label={`Ampliar imagem ${i + 1} de ${imagens.length}`}
            className="relative block aspect-[16/10] w-full cursor-zoom-in"
          >
            <Image
              src={img.url}
              alt={img.alt ?? `${nome} — imagem ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : undefined}
              placeholder={img.lqip ? "blur" : "empty"}
              blurDataURL={img.lqip ?? undefined}
              className="object-cover"
            />
          </button>
        ))}
      </Carousel>

      <Modal
        open={ampliada !== null}
        onOpenChange={(aberto) => !aberto && setAmpliada(null)}
        titulo={`${nome} — imagem ampliada`}
        tituloOculto
        className="max-w-5xl bg-transparent shadow-none"
      >
        {ampliada !== null && (
          <div className="bg-noite-950 relative aspect-[16/10] w-full overflow-hidden rounded-[length:var(--radius-card)]">
            <Image
              src={imagens[ampliada].url}
              alt={imagens[ampliada].alt ?? nome}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
