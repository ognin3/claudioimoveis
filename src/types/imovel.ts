import type { PortableTextBlock } from "next-sanity";
import type { StatusImovel } from "@/components/ui/Badge";

/**
 * Tipos do conteudo vindo do Sanity. Escritos a mao e espelhando exatamente as
 * projecoes de src/lib/sanity/queries.ts — mudar a query obriga a mudar aqui.
 */

export type ZonaSlug =
  | "zona-portuaria"
  | "zona-norte"
  | "zona-oeste"
  | "centro"
  | "niteroi"
  | "sao-goncalo"
  | "baixada-fluminense";

export type ImagemSanity = {
  url: string;
  /** Base64 minusculo para blur enquanto a imagem real carrega — evita layout shift. */
  lqip: string | null;
  aspecto: number | null;
  alt: string | null;
};

export type ConstrutoraResumo = {
  slug: string;
  nome: string;
  logo?: ImagemSanity | null;
};

export type RegiaoResumo = {
  slug: string;
  nome: string;
  zona: ZonaSlug;
  total?: number;
};

/** Payload enxuto do catalogo. Mantenha pequeno: vai inteiro para o cliente. */
export type CardImovel = {
  id: string;
  slug: string;
  nome: string;
  chamada: string | null;
  status: StatusImovel;
  destaque: boolean | null;
  ordem: number | null;
  construtora: Pick<ConstrutoraResumo, "slug" | "nome">;
  regiao: RegiaoResumo;
  /** 0 representa Studio. Deduplicado a partir das tipologias. */
  quartos: number[];
  areaMin: number | null;
  areaMax: number | null;
  vagasMax: number | null;
  /** Quantas fotos a galeria tem — vira o selo de contagem sobre a capa. */
  totalFotos: number | null;
  capa: ImagemSanity;
  /** Foto horizontal usada apenas no hero quando a capa original é panorâmica demais. */
  imagemHero?: ImagemSanity | null;
};

export type Tipologia = {
  rotulo: string;
  quartos: number;
  areaPrivativa: number | null;
  suites: number | null;
  vagas: number | null;
  planta: ImagemSanity | null;
};

export type FichaTecnica = {
  areaTerreno?: number | null;
  blocos?: number | null;
  pavimentos?: number | null;
  totalUnidades?: number | null;
  totalVagas?: number | null;
  entrega?: string | null;
};

export type TipoLocal = "empreendimento" | "stand" | "decorado";

/** Um endereco do empreendimento. O stand de vendas raramente fica no mesmo lugar. */
export type Local = {
  tipo: TipoLocal;
  endereco: string;
  waze: string | null;
  googleMaps: string | null;
};

export type ImovelCompleto = CardImovel & {
  locais: Local[] | null;
  coordenadas: { lat: number; lng: number } | null;
  /** Texto "Sobre a região", herdado do documento `regiao`. */
  textoRegiao: string | null;
  descricao: PortableTextBlock[] | null;
  diferenciais: string[] | null;
  textoLegal: string | null;
  video: string | null;
  fichaTecnica: FichaTecnica | null;
  galeria: ImagemSanity[] | null;
  /** Plantas que ainda nao foram vinculadas a uma tipologia — ver schema. */
  plantas: Array<ImagemSanity & { rotulo: string | null }> | null;
  tipologias: Tipologia[];
  seo: {
    titulo: string | null;
    descricao: string | null;
    imagem: ImagemSanity | null;
  } | null;
  relacionados: CardImovel[];
};

export type RegiaoComImoveis = RegiaoResumo & {
  descricao: string | null;
  imagem: ImagemSanity | null;
  imoveis: CardImovel[];
};

export type Depoimento = {
  id: string;
  nome: string;
  texto: string;
  foto: ImagemSanity | null;
  imovel: { nome: string; slug: string } | null;
};

export type Configuracoes = {
  heroTitulo: string | null;
  heroSubtitulo: string | null;
  sobreTexto: string | null;
  fotoCorretor: ImagemSanity | null;
};
