import { defineField, defineType } from "sanity";

/**
 * Bairro/regiao do imovel. As zonas sao o primeiro nivel do filtro de
 * localidade e viram rota estatica /imoveis/[regiao] para SEO e campanha
 * segmentada. Ver docs/AUDITORIA-DADOS.md secao 1.
 */

export const ZONAS = [
  { title: "Zona Portuária", value: "zona-portuaria" },
  { title: "Zona Norte", value: "zona-norte" },
  { title: "Zona Oeste", value: "zona-oeste" },
  { title: "Centro", value: "centro" },
  { title: "Niterói", value: "niteroi" },
  { title: "São Gonçalo", value: "sao-goncalo" },
  { title: "Baixada Fluminense", value: "baixada-fluminense" },
] as const;

export const regiao = defineType({
  name: "regiao",
  title: "Região",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome do bairro / região",
      type: "string",
      description: 'Ex.: "Porto Maravilha", "Irajá", "Nova Iguaçu".',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "slug",
      title: "Identificador na URL",
      type: "slug",
      options: { source: "nome", maxLength: 60 },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "zona",
      title: "Zona",
      type: "string",
      options: { list: [...ZONAS], layout: "dropdown" },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "descricao",
      title: "Texto sobre a região",
      type: "text",
      rows: 5,
      description:
        "Aparece na página da região e ajuda no Google. Escreva original — " +
        "copiar o texto da construtora gera conteúdo duplicado.",
    }),
    defineField({
      name: "imagem",
      title: "Imagem da região",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  orderings: [
    {
      title: "Zona, depois nome",
      name: "zonaNome",
      by: [
        { field: "zona", direction: "asc" },
        { field: "nome", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "nome", subtitle: "zona", media: "imagem" },
    prepare({ title, subtitle, media }) {
      const zona = ZONAS.find((z) => z.value === subtitle)?.title ?? subtitle;
      return { title, subtitle: zona, media };
    },
  },
});
