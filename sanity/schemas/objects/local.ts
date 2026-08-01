import { defineField, defineType } from "sanity";

/**
 * Um endereco do empreendimento. Existem pelo menos dois casos distintos e o
 * cliente precisa saber a diferenca: o predio em si e o STAND DE VENDAS, que
 * quase nunca fica no mesmo lugar durante a obra. Mandar alguem para o canteiro
 * achando que e o stand queima a visita.
 *
 * Waze e Google Maps ficam em campos proprios porque o scrape da Cury ja traz
 * os dois links prontos por imovel.
 */
export const local = defineType({
  name: "local",
  title: "Endereço",
  type: "object",
  fields: [
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      initialValue: "empreendimento",
      options: {
        list: [
          { title: "Empreendimento", value: "empreendimento" },
          { title: "Stand de vendas", value: "stand" },
          { title: "Apartamento decorado", value: "decorado" },
        ],
        layout: "radio",
      },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "endereco",
      title: "Endereço",
      type: "string",
      description: 'Ex.: "Rua Cordeiro da Graça, 25, Santo Cristo".',
      validation: (regra) => regra.required(),
    }),
    defineField({ name: "waze", title: "Link do Waze", type: "url" }),
    defineField({ name: "googleMaps", title: "Link do Google Maps", type: "url" }),
  ],
  preview: {
    select: { tipo: "tipo", endereco: "endereco" },
    prepare({ tipo, endereco }) {
      const rotulos: Record<string, string> = {
        empreendimento: "Empreendimento",
        stand: "Stand de vendas",
        decorado: "Apartamento decorado",
      };
      return { title: endereco, subtitle: rotulos[tipo] ?? tipo };
    },
  },
});
