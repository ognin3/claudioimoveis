import { defineField, defineType } from "sanity";

/**
 * Uma opcao de planta do empreendimento. Um mesmo imovel tem varias
 * (ex.: Conquista Parque Iguacu tem Tipo Ponta 41,19m2, Garden Meio 56,47m2...).
 * O filtro de quartos do catalogo le daqui — nao existe campo "quartos" solto
 * no imovel, para nao haver duas fontes de verdade.
 */
export const tipologia = defineType({
  name: "tipologia",
  title: "Tipologia",
  type: "object",
  fields: [
    defineField({
      name: "rotulo",
      title: "Nome da planta",
      type: "string",
      description: 'Como a construtora chama. Ex.: "Tipo Ponta", "Garden Meio".',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "quartos",
      title: "Quartos",
      type: "number",
      description: "Use 0 para Studio. É o que alimenta o filtro do catálogo.",
      validation: (regra) => regra.required().min(0).max(5).integer(),
    }),
    defineField({
      name: "areaPrivativa",
      title: "Área privativa (m²)",
      type: "number",
      validation: (regra) => regra.positive(),
    }),
    defineField({
      name: "suites",
      title: "Suítes",
      type: "number",
      validation: (regra) => regra.min(0).max(5).integer(),
    }),
    defineField({
      name: "vagas",
      title: "Vagas de garagem",
      type: "number",
      validation: (regra) => regra.min(0).max(5).integer(),
    }),
    defineField({
      name: "planta",
      title: "Imagem da planta",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      rotulo: "rotulo",
      quartos: "quartos",
      area: "areaPrivativa",
      media: "planta",
    },
    prepare({ rotulo, quartos, area, media }) {
      const q = quartos === 0 ? "Studio" : `${quartos} quarto${quartos > 1 ? "s" : ""}`;
      return {
        title: rotulo || q,
        subtitle: [q, area ? `${area} m²` : null].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
