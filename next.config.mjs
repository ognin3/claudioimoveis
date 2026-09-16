// @ts-check

const emDesenvolvimento = process.env.NODE_ENV === "development";

const politicaDeConteudo = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${emDesenvolvimento ? " 'unsafe-eval'" : ""} https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://www.facebook.com https://*.facebook.com",
  "font-src 'self' data:",
  `connect-src 'self'${emDesenvolvimento ? " ws:" : ""} https://*.sanity.io https://*.apicdn.sanity.io https://www.facebook.com https://connect.facebook.net`,
  "frame-src https://www.google.com https://maps.google.com",
  "media-src 'self' https://cdn.sanity.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(emDesenvolvimento ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const cabecalhosSeguranca = [
  { key: "Content-Security-Policy", value: politicaDeConteudo },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const cabecalhosStudio = [
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Modelo de cache do Next 16: PPR por padrao, "use cache" + cacheTag/updateTag.
  // O conteudo vem do Sanity e muda pouco, entao quase tudo entra no shell estatico
  // e o webhook do Studio invalida por tag. Ver docs/PLANO-DE-ACAO.md Fase 3.
  cacheComponents: true,

  images: {
    // AVIF primeiro: os renders dos books e as fotos da Cury sao pesados.
    formats: ["image/avif", "image/webp"],
    // Fotografia imobiliaria perde muito detalhe abaixo de 75. Os cards e o hero
    // usam 80; galerias e plantas ampliadas usam 90.
    qualities: [75, 80, 90],
    loader: "custom",
    loaderFile: "./src/lib/sanity/image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Larguras alinhadas aos breakpoints do catalogo, evita gerar variantes inuteis.
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1440, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },

  // O site expoe telefone e e-mail do corretor; nao vale entregar a versao do Next junto.
  poweredByHeader: false,

  // O botao preto com "N" e apenas a ferramenta visual do Next em `next dev`.
  // Erros continuam aparecendo normalmente no terminal e no overlay.
  devIndicators: false,

  typedRoutes: true,

  async headers() {
    return [
      {
        // O Studio precisa das próprias políticas para autenticação e previews.
        source: "/((?!studio|_next/static|_next/image|favicon.ico).*)",
        headers: cabecalhosSeguranca,
      },
      {
        source: "/studio/:path*",
        headers: cabecalhosStudio,
      },
    ];
  },
};

export default nextConfig;
