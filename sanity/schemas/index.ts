import type { SchemaTypeDefinition } from "sanity";

import { construtora } from "./documents/construtora";
import { regiao } from "./documents/regiao";
import { imovel } from "./documents/imovel";
import { lead } from "./documents/lead";
import { depoimento } from "./documents/depoimento";
import { configuracoes } from "./documents/configuracoes";
import { tipologia } from "./objects/tipologia";
import { seo } from "./objects/seo";
import { local } from "./objects/local";

export const schemaTypes: SchemaTypeDefinition[] = [
  // documentos
  imovel,
  construtora,
  regiao,
  lead,
  depoimento,
  configuracoes,
  // objetos reutilizaveis
  tipologia,
  seo,
  local,
];
