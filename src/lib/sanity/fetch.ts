import { cacheLife, cacheTag } from "next/cache";
import { sanityClient } from "./client";
import { tags } from "./tags";
import * as q from "./queries";
import type {
  CardImovel,
  Configuracoes,
  ConstrutoraResumo,
  Depoimento,
  ImovelCompleto,
  RegiaoComImoveis,
  RegiaoResumo,
} from "@/types/imovel";

/**
 * Camada de leitura do site. Cada funcao e um Cache Component ("use cache"):
 * o resultado entra no shell estatico e so sai de la quando o webhook do Studio
 * chama `revalidateTag`. Ver src/app/api/revalidate/route.ts.
 *
 * `cacheLife("max")` de proposito: o conteudo muda por publicacao no Studio, nao
 * pelo relogio. Expirar por tempo so geraria requisicao a toa. A doc do Next
 * recomenda exatamente isso para CMS com webhook.
 */

export async function buscarImoveis(): Promise<CardImovel[]> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.imoveis);
  return sanityClient.fetch(q.queryImoveis);
}

export async function buscarImoveisDestaque(): Promise<CardImovel[]> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.imoveis);
  return sanityClient.fetch(q.queryImoveisDestaque);
}

export async function buscarImovel(slug: string): Promise<ImovelCompleto | null> {
  "use cache";
  cacheLife("max");
  // Duas tags: publicar este imovel invalida so ele; mexer na colecao invalida todos.
  cacheTag(tags.imovel(slug), tags.imoveis);
  return sanityClient.fetch(q.queryImovel, { slug });
}

export async function buscarSlugsImoveis(): Promise<string[]> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.imoveis);
  return sanityClient.fetch(q.querySlugsImoveis);
}

export async function buscarRegioes(): Promise<RegiaoResumo[]> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.regioes, tags.imoveis);
  return sanityClient.fetch(q.queryRegioes);
}

export async function buscarRegiao(slug: string): Promise<RegiaoComImoveis | null> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.regiao(slug), tags.imoveis);
  return sanityClient.fetch(q.queryRegiao, { slug });
}

export async function buscarConstrutoras(): Promise<ConstrutoraResumo[]> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.construtoras, tags.imoveis);
  return sanityClient.fetch(q.queryConstrutoras);
}

export async function buscarDepoimentos(): Promise<Depoimento[]> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.depoimentos);
  return sanityClient.fetch(q.queryDepoimentos);
}

export async function buscarConfiguracoes(): Promise<Configuracoes | null> {
  "use cache";
  cacheLife("max");
  cacheTag(tags.configuracoes);
  return sanityClient.fetch(q.queryConfiguracoes);
}
