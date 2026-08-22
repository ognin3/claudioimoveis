import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { ptBRLocale } from "@sanity/locale-pt-br";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

/**
 * Studio embutido em /studio, servido pelo proprio Next — um deploy so,
 * um dominio so, e o corretor entra pelo mesmo endereco do site.
 */
export default defineConfig({
  name: "claudio-corretor",
  title: "Cláudio Corretor",
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // Vision (playground de GROQ) so em desenvolvimento: e ferramenta de dev e
    // pesaria o bundle do Studio para o corretor.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
    ptBRLocale(),
  ],

  schema: { types: schemaTypes },

  document: {
    // O singleton de configuracoes nao pode ser duplicado nem apagado.
    // Leads ficam sempre como drafts: o dataset e publico e contem dados pessoais.
    actions: (acoes, contexto) => {
      if (contexto.schemaType === "configuracoes") {
        return acoes.filter(
          ({ action }) =>
            action && !["duplicate", "delete", "unpublish"].includes(action),
        );
      }
      if (contexto.schemaType === "lead") {
        return acoes.filter(
          ({ action }) =>
            action && !["publish", "unpublish", "duplicate"].includes(action),
        );
      }
      return acoes;
    },
  },
});
