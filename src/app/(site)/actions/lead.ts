"use server";

import { headers, cookies } from "next/headers";
import { createHmac, randomUUID } from "node:crypto";
import { z } from "zod";
import { clienteEscrita } from "@/lib/sanity/client";
import { queryControlesTaxaExpirados, queryImovelParaLead } from "@/lib/sanity/queries";
import { enviarLeadMeta } from "@/lib/meta/capi";
import { linkWhatsApp } from "@/lib/whatsapp";
import { site } from "@/lib/site";

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
  imovelId: z
    .string()
    .trim()
    .max(128)
    .refine((valor) => !valor || /^[a-zA-Z0-9_.-]+$/.test(valor), "Imóvel inválido.")
    .optional(),
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

const tentativasLocais = new Map<string, number[]>();
function excedeuLimiteLocal(chave: string) {
  const agora = Date.now();
  const janela = 10 * 60 * 1000;
  const recentes = (tentativasLocais.get(chave) ?? []).filter((t) => agora - t < janela);
  recentes.push(agora);
  tentativasLocais.set(chave, recentes);
  return recentes.length > 5;
}

async function excedeuLimitePersistente(
  cliente: ReturnType<typeof clienteEscrita>,
  ip: string,
) {
  if (process.env.NODE_ENV !== "production") return excedeuLimiteLocal(ip);

  const segredo =
    process.env.LEAD_SECURITY_SECRET ?? process.env.SANITY_REVALIDATE_SECRET;
  if (!segredo) {
    throw new Error("LEAD_SECURITY_SECRET ausente no ambiente de produção.");
  }

  const duracaoJanela = 10 * 60 * 1000;
  const janela = Math.floor(Date.now() / duracaoJanela);
  const identificador = createHmac("sha256", segredo)
    .update(ip)
    .digest("hex")
    .slice(0, 32);
  const id = `drafts.controleTaxaLead.${janela}.${identificador}`;

  await cliente
    .transaction()
    .createIfNotExists({
      _id: id,
      _type: "controleTaxaLead",
      tentativas: 0,
      expiraEm: new Date((janela + 2) * duracaoJanela).toISOString(),
    })
    .patch(id, (patch) => patch.inc({ tentativas: 1 }))
    .commit({ visibility: "sync" });

  const controle = await cliente.getDocument<{ tentativas?: number }>(id);

  const expirados = await cliente.fetch<string[]>(queryControlesTaxaExpirados, {
    agora: new Date().toISOString(),
  });
  if (expirados.length > 0) {
    const limpeza = cliente.transaction();
    expirados.forEach((documentoId) => limpeza.delete(documentoId));
    await limpeza.commit({ visibility: "async" });
  }

  return (controle?.tentativas ?? 6) > 5;
}

function paginaConfiavel(valor: string) {
  const urlBase = new URL(site.url);
  try {
    const url = new URL(valor, urlBase);
    const localEmDesenvolvimento =
      process.env.NODE_ENV !== "production" &&
      ["localhost", "127.0.0.1"].includes(url.hostname);
    return url.origin === urlBase.origin || localEmDesenvolvimento
      ? url.toString()
      : urlBase.toString();
  } catch {
    return urlBase.toString();
  }
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
    (
      cabecalhos.get("x-vercel-forwarded-for") ??
      cabecalhos.get("x-forwarded-for") ??
      "local"
    )
      .split(",")[0]
      ?.trim() ?? "local";

  let cliente: ReturnType<typeof clienteEscrita>;
  try {
    cliente = clienteEscrita();
    if (await excedeuLimitePersistente(cliente, ip)) {
      return {
        mensagem: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      };
    }
  } catch (erro) {
    console.error("Falha ao aplicar proteção do formulário", erro);
    return { mensagem: "Não foi possível enviar agora. Tente novamente pelo WhatsApp." };
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
  const tempoPreenchimento = Date.now() - dados.iniciadoEm;
  if (tempoPreenchimento < 1_000 || tempoPreenchimento > 2 * 60 * 60 * 1_000) {
    return { mensagem: "Atualize a página e tente novamente." };
  }

  let imovel: { _id: string; nome: string; bairro?: string } | null = null;
  if (dados.imovelId) {
    try {
      imovel = await cliente.fetch(queryImovelParaLead, { id: dados.imovelId });
    } catch (erro) {
      console.error("Falha ao validar imóvel do lead", erro);
      return {
        mensagem: "Não foi possível enviar agora. Tente novamente pelo WhatsApp.",
      };
    }
    if (!imovel) {
      return { mensagem: "Este imóvel não está mais disponível. Escolha outro imóvel." };
    }
  }

  const agora = new Date().toISOString();
  const eventId = randomUUID();
  const pagina = paginaConfiavel(dados.pagina);
  const origem = {
    pagina,
    utmSource: dados.utmSource,
    utmMedium: dados.utmMedium,
    utmCampaign: dados.utmCampaign,
    utmContent: dados.utmContent,
    utmTerm: dados.utmTerm,
    fbclid: dados.fbclid,
  };

  try {
    await cliente.create({
      // O dataset é público; drafts só podem ser lidos por clientes autenticados.
      _id: `drafts.lead.${eventId}`,
      _type: "lead",
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      ...(dados.email ? { email: dados.email } : {}),
      ...(imovel ? { imovel: { _type: "reference", _ref: imovel._id } } : {}),
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
  const tarefas: Promise<unknown>[] = [
    enviarLeadMeta({
      eventId,
      url: pagina,
      telefone: dados.whatsapp,
      email: dados.email || undefined,
      ip: ip === "local" ? undefined : ip,
      userAgent: cabecalhos.get("user-agent") ?? undefined,
      fbp: cookieStore.get("_fbp")?.value,
      fbc: cookieStore.get("_fbc")?.value,
      imovel: imovel?.nome,
    }),
    notificarLead({
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      email: dados.email || undefined,
      imovel: imovel?.nome,
      pagina,
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
      imovel
        ? { tipo: "imovel", nome: imovel.nome, bairro: imovel.bairro }
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
    signal: AbortSignal.timeout(8_000),
  });
  if (!resposta.ok)
    throw new Error(
      `Resend ${resposta.status}: ${(await resposta.text()).slice(0, 300)}`,
    );
}
