import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Empreendimento. Documento central do site.
 *
 * NAO EXISTE CAMPO DE PRECO, de proposito. Decisao do cliente em 28/07/2026:
 * o site nunca exibe valor, sempre "Consulte condicoes". A tabela de vendas e
 * material comercial interno (VGV, desconto, sinal, pro-soluto por unidade) e
 * nao pode ir para o ar. Ver CLAUDE.md decisao 3.
 *
 * Os campos estao agrupados em abas porque quem edita e o corretor, nao um dev.
 */

export const STATUS_IMOVEL = [
  { title: "Lançamento", value: "lancamento" },
  { title: "Em obras", value: "obras" },
  { title: "Pronto para morar", value: "pronto" },
] as const;

export const imovel = defineType({
  name: "imovel",
  title: "Imóvel",
  type: "document",
  groups: [
    { name: "principal", title: "Principal", default: true },
    { name: "conteudo", title: "Textos" },
    { name: "midia", title: "Fotos e plantas" },
    { name: "tecnico", title: "Ficha técnica" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // --- Principal ---------------------------------------------------------
    defineField({
      name: "nome",
      title: "Nome do empreendimento",
      type: "string",
      group: "principal",
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "slug",
      title: "Identificador na URL",
      type: "slug",
      group: "principal",
      options: { source: "nome", maxLength: 80 },
      description:
        "Fica em claudiocorretor.com/imovel/<isto>. Evite mudar depois de publicado.",
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "publicado",
      title: "Publicado no site",
      type: "boolean",
      group: "principal",
      initialValue: false,
      description: "Desligue quando o empreendimento esgotar — sai do site na hora.",
    }),
    defineField({
      name: "destaque",
      title: "Destacar na home",
      type: "boolean",
      group: "principal",
      initialValue: false,
    }),
    defineField({
      name: "ordem",
      title: "Ordem de exibição",
      type: "number",
      group: "principal",
      description: "Menor aparece primeiro. Vazio vai para o fim.",
    }),
    defineField({
      name: "status",
      title: "Status da obra",
      type: "string",
      group: "principal",
      options: { list: [...STATUS_IMOVEL], layout: "radio" },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "construtora",
      title: "Construtora",
      type: "reference",
      group: "principal",
      to: [{ type: "construtora" }],
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "regiao",
      title: "Região",
      type: "reference",
      group: "principal",
      to: [{ type: "regiao" }],
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "locais",
      title: "Endereços",
      type: "array",
      group: "principal",
      of: [defineArrayMember({ type: "local" })],
      description:
        "O endereço do empreendimento e, quando houver, o do stand de vendas — " +
        "eles quase nunca são o mesmo lugar durante a obra.",
    }),
    defineField({
      name: "coordenadas",
      title: "Ponto no mapa",
      type: "geopoint",
      group: "principal",
      description: "Onde o alfinete cai no mapa da página do imóvel.",
    }),

    // --- Textos ------------------------------------------------------------
    defineField({
      name: "chamada",
      title: "Chamada curta",
      type: "string",
      group: "conteudo",
      description:
        'Uma linha, aparece no card do catálogo. Ex.: "2 quartos com varanda e lazer completo".',
      validation: (regra) => regra.max(90).warning("Acima de 90 quebra o card."),
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "array",
      group: "conteudo",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Parágrafo", value: "normal" }],
        }),
      ],
      description:
        "Escreva com suas palavras. Copiar o texto do site da construtora gera " +
        "conteúdo duplicado e derruba o site no Google.",
    }),
    defineField({
      name: "diferenciais",
      title: "Itens de lazer e diferenciais",
      type: "array",
      group: "conteudo",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: 'Ex.: "Piscina", "Churrasqueira", "Pet place", "Coworking".',
    }),
    defineField({
      name: "textoLegal",
      title: "Texto legal / registro de incorporação",
      type: "text",
      group: "conteudo",
      rows: 4,
      description:
        "Exigência legal. Aparece em letra miúda no rodapé da página do imóvel.",
    }),

    // --- Fotos e plantas ---------------------------------------------------
    defineField({
      name: "capa",
      title: "Foto de capa",
      type: "image",
      group: "midia",
      options: { hotspot: true },
      description: "Aparece no card do catálogo e nos anúncios. Escolha a mais forte.",
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem",
          type: "string",
          description: "Para leitores de tela e para o Google.",
        }),
      ],
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "galeria",
      title: "Galeria de fotos",
      type: "array",
      group: "midia",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Descrição da imagem", type: "string" }),
            defineField({ name: "legenda", title: "Legenda", type: "string" }),
          ],
        }),
      ],
      options: { layout: "grid" },
      description:
        "Até 12 fotos. Acima disso a página fica pesada e ninguém rola até o fim.",
      validation: (regra) => regra.max(12).warning("Acima de 12 fotos pesa a página."),
    }),
    defineField({
      name: "tipologias",
      title: "Tipologias",
      type: "array",
      group: "midia",
      of: [defineArrayMember({ type: "tipologia" })],
      description:
        "Uma por opção de apartamento. É daqui que sai o filtro de quartos do catálogo.",
      validation: (regra) => regra.min(1).error("Cadastre ao menos uma tipologia."),
    }),
    defineField({
      name: "plantas",
      title: "Plantas avulsas",
      type: "array",
      group: "midia",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Descrição da imagem", type: "string" }),
            defineField({
              name: "rotulo",
              title: "Rótulo",
              type: "string",
              description: 'Ex.: "2 quartos — 45 m²". Opcional.',
            }),
          ],
        }),
      ],
      options: { layout: "grid" },
      description:
        "Plantas que ainda não foram ligadas a uma tipologia. O material da Cury vem " +
        "assim: as imagens existem, mas sem indicar a qual planta cada uma pertence. " +
        "Ao identificar, mova a imagem para dentro da tipologia correspondente.",
    }),
    defineField({
      name: "video",
      title: "Vídeo (YouTube)",
      type: "url",
      group: "midia",
      description:
        "Cole o link do YouTube. O player só carrega quando a pessoa clica, " +
        "para não deixar a página lenta.",
    }),

    // --- Ficha técnica -----------------------------------------------------
    defineField({
      name: "fichaTecnica",
      title: "Ficha técnica",
      type: "object",
      group: "tecnico",
      options: { columns: 2 },
      fields: [
        defineField({
          name: "areaTerreno",
          title: "Área do terreno (m²)",
          type: "number",
        }),
        defineField({ name: "blocos", title: "Blocos / torres", type: "number" }),
        defineField({
          name: "pavimentos",
          title: "Pavimentos por bloco",
          type: "number",
        }),
        defineField({
          name: "totalUnidades",
          title: "Total de unidades",
          type: "number",
        }),
        defineField({ name: "totalVagas", title: "Total de vagas", type: "number" }),
        defineField({ name: "entrega", title: "Previsão de entrega", type: "string" }),
      ],
    }),
    defineField({
      name: "origemCury",
      title: "URL original na Cury",
      type: "url",
      group: "tecnico",
      description:
        "Preenchido pelo script de importação. Serve para reconferir os dados na fonte. " +
        "Não aparece no site.",
      readOnly: true,
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],

  orderings: [
    {
      title: "Ordem do site",
      name: "ordemSite",
      by: [
        { field: "ordem", direction: "asc" },
        { field: "nome", direction: "asc" },
      ],
    },
    { title: "Nome (A–Z)", name: "nomeAsc", by: [{ field: "nome", direction: "asc" }] },
  ],

  preview: {
    select: {
      title: "nome",
      regiao: "regiao.nome",
      construtora: "construtora.nome",
      status: "status",
      publicado: "publicado",
      media: "capa",
    },
    prepare({ title, regiao, construtora, status, publicado, media }) {
      const rotulo = STATUS_IMOVEL.find((s) => s.value === status)?.title ?? status;
      return {
        title: publicado ? title : `${title} — rascunho`,
        subtitle: [rotulo, regiao, construtora].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
