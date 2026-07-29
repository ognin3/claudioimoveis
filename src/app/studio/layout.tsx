import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata, Viewport } from "next";

/**
 * Layout do Studio. Existe separado da pagina por dois motivos tecnicos:
 *
 * 1. A pagina precisa ser client component (ver o comentario em page.tsx), e
 *    client component nao pode exportar `metadata`/`viewport`.
 * 2. Com Cache Components, o `params` de uma rota catch-all conta como dado de
 *    request. A metadata passa a diferir para request time enquanto o resto da
 *    rota e prerenderizavel, e o Next exige que essa escolha seja explicita.
 *    O `<Conexao />` abaixo e o "marcador dinamico" que a doc pede.
 *
 * Renderizar por request e o certo aqui: o Studio e um painel administrativo,
 * SPA no cliente, sem SEO e com trafego de uma pessoa so. Nao ha o que ganhar
 * prerenderizando.
 *
 * Os valores de metadata sao os mesmos de `next-sanity/studio`, reescritos a mao
 * de proposito — importar daquele modulo traria o bundle do Studio de volta para
 * o grafo do servidor, que e o que quebrava o build. Ver CLAUDE.md secao 5.10.
 */
export const metadata: Metadata = {
  referrer: "same-origin",
  robots: "noindex",
  title: "Painel — Cláudio Corretor",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

async function Conexao() {
  await connection();
  return null;
}

export default function LayoutStudio({ children }: { children: React.ReactNode }) {
  return (
    // O Studio se vira melhor ocupando a altura toda da janela.
    <div className="h-dvh">
      <Suspense>
        <Conexao />
      </Suspense>
      {children}
    </div>
  );
}
