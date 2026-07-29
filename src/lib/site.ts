/**
 * Fonte unica dos dados do corretor e do site.
 * Estes valores aparecem em footer, JSON-LD, metadata e mensagens de WhatsApp —
 * nunca repetir literal em componente. Ver CLAUDE.md secao 1.
 */

export const site = {
  nome: "Cláudio Corretor",
  /** Obrigatorio no rodape de todas as paginas por exigencia do CRECI. */
  creci: "CRECI 103666",
  email: "claudioshema2009@gmail.com",
  instagram: "https://www.instagram.com/claudio_corretordeimoveis",
  instagramHandle: "@claudio_corretordeimoveis",

  /** Somente digitos, formato aceito pelo wa.me. */
  whatsapp: "5521976852128",
  whatsappExibicao: "(21) 97685-2128",

  bio:
    "Ajudo famílias a realizar o sonho da casa própria. Empreendimentos do programa " +
    "Minha Casa Minha Vida com parcelas que cabem no seu bolso, lazer completo e " +
    "localização privilegiada no Rio de Janeiro.",

  descricaoCurta:
    "Apartamentos Minha Casa Minha Vida no Rio de Janeiro, Niterói, São Gonçalo e Baixada. " +
    "Lançamentos e imóveis prontos com entrada facilitada.",

  /**
   * Trocar para o dominio proprio quando ele existir.
   * Enquanto for *.vercel.app o Meta nao consegue verificar o dominio
   * (esta na Public Suffix List) — ver CLAUDE.md secao 5.6.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  locale: "pt_BR",
  regiao: "Rio de Janeiro",
} as const;

/** Construtoras representadas. `slug` casa com o document `construtora` do Sanity. */
export const construtoras = [
  { slug: "cury", nome: "Cury" },
  { slug: "jv", nome: "JV — Jerônimo da Veiga" },
  { slug: "direcional", nome: "Direcional" },
  { slug: "voce-rj", nome: "Construtora Você RJ" },
  { slug: "reboucas", nome: "Rebouças" },
] as const;

export type ConstrutoraSlug = (typeof construtoras)[number]["slug"];
