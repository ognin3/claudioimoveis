import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const LEAD_RECEIPT_COOKIE = "lead_receipt";
export const LEAD_RECEIPT_MAX_AGE = 10 * 60;

// A local development process can sign and read its own receipts without a
// production secret. Production must use the same configured secret as rate limiting.
const developmentSecret = process.env.NODE_ENV === "production" ? null : randomBytes(32);

type Receipt = { expiresAt: number; imovel?: { nome: string; bairro?: string } };

function secret() {
  const configured = process.env.LEAD_SECURITY_SECRET ?? process.env.SANITY_REVALIDATE_SECRET;
  if (configured) return configured;
  if (developmentSecret) return developmentSecret;
  throw new Error("LEAD_SECURITY_SECRET ausente no ambiente de produção.");
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update("lead-receipt:v1:").update(payload).digest();
}

export function createLeadReceipt(imovel?: { nome: string; bairro?: string }) {
  const payload = Buffer.from(JSON.stringify({
    expiresAt: Date.now() + LEAD_RECEIPT_MAX_AGE * 1000,
    ...(imovel ? { imovel: { nome: imovel.nome, bairro: imovel.bairro } } : {}),
  } satisfies Receipt)).toString("base64url");
  return `${payload}.${signature(payload).toString("base64url")}`;
}

export function verifyLeadReceipt(value?: string): Receipt | null {
  if (!value || value.length > 1024) return null;
  const parts = value.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  try {
    const actual = Buffer.from(parts[1], "base64url");
    const expected = signature(parts[0]);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const receipt: unknown = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!receipt || typeof receipt !== "object" || !("expiresAt" in receipt)) return null;
    const candidate = receipt as Receipt;
    if (!Number.isSafeInteger(candidate.expiresAt) || candidate.expiresAt <= Date.now() ||
        candidate.expiresAt > Date.now() + LEAD_RECEIPT_MAX_AGE * 1000) return null;
    if (candidate.imovel && (typeof candidate.imovel.nome !== "string" ||
        candidate.imovel.nome.length > 120 ||
        (candidate.imovel.bairro !== undefined &&
          (typeof candidate.imovel.bairro !== "string" || candidate.imovel.bairro.length > 100)))) return null;
    return candidate;
  } catch {
    return null;
  }
}
