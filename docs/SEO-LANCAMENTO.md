# SEO, AEO e GEO — checklist de lançamento

## Contrato implementado (não equivale a validação em produção)

- `/sitemap.xml` inclui home, catálogo, sobre, contato e somente os imóveis publicados
  e regiões com ao menos um imóvel publicado retornados pelo Sanity. Sem contagem fixa.
- `/privacidade` e `/obrigado`, que são `noindex`, não entram no sitemap.
- `lastModified` de imóvel e região vem do `_updatedAt` do respectivo documento Sanity.
  Páginas institucionais não declaram data: não há fonte editorial verificada para elas.
  A data de região não pretende representar a última mudança de todos os imóveis vinculados.
- `/robots.txt` libera o site público e bloqueia `/studio` (incluindo raiz e subrotas),
  `/api/` e `/dev/`. `/obrigado` fica rastreável para que o robô leia seu `noindex`.
- Canonical da home está na página home, não no layout raiz. Catálogo, sobre, contato,
  obrigado, regiões e imóveis declaram sua própria URL sem parâmetros de campanha/filtro.
  Privacidade é mantida pelo fluxo de conversão e deve declarar `/privacidade` e `noindex`.
- OG das páginas indexáveis declara URL da rota, `siteName` e locale do site. Imagens Sanity
  não declaram dimensões presumidas; as institucionais usam `/opengraph-image` existente.
- `/llms.txt` em Markdown com contexto do negócio, regiões, imóveis e canais oficiais.
- JSON-LD de `WebSite`, `RealEstateAgent`, `ApartmentComplex`, `CollectionPage`,
  `ItemList`, `BreadcrumbList` e perguntas frequentes permanece sem alteração neste patch.
- Conteúdo e disponibilidade não foram ampliados nem alterados por esta correção técnica.

`llms.txt` ainda é uma proposta aberta, não uma garantia de citação por ferramentas de IA.
Ele complementa páginas claras, conteúdo verificável e dados estruturados; não substitui isso.

## Assim que o domínio estiver definido

1. Configurar `NEXT_PUBLIC_SITE_URL` com a origem HTTPS final no ambiente de hospedagem.
2. Criar uma propriedade de domínio no Google Search Console.
3. Adicionar o código recebido em `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` e publicar novamente.
4. Confirmar que `https://dominio-final.com.br/sitemap.xml` abre sem login.
5. No relatório **Sitemaps** do Search Console, enviar `sitemap.xml`.
6. Inspecionar a home, `/imoveis`, uma página regional e um imóvel; solicitar indexação.
7. Acompanhar páginas indexadas, consultas reais, cliques e erros. Ajustar títulos e conteúdo
   usando essas consultas em vez de adivinhar palavras-chave.

## Smoke por URL antes de liberar indexação

Usar a origem final configurada acima; registrar URL, status, evidência extraída do HTML/XML,
data da verificação e resultado. Escolher slugs reais do CMS, não criar páginas de teste.

| URL | Critério de aprovação | Estado desta implementação |
| --- | --- | --- |
| `/robots.txt` | 200; sitemap na origem final; bloqueia `/studio` e subrotas; não bloqueia `/obrigado` nem `/privacidade` | Função exercitada localmente; HTTP pendente |
| `/sitemap.xml` | 200 XML; somente URLs indexáveis; ausentes privacidade, obrigado e studio; datas dinâmicas iguais ao `_updatedAt` real do documento; institucionais sem data inventada | Mapeamento exercitado com entrada controlada; CMS/HTTP pendentes |
| `/`, `/imoveis`, `/sobre`, `/contato` | 200; canonical único da própria rota; OG título/descrição coerentes, URL própria, `pt_BR`, nome do site; sem `noindex` | HTML renderizado pendente |
| `/imovel/<slug-publicado>` | 200; canonical e OG da própria rota; imagem social responde como imagem; nenhuma dimensão declarada sem fonte; JSON-LD corresponde ao imóvel | CMS/HTML/imagem pendentes |
| `/imoveis/<regiao-com-estoque>` | 200; canonical e OG da região; lista e schema correspondem ao estoque real | CMS/HTML pendentes |
| `/privacidade`, `/obrigado` | 200; `noindex` no HTML; canonical próprio; não listadas no sitemap e não bloqueadas no robots | HTML pendente; ownership privacidade é conversão |
| `/opengraph-image` | 200, `Content-Type: image/png`; conferir visual e metadados de tamanho gerados pelo endpoint | HTTP/visual pendentes |
| `/imovel/<slug-inexistente>` | 404 sem conteúdo ou schema de imóvel fictício | CMS/HTTP pendentes |

Repetir com User-Agent de crawler para observar metadata no HTML entregue, não apenas no DOM
do navegador. Conferir também URL com query de campanha para canonical limpo. Após publicação
autorizada no CMS, conferir invalidação do sitemap via tags e `_updatedAt` atualizado.

## Evidência e limites desta rodada

- Smoke local executou as funções reais de robots e sitemap (transpilação TypeScript em memória),
  com documentos controlados apenas para verificar mapeamento: exclusão das rotas `noindex`,
  preservação das datas recebidas e ausência de data nas quatro rotas institucionais. Não prova
  disponibilidade de estoque, integração Sanity, entrega HTTP nem renderização Next.
- Smoke adicional executou os exports de metadata institucional e os geradores de imóvel/região
  com dependências controladas: canonical e OG por rota, locale/nome do site e remoção das
  dimensões presumidas. Não substitui resolução final de metadata nem HTML renderizado pelo Next.
- Orquestrador recuperou IDs públicos CI e exercitou Next produção com CMS real: robots/sitemap/OG HTTP200; sitemap59 URLs sem privacidade e datas de documentos; canonicals/OG próprios observados no DOM home, catálogo, sobre, contato, região Porto e imóvel Saudosa Praça Onze. Privacidade/obrigado noindex e canonical próprios; rota inexistente404. TypeScript/ESLint passaram, build gerou artefatos e servidor iniciou. Nenhum dado fictício inserido no site.
- Estados pendentes da tabela acima representam a inspeção delegada inicial. HTTP/DOM local agora observado nos casos citados; origem HTTPS final, crawler User-Agent, invalidação após mutação CMS, imagem social individual e indexação permanecem pendentes. Não houve mutação CMS.
- Indexação, Search Console e Lighthouse/Core Web Vitals não observados; nenhum score ou ganho de tráfego afirmado.
- Configuração global, deploy, push, envio ao Search Console e compra de domínio não fazem
  parte deste patch. A origem pública correta é pré-requisito para validar URLs absolutas.

## Fontes de referência

- [Relatório de sitemaps do Google Search Console](https://support.google.com/webmasters/answer/7451001?hl=pt-BR)
- [Solicitar novo rastreamento ao Google](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=pt-br)
- [Proposta oficial do llms.txt](https://llmstxt.org/)
