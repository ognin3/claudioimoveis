"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Deixa o proprio CDN do Sanity redimensionar e converter a imagem. Assim o
 * primeiro visitante nao espera a Vercel buscar e reprocessar o mesmo arquivo.
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
