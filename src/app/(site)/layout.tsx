import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { MetaPixel } from "@/components/conversao/MetaPixel";

/**
 * Layout do site publico. Existe como route group `(site)` para que o Studio
 * (/studio) NAO herde cabecalho, rodape e botao flutuante — la e painel, nao site.
 */
export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="conteudo-principal" className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
      <MetaPixel />
    </>
  );
}
