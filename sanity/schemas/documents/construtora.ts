import { defineField, defineType } from "sanity";

/**
 * O portfolio e multi-construtora: Cury, JV (Jeronimo da Veiga), Direcional,
 * Construtora Voce RJ e Reboucas. Vira filtro no catalogo.
 * Ver docs/MATERIAL-NOVO.md.
 */
export const construtora = defineType({
  name: "construtora",
  title: "Construtora",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
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
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Preferir PNG ou SVG com fundo transparente.",
    }),
    defineField({
      name: "site",
      title: "Site oficial",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "nome", media: "logo" },
  },
});
