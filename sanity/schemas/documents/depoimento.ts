import { defineField, defineType } from "sanity";

/** Prova social na home. So aparece no site com "aprovado" ligado. */
export const depoimento = defineType({
  name: "depoimento",
  title: "Depoimento",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome de quem falou",
      type: "string",
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "texto",
      title: "Depoimento",
      type: "text",
      rows: 4,
      validation: (regra) => regra.required().max(400),
    }),
    defineField({
      name: "imovel",
      title: "Comprou qual imóvel",
      type: "reference",
      to: [{ type: "imovel" }],
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "aprovado",
      title: "Aprovado para exibir",
      type: "boolean",
      initialValue: false,
      description: "Só publique com autorização da pessoa.",
    }),
  ],
  preview: {
    select: { title: "nome", subtitle: "texto", media: "foto" },
  },
});
