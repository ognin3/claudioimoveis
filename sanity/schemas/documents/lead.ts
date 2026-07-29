import { defineField, defineType } from "sanity";

/**
 * Lead capturado pelo formulario do site. Gravado pela Server Action da Fase 6,
 * antes de mandar a pessoa para o WhatsApp — assim o contato nao se perde se ela
 * desistir no meio.
 *
 * Fica no Studio de proposito: o corretor ganha um CRM basico sem custo extra e
 * sem mais uma ferramenta para aprender.
 *
 * LGPD: sao dados pessoais. Nao adicionar campos alem do necessario para o
 * atendimento, e nao expor este tipo em nenhuma query publica do site.
 */
export const lead = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  // Somente a Server Action escreve aqui.
  readOnly: false,
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      validation: (regra) => regra.required(),
    }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({
      name: "imovel",
      title: "Imóvel de interesse",
      type: "reference",
      to: [{ type: "imovel" }],
      description: "Vazio = veio de uma página geral, não da página de um imóvel.",
    }),
    defineField({
      name: "status",
      title: "Situação",
      type: "string",
      initialValue: "novo",
      options: {
        list: [
          { title: "Novo", value: "novo" },
          { title: "Contatado", value: "contatado" },
          { title: "Em negociação", value: "negociando" },
          { title: "Vendido", value: "vendido" },
          { title: "Perdido", value: "perdido" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "anotacoes",
      title: "Anotações do atendimento",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "criadoEm",
      title: "Recebido em",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "origem",
      title: "Origem do lead",
      type: "object",
      description: "Preenchido automaticamente. Mostra qual anúncio trouxe a pessoa.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "pagina", title: "Página de origem", type: "string" }),
        defineField({ name: "utmSource", title: "utm_source", type: "string" }),
        defineField({ name: "utmMedium", title: "utm_medium", type: "string" }),
        defineField({ name: "utmCampaign", title: "utm_campaign", type: "string" }),
        defineField({ name: "utmContent", title: "utm_content", type: "string" }),
        defineField({ name: "utmTerm", title: "utm_term", type: "string" }),
        defineField({ name: "fbclid", title: "fbclid", type: "string" }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Mais recentes",
      name: "recentes",
      by: [{ field: "criadoEm", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      nome: "nome",
      whatsapp: "whatsapp",
      imovel: "imovel.nome",
      status: "status",
    },
    prepare({ nome, whatsapp, imovel, status }) {
      return {
        title: `${nome} — ${whatsapp}`,
        subtitle: [status, imovel ?? "contato geral"].filter(Boolean).join(" · "),
      };
    },
  },
});
