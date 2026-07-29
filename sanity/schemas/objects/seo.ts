import { defineField, defineType } from "sanity";

/**
 * Sobrescreve titulo/descricao gerados automaticamente.
 * Deixar vazio e o normal — o app monta a partir do nome, bairro e tipologias.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "titulo",
      title: "Título na busca",
      type: "string",
      description: "Até ~60 caracteres. Vazio = gerado automaticamente.",
      validation: (regra) => regra.max(70).warning("Acima de 70 o Google corta."),
    }),
    defineField({
      name: "descricao",
      title: "Descrição na busca",
      type: "text",
      rows: 3,
      description: "Até ~155 caracteres. Vazio = gerado automaticamente.",
      validation: (regra) => regra.max(170).warning("Acima de 170 o Google corta."),
    }),
    defineField({
      name: "imagem",
      title: "Imagem de compartilhamento",
      type: "image",
      description:
        "Aparece ao colar o link no WhatsApp, Instagram e Facebook. Ideal 1200x630. " +
        "Vazio = usa a primeira foto da galeria.",
    }),
  ],
});
