import { defineQuery } from "next-sanity";

/**
 * Todas as queries GROQ do site moram aqui — nunca inline em componente.
 *
 * PROJECAO DO CARD (`camposCard`) e deliberadamente enxuta: o catalogo manda a
 * lista inteira para o cliente e filtra sem request nenhum. Cada campo a mais
 * aqui pesa no payload de TODOS os imoveis. Ver docs/PLANO-DE-ACAO.md Fase 5.
 */

const camposImagem = /* groq */ `{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "aspecto": asset->metadata.dimensions.aspectRatio,
  alt
}`;

/** Só o necessário para desenhar um card e aplicar os filtros. */
const camposCard = /* groq */ `
  "id": _id,
  "slug": slug.current,
  nome,
  chamada,
  status,
  destaque,
  ordem,
  "construtora": construtora->{ "slug": slug.current, nome },
  "regiao": regiao->{ "slug": slug.current, nome, zona },
  "quartos": array::unique(tipologias[].quartos),
  "areaMin": math::min(tipologias[].areaPrivativa),
  "areaMax": math::max(tipologias[].areaPrivativa),
  "vagasMax": math::max(tipologias[].vagas),
  "totalFotos": count(galeria),
  "capa": capa ${camposImagem}
`;

const ordemPadrao = /* groq */ `order(ordem asc, nome asc)`;

/** Catálogo completo. Base do filtro client-side. */
export const queryImoveis = defineQuery(/* groq */ `
  *[_type == "imovel" && publicado == true] | ${ordemPadrao} { ${camposCard} }
`);

/** Seis lançamentos mais recentes da home, sem depender de marcação manual. */
export const queryImoveisDestaque = defineQuery(/* groq */ `
  *[_type == "imovel" && publicado == true && status == "lancamento"]
  | order(_createdAt desc, ordem asc, nome asc) [0...6] {
    ${camposCard},
    "imagemHero": coalesce(galeria[0], capa) ${camposImagem}
  }
`);

/** Página do imóvel — aqui sim vale trazer tudo. */
export const queryImovel = defineQuery(/* groq */ `
  *[_type == "imovel" && publicado == true && slug.current == $slug][0] {
    ${camposCard},
    "locais": locais[] { tipo, endereco, waze, googleMaps },
    coordenadas,
    "textoRegiao": regiao->descricao,
    descricao,
    diferenciais,
    textoLegal,
    video,
    fichaTecnica,
    "galeria": galeria[] ${camposImagem},
    "plantas": plantas[] { ${camposImagem.slice(1, -1)}, rotulo },
    "tipologias": tipologias[] {
      rotulo, quartos, areaPrivativa, suites, vagas,
      "planta": planta ${camposImagem}
    },
    seo {
      titulo,
      descricao,
      "imagem": imagem ${camposImagem}
    },
    "relacionados": *[
      _type == "imovel" && publicado == true && slug.current != $slug
      && regiao._ref == ^.regiao._ref
    ] | ${ordemPadrao} [0...3] { ${camposCard} }
  }
`);

/** Slugs para generateStaticParams. */
export const querySlugsImoveis = defineQuery(/* groq */ `
  *[_type == "imovel" && publicado == true].slug.current
`);

/** Regiões que têm ao menos um imóvel publicado — alimenta o filtro e as rotas por região. */
export const queryRegioes = defineQuery(/* groq */ `
  *[_type == "regiao" && count(*[_type == "imovel" && publicado == true && regiao._ref == ^._id]) > 0]
  | order(zona asc, nome asc) {
    "slug": slug.current,
    nome,
    zona,
    "total": count(*[_type == "imovel" && publicado == true && regiao._ref == ^._id])
  }
`);

export const queryRegiao = defineQuery(/* groq */ `
  *[_type == "regiao" && slug.current == $slug][0] {
    "slug": slug.current,
    nome,
    zona,
    descricao,
    "imagem": imagem ${camposImagem},
    "imoveis": *[_type == "imovel" && publicado == true && regiao._ref == ^._id]
      | ${ordemPadrao} { ${camposCard} }
  }
`);

export const queryConstrutoras = defineQuery(/* groq */ `
  *[_type == "construtora" && count(*[_type == "imovel" && publicado == true && construtora._ref == ^._id]) > 0]
  | order(nome asc) {
    "slug": slug.current,
    nome,
    "logo": logo ${camposImagem}
  }
`);

export const queryDepoimentos = defineQuery(/* groq */ `
  *[_type == "depoimento" && aprovado == true] | order(_createdAt desc) [0...8] {
    "id": _id,
    nome,
    texto,
    "foto": foto ${camposImagem},
    "imovel": imovel->{ nome, "slug": slug.current }
  }
`);

export const queryConfiguracoes = defineQuery(/* groq */ `
  *[_type == "configuracoes"][0] {
    heroTitulo,
    heroSubtitulo,
    sobreTexto,
    "fotoCorretor": fotoCorretor ${camposImagem}
  }
`);
