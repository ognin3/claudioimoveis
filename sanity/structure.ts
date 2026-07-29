import type { StructureResolver } from "sanity/structure";

/**
 * Menu do Studio. Quem usa e o corretor, entao a organizacao segue a cabeca
 * dele — "o que esta no ar", "o que e lancamento", "quem me chamou" — e nao a
 * lista crua de tipos de documento.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conteúdo")
    .items([
      S.listItem()
        .title("Imóveis")
        .child(
          S.list()
            .title("Imóveis")
            .items([
              S.listItem()
                .title("Publicados no site")
                .child(
                  S.documentList()
                    .title("Publicados")
                    .filter('_type == "imovel" && publicado == true')
                    .defaultOrdering([
                      { field: "ordem", direction: "asc" },
                      { field: "nome", direction: "asc" },
                    ]),
                ),
              S.listItem()
                .title("Rascunhos / fora do ar")
                .child(
                  S.documentList()
                    .title("Fora do ar")
                    .filter('_type == "imovel" && publicado != true'),
                ),
              S.divider(),
              S.listItem()
                .title("Lançamentos")
                .child(
                  S.documentList()
                    .title("Lançamentos")
                    .filter('_type == "imovel" && status == "lancamento"'),
                ),
              S.listItem()
                .title("Em obras")
                .child(
                  S.documentList()
                    .title("Em obras")
                    .filter('_type == "imovel" && status == "obras"'),
                ),
              S.listItem()
                .title("Prontos para morar")
                .child(
                  S.documentList()
                    .title("Prontos para morar")
                    .filter('_type == "imovel" && status == "pronto"'),
                ),
              S.divider(),
              S.listItem()
                .title("Todos os imóveis")
                .child(S.documentTypeList("imovel").title("Todos os imóveis")),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Leads")
        .child(
          S.list()
            .title("Leads")
            .items([
              S.listItem()
                .title("Novos")
                .child(
                  S.documentList()
                    .title("Novos")
                    .filter('_type == "lead" && status == "novo"')
                    .defaultOrdering([{ field: "criadoEm", direction: "desc" }]),
                ),
              S.listItem()
                .title("Em atendimento")
                .child(
                  S.documentList()
                    .title("Em atendimento")
                    .filter('_type == "lead" && status in ["contatado", "negociando"]')
                    .defaultOrdering([{ field: "criadoEm", direction: "desc" }]),
                ),
              S.listItem()
                .title("Vendidos")
                .child(
                  S.documentList()
                    .title("Vendidos")
                    .filter('_type == "lead" && status == "vendido"'),
                ),
              S.divider(),
              S.listItem()
                .title("Todos os leads")
                .child(
                  S.documentTypeList("lead")
                    .title("Todos os leads")
                    .defaultOrdering([{ field: "criadoEm", direction: "desc" }]),
                ),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem("construtora").title("Construtoras"),
      S.documentTypeListItem("regiao").title("Regiões"),
      S.documentTypeListItem("depoimento").title("Depoimentos"),

      S.divider(),

      // Singleton: um unico documento, sem lista.
      S.listItem()
        .title("Configurações do site")
        .id("configuracoes")
        .child(S.document().schemaType("configuracoes").documentId("configuracoes")),
    ]);
