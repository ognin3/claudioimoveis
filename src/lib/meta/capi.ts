import "server-only";

import { createHash } from "node:crypto";

type EventoLeadMeta = {
  eventId: string;
  url: string;
  telefone: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  imovel?: string;
};

function sha256(valor: string) {
  return createHash("sha256").update(valor.trim().toLowerCase()).digest("hex");
}

/**
 * Envia o mesmo evento Lead disparado no navegador. O event_id compartilhado
 * faz a deduplicacao no Meta: uma conversao, mesmo chegando por Pixel e CAPI.
 */
export async function enviarLeadMeta(evento: EventoLeadMeta): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  const userData: Record<string, string | string[]> = {
    ph: [sha256(evento.telefone.replace(/\D/g, ""))],
  };
  if (evento.email) userData.em = [sha256(evento.email)];
  if (evento.ip) userData.client_ip_address = evento.ip;
  if (evento.userAgent) userData.client_user_agent = evento.userAgent;
  if (evento.fbp) userData.fbp = evento.fbp;
  if (evento.fbc) userData.fbc = evento.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: evento.eventId,
        event_source_url: evento.url,
        action_source: "website",
        user_data: userData,
        custom_data: {
          content_category: "Real Estate",
          ...(evento.imovel ? { content_name: evento.imovel } : {}),
        },
      },
    ],
    access_token: token,
  };
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  const versao = process.env.META_GRAPH_API_VERSION ?? "v23.0";
  const resposta = await fetch(
    `https://graph.facebook.com/${versao}/${encodeURIComponent(pixelId)}/events`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(`Meta CAPI ${resposta.status}: ${detalhe.slice(0, 300)}`);
  }
}
