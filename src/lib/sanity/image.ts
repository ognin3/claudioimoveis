// Named export: o default de @sanity/image-url esta deprecado na v2.
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../../../sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Monta URL de imagem no CDN do Sanity, que redimensiona e converte sob demanda.
 * E o que permite servir os renders 1920x1080 dos books sem entregar 1 MB
 * para um card de 400px. Ver docs/MATERIAL-NOVO.md.
 */
export function urlImagem(fonte: SanityImageSource) {
  return builder.image(fonte).auto("format").fit("max");
}

/**
 * URL pronta para `next/image`, ja no tamanho pedido.
 * `auto("format")` deixa o Sanity escolher AVIF/WebP conforme o navegador.
 */
export function srcImagem(fonte: SanityImageSource, largura: number, altura?: number) {
  const base = urlImagem(fonte).width(largura);
  return (altura ? base.height(altura) : base).quality(78).url();
}
