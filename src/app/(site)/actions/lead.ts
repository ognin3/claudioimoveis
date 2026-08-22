"use server";

import { headers, cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { clienteEscrita } from "@/lib/sanity/client";
import { enviarLeadMeta } from "@/lib/meta/capi";
import { linkWhatsApp } from "@/lib/whatsapp";

export type EstadoLead = {
  sucesso?: boolean;
  mensagem?: string;
  erros?: Partial<Record<"nome" | "whatsapp" | "email" | "consentimento", string>>;
  eventId?: string;
  whatsappUrl?: string;
};

const esquema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome.").max(80),
  whatsapp: z
    .string()
    .transform((valor) => valor.replace(/\D/g, ""))
    .transform((valor) =>
      valor.length === 10 || valor.length === 11 ? `55${valor}` : valor,
    )
    .refine((valor) => /^55\d{10,11}$/.test(valor), "Digite um WhatsApp válido com DDD."),
  email: z
    .string()
    .trim()
    .transform((valor) => valor.toLowerCase())
    .refine(
      (valor) => !valor || z.email().safeParse(valor).success,
      "Digite um e-mail válido.",
    ),
  consentimento: z.literal("on", { error: "Autorize o contato para continuar." }),
  imovelId: z.string().trim().optional(),
  imovelNome: z.string().trim().max(120).optional(),
  imovelBairro: z.string().trim().max(100).optional(),
  pagina: z.string().trim().max(500),
  utmSource: z.string().trim().max(200).optional(),
  utmMedium: z.string().trim().max(200).optional(),
  utmCampaign: z.string().trim().max(200).optional(),
  utmContent: z.string().trim().max(200).optional(),
  utmTerm: z.string().trim().max(200).optional(),
  fbclid: z.string().trim().max(500).optional(),
  empresa: z.string().max(0),
  iniciadoEm: z.coerce.number().int().positive(),
});

const tentativas = new Map<string, number[]>();
function excedeuLimite(chave: string) {
  const agora = Date.now();
  const janela = 10 * 60 * 1000;
  const recentes = (tentativas.get(chave) ?? []).filter((t) => agora - t < janela);
  recentes.push(agora);
  tentativas.set(chave, recentes);
  return recentes.length > 5;
}

function campos(formData: FormData) {
  const texto = (nome: string) => String(formData.get(nome) ?? "");
  return {
    nome: texto("nome"),
    whatsapp: texto("whatsapp"),
    email: texto("email"),
    consentimento: texto("consentimento"),
    imovelId: texto("imovelId") || undefined,
    imovelNome: texto("imovelNome") || undefined,
    imovelBairro: texto("imovelBairro") || undefined,
    pagina: texto("pagina"),
    utmSource: texto("utmSource") || undefined,
    utmMedium: texto("utmMedium") || undefined,
    utmCampaign: texto("utmCampaign") || undefined,
    utmContent: texto("utmContent") || undefined,
    utmTerm: texto("utmTerm") || undefined,
    fbclid: texto("fbclid") || undefined,
    empresa: texto("empresa"),
    iniciadoEm: texto("iniciadoEm"),
  };
}

export async function cadastrarLead(
  _estado: EstadoLead,
  formData: FormData,
): Promise<EstadoLead> {
  const cabecalhos = await headers();
  const ip =
    (cabecalhos.get("x-forwarded-for") ?? "local").split(",")[0]?.trim() ?? "local";

  if (excedeuLimite(ip)) {
    return { mensagem: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  }

  const validado = esquema.safeParse(campos(formData));
  if (!validado.success) {
    const erros = validado.error.flatten().fieldErrors;
    return {
      mensagem: "Revise os campos destacados.",
      erros: {
        nome: erros.nome?.[0],
        whatsapp: erros.whatsapp?.[0],
        email: erros.email?.[0],
        consentimento: erros.consentimento?.[0],
      },
    };
  }

  const dados = validado.data;
  const agora = new Date().toISOString();
  const eventId = randomUUID();
  const origem = {
    pagina: dados.pagina,
    utmSource: dados.utmSource,
    utmMedium: dados.utmMedium,
    utmCampaign: dados.utmCampaign,
    utmContent: dados.utmContent,
    utmTerm: dados.utmTerm,
    fbclid: dados.fbclid,
  };

  try {
    await clienteEscrita().create({
      _type: "lead",
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      ...(dados.email ? { email: dados.email } : {}),
      ...(dados.imovelId ? { imovel: { _type: "reference", _ref: dados.imovelId } } : {}),
      status: "novo",
      criadoEm: agora,
      consentidoEm: agora,
      eventId,
      origem,
    });
  } catch (erro) {
    console.error("Falha ao gravar lead no Sanity", erro);
    return { mensagem: "Não foi possível enviar agora. Tente novamente pelo WhatsApp." };
  }

  const cookieStore = await cookies();
  const url = dados.pagina.startsWith("http") ? dados.pagina : "";
  const tarefas: Promise<unknown>[] = [
    enviarLeadMeta({
      eventId,
      url,
      telefone: dados.whatsapp,
      email: dados.email || undefined,
      ip: ip === "local" ? undefined : ip,
      userAgent: cabecalhos.get("user-agent") ?? undefined,
      fbp: cookieStore.get("_fbp")?.value,
      fbc: cookieStore.get("_fbc")?.value,
      imovel: dados.imovelNome,
    }),
    notificarLead({
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      email: dados.email || undefined,
      imovel: dados.imovelNome,
      pagina: dados.pagina,
    }),
  ];
  const resultados = await Promise.allSettled(tarefas);
  resultados.forEach((resultado) => {
    if (resultado.status === "rejected")
      console.error("Integração de lead falhou", resultado.reason);
  });

  return {
    sucesso: true,
    eventId,
    whatsappUrl: linkWhatsApp(
      dados.imovelNome
        ? { tipo: "imovel", nome: dados.imovelNome, bairro: dados.imovelBairro }
        : { tipo: "geral" },
    ),
  };
}

async function notificarLead(lead: {
  nome: string;
  whatsapp: string;
  email?: string;
  imovel?: string;
  pagina: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const para = process.env.LEAD_NOTIFICACAO_EMAIL;
  const de = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !para || !de) return;

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: de,
      to: [para],
      subject: `Novo lead: ${lead.nome}${lead.imovel ? ` — ${lead.imovel}` : ""}`,
      text: [
        `Nome: ${lead.nome}`,
        `WhatsApp: ${lead.whatsapp}`,
        lead.email ? `E-mail: ${lead.email}` : "",
        lead.imovel ? `Imóvel: ${lead.imovel}` : "",
        `Origem: ${lead.pagina}`,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
    cache: "no-store",
  });
  if (!resposta.ok)
    throw new Error(
      `Resend ${resposta.status}: ${(await resposta.text()).slice(0, 300)}`,
    );
}
