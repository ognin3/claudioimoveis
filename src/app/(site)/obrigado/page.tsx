import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato recebido",
  robots: { index: false, follow: false },
};

export default function Obrigado({
  searchParams,
}: {
  searchParams: Promise<{ whatsapp?: string; imovel?: string }>;
}) {
  return (
    <Suspense fallback={<CarregandoObrigado />}>
      <ConteudoObrigado searchParams={searchParams} />
    </Suspense>
  );
}

async function ConteudoObrigado({
  searchParams,
}: {
  searchParams: Promise<{ whatsapp?: string; imovel?: string }>;
}) {
  const params = await searchParams;
  const whatsapp = validarWhatsApp(params.whatsapp) ?? linkWhatsApp();

  return (
    <section className="mx-auto flex min-h-[65dvh] max-w-2xl items-center px-4 py-16 text-center sm:px-6">
      <div className="border-noite-800 bg-noite-900 w-full rounded-[length:var(--radius-card)] border p-8 sm:p-12">
        <CheckCircle2 className="text-ouro-400 mx-auto size-12" aria-hidden />
        <h1 className="text-noite-50 mt-5 text-[length:var(--text-h1)] font-semibold">
          Recebemos seu contato
        </h1>
        <p className="text-noite-300 mx-auto mt-4 max-w-lg leading-relaxed">
          {params.imovel
            ? `O Cláudio recebeu seu interesse no ${params.imovel}.`
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

function CarregandoObrigado() {
  return (
    <section className="mx-auto flex min-h-[65dvh] max-w-2xl items-center px-4 py-16 sm:px-6">
      <div className="border-noite-800 bg-noite-900 h-80 w-full animate-pulse rounded-[length:var(--radius-card)] border" />
    </section>
  );
}

function validarWhatsApp(valor?: string) {
  if (!valor) return null;
  try {
    const url = new URL(valor);
    return url.protocol === "https:" && url.hostname === "api.whatsapp.com"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
