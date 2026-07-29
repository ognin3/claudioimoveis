import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
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
  applicationName: site.nome,
  authors: [{ name: site.nome }],
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
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#142b36",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
