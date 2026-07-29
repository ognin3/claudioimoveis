import type { Metadata } from "next";
import { VitrineUI } from "@/components/dev/VitrineUI";

/**
 * Vitrine interna do design system. Remover antes do lancamento
 * (item da Fase 7 em docs/PLANO-DE-ACAO.md).
 */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

export default function PaginaVitrineUI() {
  return <VitrineUI />;
}
