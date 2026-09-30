# Deploy Hostinger e reversão

## Estado e gates

Nenhum push ou deploy executado pelo assistente. Usuário transcreveu hPanel: estado Concluído; repositório claudioimoveis (owner/URL não exibidos); autor KernelOS; branch master; commit 7f63655f — fix: improve Hostinger WASM build compatibility; deployment 2026-09-15 22:35, duração3m58s; raiz ./; framework Next.js; build/saída Padrão; Node22.x. O prefixo coincide com HEAD inicial local 7f63655fbab65967545b48ec14214424f43a15e7, não com alterações locais posteriores ainda não publicadas. Os dois URLs Git retornaram esse mesmo HEAD; URL completa da integração hPanel e versão minor Node ainda não confirmadas. Domínio fornecido: www.claudioimoveis.com; canonical público sem www. Logs não fornecidos. Relay expirou, nenhum painel autenticado observado.

Usuário confirmou https://github.com/ognin3/claudioimoveis e autorizou explicitamente publicar as correções em master. Base remota reconfirmada antes da publicação: 7f63655fbab65967545b48ec14214424f43a15e7, igual à base local. Push direto ao URL confirmado, sem alterar origin e sem force. Campanhas/gastos e contatos reais não autorizados. Configuração privada não recuperada; mecanismo de reversão hPanel não observado. Reversão disponível por código: git revert do commit de correção e novo deployment pela mesma integração, preservando histórico; executar apenas se necessário/autorizado. URL local não será publicada como configuração: produção já responde com canonical https://claudioimoveis.com.

Baseline falhou por Sanity project ID ausente. Identificadores públicos CI recuperados; build gerou artefatos e `npm run start` serviu catálogo real local. TypeScript/ESLint passaram. Provas e limites em DIAGNOSTICO-INICIAL.md; não equivalem ao ambiente Hostinger ou à recepção de contatos.

## Publicação observada em 2026-09-29

Commit de correção 7785e06 publicado com sucesso via push HEAD:master para https://github.com/ognin3/claudioimoveis.git, a partir de 7f63655. Após cerca de quatro minutos as respostas ainda estavam antigas; depois as rotas passaram a refletir as correções. HTTP200: home, contato e privacidade com canonical/OG próprios; imóvel Saudosa com og:url próprio; sitemap com59 URLs, sem privacidade e datas editoriais de agosto; robots permite leitura de obrigado e bloqueia /studio. Browser www/contato no celular exibiu autorização opcional desmarcada e botões Autorizar/Recusar marketing, sem overflow horizontal e sem erros JS registrados. Rota inexistente respondeu404 após push. Nenhum formulário enviado, nenhuma campanha ativada. Logs hPanel não acessíveis; GitHub CLI sem GH_TOKEN. Prova de implantação por comportamento público, não por status/logs internos nem recebimento de leads. Para reversão do código, revert de 7785e06 preserva os commits anteriores; não executado.

## Modalidade suportada

