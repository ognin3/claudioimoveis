"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { ImagemSanity } from "@/types/imovel";

export function PlantaAmpliavel({
  imagem,
  alt,
  rotulo,
  className,
}: {
  imagem: ImagemSanity;
  alt: string;
  rotulo?: string | null;
  className?: string;
}) {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        aria-label={`Ampliar ${alt}`}
        className={cn(
          "border-noite-800 bg-noite-950 group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg border",
          className,
        )}
      >
        <Image
          src={imagem.url}
          alt={alt}
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          placeholder={imagem.lqip ? "blur" : "empty"}
          blurDataURL={imagem.lqip ?? undefined}
          className="object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
        />
        <span className="bg-noite-950/80 text-noite-100 absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-full backdrop-blur">
          <ZoomIn className="size-4" aria-hidden />
        </span>
        {rotulo && (
          <span className="absolute inset-x-0 bottom-0 bg-black/75 px-2 py-1.5 text-center font-sans text-xs text-white">
            {rotulo}
          </span>
        )}
      </button>

      <Modal
        open={aberta}
        onOpenChange={setAberta}
        titulo={rotulo ? `${rotulo} — planta ampliada` : "Planta ampliada"}
        tituloOculto
        className="bg-noite-950 max-w-6xl p-2 shadow-[var(--shadow-lift)] sm:p-4"
      >
        <div className="relative h-[min(82dvh,52rem)] min-h-80 w-full">
          <Image
            src={imagem.url}
            alt={alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </Modal>
    </>
  );
}
