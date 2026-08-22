import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Duas familias variaveis, subset latin, auto-hospedadas pelo next/font.
 * Serifa no display + grotesca no corpo dao ar editorial e afastam o site do
 * padrao "Poppins roxo" da concorrencia de corretor. Trocar aqui muda o site todo.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} — Apartamentos Minha Casa Minha Vida no Rio de Janeiro`,
    template: `%s | ${site.nome}`,
  },
  description: site.descricaoCurta,
  keywords: [
    "apartamentos Minha Casa Minha Vida RJ",
    "apartamentos à venda no Rio de Janeiro",
    "lançamentos Cury RJ",
    "imóveis Porto Maravilha",
    "apartamentos São Cristóvão",
    "imóveis Niterói",
    "corretor de imóveis Rio de Janeiro",
  ],
  alternates: { canonical: "/" },
  applicationName: site.nome,
  authors: [{ name: site.nome }],
  creator: site.nome,
  publisher: site.nome,
  category: "imóveis",
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.nome,
    title: `${site.nome} — Apartamentos Minha Casa Minha Vida no Rio de Janeiro`,
    description: site.descricaoCurta,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
