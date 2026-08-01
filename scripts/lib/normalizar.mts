/**
 * Regras de normalizacao do scrape da Cury. Ficam separadas dos scripts para
 * poderem ser testadas isoladamente — sao elas que mais tem armadilha.
 * Ver docs/AUDITORIA-DADOS.md secao 3.
 */

/** `"2 dorms. , 3 dorms."` e `"Studio , 1 dorm."` => `[0, 1, 2, 3]`. */
export function extrairQuartos(bruto: string | null | undefined): number[] {
  if (!bruto) return [];
  // O campo vem com \n e blocos de espaco no meio. Achatar antes de qualquer coisa.
  const limpo = bruto.replace(/\s+/g, " ").trim();
  const encontrados = new Set<number>();
  // "Studio" e uma tipologia sem quarto separado: representamos como 0.
  if (/studio/i.test(limpo)) encontrados.add(0);
  for (const m of limpo.matchAll(/(\d+)\s*dorm/gi)) encontrados.add(Number(m[1]));
  return [...encontrados].sort((a, b) => a - b);
}

const ROTULO_STATUS: Record<string, "lancamento" | "obras" | "pronto"> = {
  Lançamento: "lancamento",
  "Em Obras": "obras",
  "Pronto para Morar": "pronto",
};

export function mapearStatus(rotulo: string): "lancamento" | "obras" | "pronto" {
  const s = ROTULO_STATUS[rotulo.trim()];
  if (!s) throw new Error(`Status desconhecido no scrape: ${JSON.stringify(rotulo)}`);
  return s;
}

/**
 * `"Empreendimento"` / `"Stand de Vendas"` => o `tipo` do objeto `local`.
 * Qualquer coisa fora disso vira "empreendimento" com aviso, para nao perder o
 * endereco por causa de um rotulo novo.
 */
export function mapearTipoLocal(tipo: string): "empreendimento" | "stand" | "decorado" {
  const t = tipo.trim().toLowerCase();
  if (t.includes("stand")) return "stand";
  if (t.includes("decorado")) return "decorado";
  return "empreendimento";
}

/**
 * Regiao do scrape => slug canonico do Sanity.
 *
 * NAO derivar a zona da URL da Cury: ela e inconsistente para a mesma regiao
 * (Epicentro fica em /centro/ mas e Porto Maravilha; Residencial Cartola fica em
 * /zona-portuaria/ mas e Sao Cristovao). Ver scripts/seed-base.mts.
 *
 * "Centro" e ambiguo e por isso depende da zona da URL: o scrape usa o mesmo
 * nome para o Centro do Rio e para o Centro de Niteroi.
 */
export function mapearRegiao(regiao: string, zonaDaUrl: string): string | null {
  const r = regiao.trim();
  if (r === "Centro") return zonaDaUrl === "niteroi" ? "centro-niteroi" : "centro-rio";

  const mapa: Record<string, string> = {
    "Porto Maravilha": "porto-maravilha",
    "Santo Cristo": "santo-cristo",
    "Imperial de São Cristóvão": "imperial-sao-cristovao",
    "São Cristóvão": "sao-cristovao",
    Irajá: "iraja",
    Bonsucesso: "bonsucesso",
    Olaria: "olaria",
    Piedade: "piedade",
    Jacarepaguá: "jacarepagua",
    "Campo Grande": "campo-grande",
    Recreio: "recreio",
    Niterói: "niteroi",
    "Nova Iguaçu": "nova-iguacu",
  };
  return mapa[r] ?? null;
}

/** Zona a partir da URL: `https://cury.net/imovel/RJ/<zona>/<slug>`. */
export function zonaDaUrl(url: string): string {
  return /\/imovel\/RJ\/([^/]+)\//.exec(url)?.[1] ?? "";
}

/** Slug do imovel: o ultimo segmento da URL da Cury, que ja e estavel e unico. */
export function slugDaUrl(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

/**
 * O embed de video da Cury quase sempre vem sem ID:
 * `https://www.youtube.com/embed/?rel=0&showinfo=0&origin=...`
 * Sem ID nao ha video — devolve null em vez de um link quebrado.
 */
export function limparVideo(url: string | null | undefined): string | null {
  if (!url) return null;
  const id = /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/.exec(url)?.[1];
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

/** Rotulo legivel de uma tipologia a partir do numero de quartos. */
export function rotuloTipologia(quartos: number): string {
  if (quartos === 0) return "Studio";
  return `${quartos} quarto${quartos > 1 ? "s" : ""}`;
}
