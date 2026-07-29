import { defineField, defineType } from "sanity";

/**
 * Singleton: existe um unico documento deste tipo, fixado no menu do Studio
 * pelo structure.ts. Guarda o que o corretor pode querer mudar sem mexer em codigo.
 *
 * Dados de contato (WhatsApp, CRECI, Instagram) vivem em src/lib/site.ts, nao aqui:
 * eles entram em JSON-LD e metadata gerados em build, e um campo editavel abriria
 * espaco para o site ir ao ar com telefone errado.
 */
export const configuracoes = defineType({
  name: "configuracoes",
  title: "Configurações do site",
  type: "document",
  fields: [
    defineField({
      name: "heroTitulo",
      title: "Título da home",
      type: "string",
      validation: (regra) => regra.max(80),
    }),
    defineField({
      name: "heroSubtitulo",
      title: "Subtítulo da home",
      type: "text",
      rows: 3,
      validation: (regra) => regra.max(200),
    }),
    defineField({
      name: "fotoCorretor",
      title: "Foto do corretor",
      type: "image",
      options: { hotspot: true },
      description:
        "Use o enquadramento (hotspot) para escolher o recorte — a foto atual é " +
        "vertical e de resolução baixa.",
    }),
    defineField({
      name: "sobreTexto",
      title: 'Texto da seção "Sobre"',
      type: "text",
      rows: 6,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Configurações do site" }),
  },
});
