import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modelo de cache do Next 16: PPR por padrao, "use cache" + cacheTag/updateTag.
  // O conteudo vem do Sanity e muda pouco, entao quase tudo entra no shell estatico
  // e o webhook do Studio invalida por tag. Ver docs/PLANO-DE-ACAO.md Fase 3.
  cacheComponents: true,

  images: {
    // AVIF primeiro: os renders dos books e as fotos da Cury sao pesados.
    formats: ["image/avif", "image/webp"],
    qualities: [45, 55, 75],
    loader: "custom",
    loaderFile: "./src/lib/sanity/image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Larguras alinhadas aos breakpoints do catalogo, evita gerar variantes inuteis.
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },

  // O site expoe telefone e e-mail do corretor; nao vale entregar a versao do Next junto.
  poweredByHeader: false,

  typedRoutes: true,
};

export default nextConfig;
