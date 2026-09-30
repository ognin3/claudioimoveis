import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { linkWhatsApp } from "@/lib/whatsapp";
import { LEAD_RECEIPT_COOKIE, verifyLeadReceipt } from "@/lib/lead-receipt";

export const metadata: Metadata = {
  title: "Contato | Cláudio Imóveis",
  alternates: { canonical: "/obrigado" },
  robots: { index: false, follow: false },
};

export default function Obrigado() {
  return (
    <Suspense fallback={<section className="mx-auto min-h-[65dvh] max-w-2xl px-4 py-16" />}>
      <ConteudoObrigado />
    </Suspense>
  );
}

async function ConteudoObrigado() {
  const receipt = verifyLeadReceipt((await cookies()).get(LEAD_RECEIPT_COOKIE)?.value);
  const whatsapp = receipt?.imovel
    ? linkWhatsApp({ tipo: "imovel", nome: receipt.imovel.nome, bairro: receipt.imovel.bairro })
    : linkWhatsApp();

  if (!receipt) {
    return (
      <section className="mx-auto flex min-h-[65dvh] max-w-2xl items-center px-4 py-16 text-center sm:px-6">
        <div className="border-noite-800 bg-noite-900 w-full rounded-[length:var(--radius-card)] border p-8 sm:p-12">
          <h1 className="text-noite-50 text-[length:var(--text-h1)] font-semibold">Fale com o Cláudio</h1>
          <p className="text-noite-300 mx-auto mt-4 max-w-lg leading-relaxed">
            Encontre seu imóvel ou entre em contato para receber mais informações.
          </p>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClasses("whatsapp", "lg", "mt-8 w-full sm:w-auto")}>
            <MessageCircle className="size-5" aria-hidden /> Conversar no WhatsApp
          </a>
          <div className="mt-6"><Link href="/imoveis" className="text-ouro-400 font-sans text-sm underline">Ver imóveis</Link></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[65dvh] max-w-2xl items-center px-4 py-16 text-center sm:px-6">
      <div className="border-noite-800 bg-noite-900 w-full rounded-[length:var(--radius-card)] border p-8 sm:p-12">
        <CheckCircle2 className="text-ouro-400 mx-auto size-12" aria-hidden />
        <h1 className="text-noite-50 mt-5 text-[length:var(--text-h1)] font-semibold">
          Recebemos seu contato
        </h1>
        <p className="text-noite-300 mx-auto mt-4 max-w-lg leading-relaxed">
          {receipt.imovel
            ? `O Cláudio recebeu seu interesse no ${receipt.imovel.nome}.`
            : "O Cláudio recebeu seus dados."}{" "}
          Agora continue no WhatsApp para receber as condições e verificar a
          disponibilidade.
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "lg", "mt-8 w-full sm:w-auto")}
        >
          <MessageCircle className="size-5" aria-hidden />
          Continuar no WhatsApp
        </a>
        <div className="mt-6">
          <Link href="/imoveis" className="text-ouro-400 font-sans text-sm underline">
            Voltar aos imóveis
          </Link>
        </div>
      </div>
    </section>
  );
}
