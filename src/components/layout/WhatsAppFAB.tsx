import { linkWhatsApp } from "@/lib/whatsapp";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";

/**
 * Botao flutuante de WhatsApp. Fica fora do funil de captura de proposito:
 * o caminho principal de conversao e o formulario (que grava o lead antes de
 * mandar para o zap). Este e o atalho para quem ja decidiu falar agora.
 *
 * Server Component: e so uma ancora, nao precisa de JS.
 */
export function WhatsAppFAB() {
  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Cláudio no WhatsApp"
      className="whatsapp-fab bg-whatsapp hover:bg-whatsapp-dark focus-visible:outline-whatsapp-dark fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full text-white shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-6 sm:bottom-6"
    >
      <IconeWhatsApp className="size-7" />
    </a>
  );
}
