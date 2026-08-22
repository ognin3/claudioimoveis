# SEO, AEO e GEO — checklist de lançamento

## O que o site já entrega automaticamente

- `/sitemap.xml` com home, catálogo, 15 páginas regionais e 40 imóveis.
- `/robots.txt` liberando o site público e bloqueando Studio, APIs e página de obrigado.
- `/llms.txt` em Markdown com contexto do negócio, regiões, imóveis e canais oficiais.
- Título, descrição, canonical e imagem social nas páginas públicas.
- JSON-LD de `WebSite`, `RealEstateAgent`, `ApartmentComplex`, `CollectionPage`,
  `ItemList`, `BreadcrumbList` e perguntas frequentes.
- Conteúdo de resposta direta sobre MCMV e páginas locais por bairro/cidade.
- Links internos da home para todas as regiões e das regiões para os imóveis.

`llms.txt` ainda é uma proposta aberta, não uma garantia de citação por ferramentas de IA.
Ele complementa páginas claras, conteúdo verificável e dados estruturados; não substitui isso.

## Assim que o domínio estiver definido

1. Alterar `NEXT_PUBLIC_SITE_URL` para `https://dominio-final.com.br` na Vercel.
2. Criar uma propriedade de domínio no Google Search Console.
3. Adicionar o código recebido em `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` e publicar novamente.
4. Confirmar que `https://dominio-final.com.br/sitemap.xml` abre sem login.
5. No relatório **Sitemaps** do Search Console, enviar `sitemap.xml`.
6. Inspecionar a home, `/imoveis`, uma página regional e um imóvel; solicitar indexação.
7. Acompanhar páginas indexadas, consultas reais, cliques e erros. Ajustar títulos e conteúdo
   usando essas consultas em vez de adivinhar palavras-chave.

## Fontes de referência

- [Relatório de sitemaps do Google Search Console](https://support.google.com/webmasters/answer/7451001?hl=pt-BR)
- [Solicitar novo rastreamento ao Google](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=pt-br)
- [Proposta oficial do llms.txt](https://llmstxt.org/)
