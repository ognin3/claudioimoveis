import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../../sanity/env";

/**
 * Cliente de LEITURA. Sem token: le apenas conteudo publicado, e por isso pode
 * rodar em qualquer lugar sem risco de vazar rascunho.
 * `useCdn` liga o CDN do Sanity — resposta mais rapida e mais barata.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Cliente de ESCRITA. Usado pela Server Action que grava o lead e pelos scripts
 * de importacao da Fase 4.
 *
 * NUNCA importar isto de um componente client: o token daria a qualquer visitante
 * poder de escrever no dataset. Mantido em arquivo separado do de leitura para
 * que um import errado salte aos olhos na revisao.
 */
export function clienteEscrita() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN ausente. Necessario para gravar leads e rodar a importacao.",
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    // CDN desligado: escrita precisa enxergar o estado atual, nao o cacheado.
    useCdn: false,
  });
}