[Hostinger Next.js](https://docs.hostinger.com/node.js/overview-1/next): app next, script build, saída .next, entry ignorado; standalone aplicado pela plataforma. [Build settings](https://docs.hostinger.com/node.js/build-settings): Node18/20/22/24 disponíveis, instalação/build limitados a15min cada. Usar Node24 como CI/local: dependências Sanity exigem>=22.12, requisito plataforma20+ é insuficiente para este grafo. Servidor obrigatório para actions, leads, webhook e Studio; upload estático não atende.

Config atual exporta objeto `next.config.mjs`; manter. Script `build` usa webpack intencionalmente; preservar ajustes WASM até validar no build Hostinger. Não converter para export estático.

Guia Next instalado consultado: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md`. Standalone manual não copia `public` e `.next/static` por padrão; verificar entrega de assets se hospedagem manual, sem presumir problema na modalidade gerenciada.

## Preparação sem publicação

1. Confirmar fonte publicada e salvar fora do Git um registro do deployment conhecido, commit, configurações e nomes das variáveis; nunca registrar valores secretos nos documentos.
2. Obter Sanity/configuração autorizada. Chaves `NEXT_PUBLIC_*` são embutidas no build; definir URL final HTTPS e IDs públicos antes de compilar. Tokens de escrita/Meta/Resend permanecem somente servidor.
3. Instalar com lockfile (`npm ci`), executar build, typecheck/lint e iniciar produção em teste. Exercitar home, catálogo, região, imóvel por URL direta e atualização, 404, assets, mobile, formulário até registro privado e encaminhamento WhatsApp.
4. Confirmar recebimento com responsável, eventID único no Pixel/CAPI e ausência de dados pessoais em URL/eventos. Verificar robots, sitemap e canonicals do domínio final.
5. Apresentar patch concreto e provas antes de pedir autorização de publicação. Sem alterar origem automaticamente.

## Publicação autorizada e verificação

Somente depois da autorização: publicar para a fonte/branch confirmada ou mecanismo explicitamente escolhido, observar logs de instalação/build/start e repetir smoke no domínio real. Verificar HTTPS, domínio alternativo, cache e redirecionamentos. Um build verde não comprova contatos recebidos ou funcionamento de assets.

## Reversão

Antes de publicar, confirmar no hPanel o mecanismo disponível para restaurar deployment anterior; não assumir botão de rollback. Conservar commit/artefato conhecido, configurações anteriores e variáveis em armazenamento seguro. Se houver restauração de deployment, usar o deployment conhecido; caso contrário reconstruir/republicar o commit anterior pela mesma fonte confirmada. Não usar reset destrutivo na árvore de trabalho. Mudanças de dados CMS exigem backup separado e aprovação; não foram autorizadas nem executadas.

Após reversão, repetir home/rota direta/assets/formulário. HEAD inicial 7f63655fbab65967545b48ec14214424f43a15e7 é referência de código, não prova deployment saudável. Nenhuma mutação CMS/estoque; schema local de lead ganhou registro marketing. Esse campo é aditivo; rollback de código não exige apagar drafts existentes.

## Revisão técnica posterior — 29/09/2026

- Lighthouse CLI 13.5.0, Chrome headless, origem pública, uma execução por rota/perfil (medição de laboratório, não PageSpeed Insights nem Core Web Vitals de usuários): home mobile 90/100/100/100 e desktop 97/100/100/100 em performance/acessibilidade/boas práticas/SEO. Catálogo mobile 90/100/100/100; imóvel Saudosa mobile 93/100/100/100. LCP: home mobile 3,2 s, desktop 0,7 s; catálogo 3,1 s; imóvel 2,9 s. CLS 0 nas quatro execuções. A API pública do PageSpeed Insights retornou HTTP 429, portanto nenhuma nota daquele serviço foi medida.
- A home mobile transferiu ~625 KiB em 29 requisições na execução: ~277 KiB de scripts, ~178 KiB de imagens e ~62 KiB de fontes. Lighthouse apontou ~64 KiB de JavaScript não utilizado, CSS render-blocking com economia estimada de 260 ms e ~27 KiB potenciais em compressão de imagens abaixo da dobra; o LCP da home foi o título, não a imagem hero. Essas oportunidades são estimativas, não garantia de ganho após alteração.
- Browser mobile abriu catálogo (12 cards no DOM) e imóvel (20 imagens no DOM), sem erro JS de página; navegações interromperam duas requisições de prefetch RSC. HTML de `/imoveis` obtido por fetch continha nome de imóvel, logo a suspeita de catálogo exclusivamente client-side não se confirmou no response observado.
- Antes das correções, `www.claudioimoveis.com` respondia 200 sem redirecionar, e GET/HEAD da home pública entregavam `Content-Security-Policy: upgrade-insecure-requests` apesar da política completa em `next.config.mjs`. HSTS e demais cabeçalhos previstos foram observados. Estado posterior depende da publicação e verificação na CDN.
- Antes das correções, o documento Sanity Saudosa Praça Onze continha latitude **+22.89721** nos dois links do stand; o geoponto do empreendimento já era correto. A atualização do documento remoto depende de credencial de escrita; correção localizada no render e na normalização está registrada abaixo.
- `queryRegiao` exige ao menos um imóvel publicado, coerente com listagem e sitemap. Sanity público tinha 15 regiões e nenhuma vazia na consulta; a alteração previne página vazia futura. Query retornou 11 imóveis para Porto Maravilha e `null` para slug inexistente; servidor de produção local respondeu 200 e 404 respectivamente.
- Antes da correção, `/obrigado` exibia confirmação em acesso direto sem envio. Nenhum formulário real foi enviado. Notas Lighthouse variam com execução e rede; dados de campo exigem acesso apropriado.

## Correções subsequentes (ainda locais)

- Redirect 308 do host `www` para o domínio canônico adicionado em `next.config.mjs`, preservando caminho e query. A CDN da Hostinger precisa encaminhar o host à aplicação para essa regra atuar; verificar no domínio após publicação. A CSP completa já estava configurada na aplicação, mas a CDN pública a substitui por `upgrade-insecure-requests`; sem acesso ao hPanel autenticado não foi possível corrigir a regra de borda. Não adicionar uma segunda CSP sem entender a precedência/interseção. O MCP configurado em `.omp/mcp.json` respondeu HTTP 401 a `initialize` sem OAuth; alertas particulares do painel não puderam ser lidos.
- Imóvel Saudosa Praça Onze: no componente de localização, links com a coordenada incorreta `+22.89721,-43.20472` do stand Via Binário 778 são corrigidos para `-22.89721,-43.20472`. A coordenada foi corroborada por outro imóvel da Cury no mesmo endereço e por outros documentos publicados; o geoponto do empreendimento permanece inalterado. Normalização da fonte também corrige ambos os links para impedir reimportação do erro. O documento existente no Sanity continua com o valor antigo até edição autorizada no CMS; o site corrige a apresentação.
- `/obrigado` agora exige recibo assinado de curta duração emitido após gravação do draft; URL direta não afirma recebimento. Navegação do formulário não inclui nome de imóvel nem link WhatsApp na query. Não houve envio de lead real.
- `npm audit --omit=dev` inicial apontou 17 vulnerabilidades, inclusive Next 16.3.2 crítico; atualizados Next 16.3.7, Sanity 6.17.0, Vision 6.17.0 e dependências transitivas vulneráveis sem downgrade de major. Após `npm ci`, typecheck, ESLint e build Next 16.3.7 passaram; `npm audit --omit=dev --audit-level=moderate` encontrou zero vulnerabilidades. O npm não equivale aos alertas privados do hPanel; solicitar captura ou acesso OAuth se divergirem.
- Smoke Next em produção local: host `www` respondeu 308 com query preservada; apex 200 sem loop e CSP completa; `/obrigado` sem recibo ou com recibo adulterado mostrou mensagem neutra, e recibo assinado sintético mostrou confirmação; imóvel Saudosa 200 com links corrigidos e região inexistente 404. A emissão real de `Set-Cookie` após gravação Sanity não foi exercitada para não enviar contato real. Inspeção visual local em Chromium abriu `/obrigado` e o imóvel. O Lighthouse anterior mede a versão pública pré-correção; não extrapolar melhoria de desempenho destas mudanças sem nova medição.
