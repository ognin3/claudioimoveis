"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { cadastrarLead, type EstadoLead } from "@/app/(site)/actions/lead";
import { InputField } from "@/components/ui/Input";
import { buttonClasses } from "@/components/ui/Button";
import { dispararLeadMeta } from "@/lib/meta/pixel";
import { cn } from "@/lib/utils";

const estadoInicial: EstadoLead = {};

type LeadFormProps = {
  imovel?: { id: string; nome: string; bairro: string };
  compacto?: boolean;
  className?: string;
};

export function LeadForm({ imovel, compacto = false, className }: LeadFormProps) {
  const [estado, action, pending] = useActionState(cadastrarLead, estadoInicial);
  const [telefone, setTelefone] = useState("");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const iniciadoEmRef = useRef<HTMLInputElement>(null);
  const redirecionou = useRef(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    if (iniciadoEmRef.current) iniciadoEmRef.current.value = String(Date.now());
    const params = new URLSearchParams(window.location.search);
    const campos = {
      utm_source: "utmSource",
      utm_medium: "utmMedium",
      utm_campaign: "utmCampaign",
      utm_content: "utmContent",
      utm_term: "utmTerm",
      fbclid: "fbclid",
    } as const;

    Object.entries(campos).forEach(([chave, nomeCampo]) => {
      const atual = params.get(chave);
      if (atual) sessionStorage.setItem(chave, atual);
      const valor = atual ?? sessionStorage.getItem(chave) ?? "";
      const input = form.elements.namedItem(nomeCampo) as HTMLInputElement | null;
      if (input) input.value = valor;
    });
    const pagina = form.elements.namedItem("pagina") as HTMLInputElement | null;
    if (pagina) pagina.value = window.location.href;
  }, []);

  useEffect(() => {
    if (!estado.sucesso || !estado.eventId || !estado.whatsappUrl || redirecionou.current)
      return;
    redirecionou.current = true;
    dispararLeadMeta(estado.eventId, imovel?.nome);
    const params = new URLSearchParams({ whatsapp: estado.whatsappUrl });
    if (imovel?.nome) params.set("imovel", imovel.nome);
    router.push(`/obrigado?${params.toString()}` as Route);
  }, [estado, imovel?.nome, router]);

  return (
    <form
      ref={formRef}
      action={action}
      className={cn(
        "border-noite-800 bg-noite-900 rounded-[length:var(--radius-card)] border",
        compacto ? "p-5" : "p-6 sm:p-8",
        className,
      )}
      noValidate
    >
      <div className={compacto ? "" : "max-w-xl"}>
        <p className="font-display text-noite-50 text-xl font-semibold">
          {imovel
            ? "Receba as condições deste imóvel"
            : "Descubra quanto cabe no seu bolso"}
        </p>
        <p className="text-noite-400 mt-2 text-sm leading-relaxed">
          O Cláudio verifica disponibilidade, entrada e possibilidade de subsídio. Sem
          compromisso.
        </p>
      </div>

      <div className={cn("mt-5 grid gap-4", !compacto && "sm:grid-cols-2")}>
        <InputField
          label="Seu nome"
          name="nome"
          autoComplete="name"
          required
          erro={estado.erros?.nome}
        />
        <InputField
          label="WhatsApp com DDD"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(21) 99999-9999"
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          required
          erro={estado.erros?.whatsapp}
        />
        <InputField
          label="E-mail (opcional)"
          name="email"
          type="email"
          autoComplete="email"
          containerClassName={!compacto ? "sm:col-span-2" : undefined}
          erro={estado.erros?.email}
        />
      </div>

      {/* Honeypot: fora da tela, mas nao type=hidden para bots preencherem. */}
      <div className="absolute -left-[10000px]" aria-hidden>
        <label htmlFor="empresa">Empresa</label>
        <input id="empresa" name="empresa" tabIndex={-1} autoComplete="off" />
      </div>

      <input ref={iniciadoEmRef} type="hidden" name="iniciadoEm" />
      <input type="hidden" name="pagina" />
      <input type="hidden" name="utmSource" />
      <input type="hidden" name="utmMedium" />
      <input type="hidden" name="utmCampaign" />
      <input type="hidden" name="utmContent" />
      <input type="hidden" name="utmTerm" />
      <input type="hidden" name="fbclid" />
      {imovel && (
        <>
          <input type="hidden" name="imovelId" value={imovel.id} />
          <input type="hidden" name="imovelNome" value={imovel.nome} />
          <input type="hidden" name="imovelBairro" value={imovel.bairro} />
        </>
      )}

      <label className="text-noite-400 mt-5 flex cursor-pointer items-start gap-3 font-sans text-xs leading-relaxed">
        <input
          type="checkbox"
          name="consentimento"
          required
          className="accent-ouro-400 mt-0.5 size-4 shrink-0"
        />
        <span>
          Autorizo o contato do corretor sobre imóveis e financiamento. Consulte a{" "}
          <Link
            href="/privacidade"
            className="text-ouro-400 underline underline-offset-2"
          >
            política de privacidade
          </Link>
          .
        </span>
      </label>
      {estado.erros?.consentimento && (
        <p className="text-ouro-300 mt-1 font-sans text-sm" aria-live="polite">
          {estado.erros.consentimento}
        </p>
      )}

      {estado.mensagem && (
        <p className="text-ouro-300 mt-4 font-sans text-sm" role="alert">
          {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", "lg", "mt-5 w-full")}
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Enviando…
          </>
        ) : (
          <>
            Quero receber as condições
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </button>

      <p className="text-noite-500 mt-3 flex items-center justify-center gap-1.5 text-center font-sans text-xs">
        <CheckCircle2 className="text-ouro-400 size-3.5" aria-hidden />
        Seus dados não serão compartilhados com terceiros.
      </p>
    </form>
  );
}

function formatarTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}
