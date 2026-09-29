export type Atribuicao = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
};

// IDs devem ser revisados pelo responsável. Configuração pública, sem dados pessoais.
const campanhasAprovadas = new Set((process.env.NEXT_PUBLIC_ATTRIBUTION_CAMPAIGN_IDS ?? "").split(",").map((id) => id.trim()).filter((id) => /^\d{5,30}$/.test(id)));
const criativosAprovados = new Set((process.env.NEXT_PUBLIC_ATTRIBUTION_CREATIVE_IDS ?? "").split(",").map((id) => id.trim()).filter((id) => /^\d{5,30}$/.test(id)));

// Não aceitar nomes livres de campanhas, termos de busca ou identificadores pessoais.
export function limparAtribuicao(dados: Record<string, unknown>): Atribuicao {
  const texto = (chave: string) => typeof dados[chave] === "string" ? dados[chave] as string : "";
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) return {};
  const source = texto("utmSource").toLowerCase();
  const medium = texto("utmMedium").toLowerCase();
  const campanha = texto("utmCampaign");
  const criativo = texto("utmContent");
  const clique = texto("fbclid");
  return {
    utmSource: ["facebook", "instagram", "meta", "fb", "ig", "google", "bing"].includes(source) ? source : undefined,
    utmMedium: ["paid_social", "paid_search", "cpc", "social"].includes(medium) ? medium : undefined,
    utmCampaign: campanhasAprovadas.has(campanha) ? campanha : undefined,
    utmContent: criativosAprovados.has(criativo) ? criativo : undefined,
    fbclid: /^[A-Za-z0-9_-]{20,500}$/.test(clique) ? clique : undefined,
  };
}

export function limparPagina(valor: string, base: string): string {
  const origem = new URL(base);
  try {
    const url = new URL(valor, origem);
    if (url.origin !== origem.origin) return origem.origin + "/";
    // Apenas rotas públicas conhecidas; segmentos livres podem conter dados pessoais.
    const caminho = /^\/(?:imoveis(?:\/[a-z0-9-]+)?|imovel\/[a-z0-9-]+|contato|sobre|privacidade|obrigado)?\/?$/.test(url.pathname)
      ? url.pathname : "/";
    return origem.origin + caminho;
  } catch {
    return origem.origin + "/";
  }
}

export function paginaSeguraParaPixel(valor: string, base: string): boolean {
  try {
    const url = new URL(valor);
    if (url.hash || limparPagina(valor, base) !== url.origin + url.pathname) return false;
    const campos: Record<string, keyof Atribuicao> = {
      utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign",
      utm_content: "utmContent", fbclid: "fbclid",
    };
    const dados: Record<string, unknown> = {};
    for (const [chave, conteudo] of url.searchParams) {
      if (!campos[chave] || url.searchParams.getAll(chave).length !== 1) return false;
      dados[campos[chave]] = conteudo;
    }
    const limpos = limparAtribuicao(dados);
    return Object.entries(dados).every(([chave, conteudo]) => limpos[chave as keyof Atribuicao] === conteudo);
  } catch {
    return false;
  }
}

export function referenciaSeguraParaPixel(valor: string, base: string): boolean {
  if (!valor) return true;
  try {
    const url = new URL(valor);
    if (url.origin === new URL(base).origin) return paginaSeguraParaPixel(valor, base);
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash && url.pathname === "/" &&
      ["facebook.com", "www.facebook.com", "m.facebook.com", "l.facebook.com", "instagram.com", "www.instagram.com", "google.com", "www.google.com", "www.google.com.br", "bing.com", "www.bing.com"].includes(url.hostname);
  } catch {
    return false;
  }
}
