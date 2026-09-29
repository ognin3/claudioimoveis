# Diagnóstico inicial — 29/09/2026

## Fatos reproduzidos pelo orquestrador

- Git inicial limpo, master em 7f63655. Divergência textual dos URLs resolvida: git ls-remote dos dois remotos retornou master/HEAD 7f63655fbab65967545b48ec14214424f43a15e7; scout observou redirecionamento ao ognin3/claudioimoveis. Fonte efetiva hPanel continua desconhecida. Nenhum push.
- Next 16.3.2/React 19.2.8 instalados. `npm run build`: compilação e etapa TypeScript concluídas; coleta falhou por NEXT_PUBLIC_SANITY_PROJECT_ID ausente. Isso é erro local reproduzido, não prova da causa em produção.
- URL pública antiga README, https://claudioimoveis2.vercel.app, aberta no Chromium 390×844: 404 DEPLOYMENT_NOT_FOUND. Não é domínio Hostinger confirmado. Captura realizada; sem prova visual de UI funcional.
- Tentativa de conectar hPanel via relay do navegador expirou; nenhum painel autenticado observado. Nenhum host SSH configurado.
- Não há language server configurado neste projeto (xd://lsp status); inteligência por LSP indisponível.

## Achados estáticos delegados (exigem smoke após correção)

- Sanity serve catálogo público e drafts privados para leads; Server Action grava antes de CAPI/Resend e encaminhamento WhatsApp.
- Achados baseline de consentimento, privacidade e atribuição foram corrigidos; verificação final consta abaixo. Nenhum GA4/GTM ou configuração privada externa recuperado.
- Identificadores públicos Sanity recuperados de .github/workflows/ci.yml e usados em .env.local com URL localhost, sem tokens. Catálogo real acessível; nenhuma consulta a leads/drafts ou mutação CMS.

## Prioridades e dependências

| Prioridade | Problema | Ação e validação |
| --- | --- | --- |
| P0 | Usuário relata produção quebrada; domínio e deployment desconhecidos | Confirmar hPanel/domínio/logs; reproduzir URLs reais antes de atribuir causa |
| P0 local resolvido | Build sem config Sanity | IDs públicos CI recuperados; produção local iniciou e serviu páginas reais. Isso não comprova build Hostinger |
| P0 | Recepção de contato não verificada | Testar gravação privada, encaminhamento e recebimento com responsável após acesso e autorização de teste |
| P1 | Consentimento/privacidade incompatíveis com rastreio existente | Gate Pixel/CAPI opcional sem bloquear contato; cenário aceitar/recusar; dedup eventID |
| P1 | Canonical/domínio e sitemap dependem ambiente/estoque | Validar HTML/URLs HTTP; corrigir apenas inconsistências observadas |
| P1 | Medição sem propriedades/configuração verificadas | Acessos GSC/GA4/Meta; diferenciar clique/lead recebido/qualificado; não chamar clique de venda |
| P2 | Expansão local/conteúdo | Mapa regional baseado estoque; páginas próprias apenas com conteúdo útil |

## Ordem de execução

1. Configuração OMP e agentes locais, leituras críticas e baseline — realizadas.
2. Inspeção aplicação/SEO e recuperação de configuração; em paralelo patch consentimento e rascunhos SEO local/mídia com arquivos exclusivos.
3. Integrar patches, build/typecheck/lint únicos após edição; smoke runtime desktop/mobile/rota direta/404/SEO/consentimento.
4. Com domínio/acessos: teste de formulário recebido e eventos externos; registrar métricas laboratório separadas de campo.
5. Apresentar alteração revisável + reversão; publicação somente autorizada e fonte confirmada; repetir smoke real.

Campanhas não exigem ranking orgânico para iniciar. Exigem landing funcional, estoque/canais confirmados, consentimento e conversões confiáveis, resposta comercial, geografia e orçamento aprovados. Nenhum gasto será ativado.

## Prova integrada após patches

- `npm run typecheck && npm run lint`: exit code 0, sem diagnósticos.
- `npm run build` executado com configuração pública; artefatos BUILD_ID, prerender-manifest e required-server-files gerados. A ferramenta truncou a saída, por isso não registrar contagem de rotas/tempo de build. `npm run start` pronto na porta 3000; servidor encerrado após smoke.
- Chromium 390×844: home, catálogo, sobre, contato, privacidade, obrigado, Porto Maravilha e Saudosa Praça Onze servidos; canonicals próprios observados. Rota inexistente HTTP404/noindex. Nenhum overflow horizontal nas nove superfícies inspecionadas.
- robots HTTP200 bloqueia /studio e libera obrigado; sitemap HTTP200 com59 URLs, sem privacidade, datas CMS de agosto (não geração); imagem OG institucional HTTP200 image/png.
- Preferência real autorizar: localStorage granted e checkbox true; reload preservou após hidratação; recusar: denied e checkbox false. Desktop1440×1000 sem overflow. Capturas mobile/desktop realizadas; modelo sem capacidade de inspeção da imagem, não afirmar revisão estética visual.
- Pixel ID não configurado neste runtime; zero scripts Meta observado. Sem tráfego/lead real. Action/helpers finais exercitados pelo agente SmokeConversaoFinal:17 grupos PASS com dependências em memória; denied não lê cookies/envia CAPI, granted compartilha eventID, falha CMS não sinaliza sucesso. Não prova recepção externa.
- Não foram medidos Lighthouse/CWV de campo, ranking, impressões, contatos qualificados ou vendas. Sem publicação/campanha/gasto.
