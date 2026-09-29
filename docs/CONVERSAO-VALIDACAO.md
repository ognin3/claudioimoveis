# Conversão — contrato e validação

## Fluxos implementados

- Consentimento de contato obrigatório no formulário; marketing opcional, separado e desmarcado sem escolha anterior. A recusa não bloqueia o cadastro, notificação ou link WhatsApp.
- Preferências globais pelo componente MetaPixel já montado no layout. Escolha versionada `claudio-marketing-v1` em localStorage, compartilhada entre formulários/abas; sem armazenamento, recusa segura. Atribuição consentida em sessionStorage, escopo da sessão.
- Pixel só carrega com autorização e ID configurado. Sem noscript automático. `autoConfig` desativado. Recusa revoga eventos e remove atribuição/cookies Meta acessíveis no domínio; não desfaz transmissões anteriores. Um script já carregado não pode ser descarregado, por isso a revogação usa a API de consentimento e os helpers também verificam a escolha.
- Pixel/PageView/Lead permitem UTMs/fbclid aprovados; suprimem query desconhecida/inválida/duplicada, hash, referrer inseguro ou rota fora da allowlist. Referência segura: vazia, mesma origem com rota/parâmetros aprovados, ou raiz HTTPS sem query/hash de domínios de anúncio allowlisted (Meta/Google/Bing). Referências externas com caminho ou query permanecem bloqueadas. CAPI autorizada mede cadastro com URL limpa. Não se modifica a barra de endereço para contornar o limite.
- CAPI só após gravação privada e autorização `granted-v1` enviada no formulário. Leitura de cookies publicitários só nesse ramo; helper CAPI também exige autorização. Sem configuração, não há envio. Consentimento no POST é uma declaração do navegador, não autenticação nem prova jurídica de consentimento.
- Draft privado registra objeto `marketing` com autorizado (inclusive false), versão `v1` e registradoEm. Trata-se da escolha declarada no envio, não histórico de todas as escolhas. Nenhum registro existente ou CMS remoto foi mutado.
- Mesmo `eventId` do draft é devolvido ao navegador e usado em `event_id`/`eventID`: deduplicação preservada quando ambos os canais são possíveis. Lead não significa pessoa qualificada.
- PageView aguarda a leitura inicial da escolha e guarda a última URL rastreada: reexecução do efeito e autorização repetida na mesma URL não reenviam o evento. Mudança de página rastreia a nova URL aprovada.
- Proteções existentes de IP/HMAC, honeypot, timestamp, validação do imóvel, drafts e notificação foram mantidas. Integrações pós-cadastro não desfazem gravação; sucesso do formulário não prova entrega de e-mail, WhatsApp ou recepção pela Meta.

## Atribuição sem dados pessoais

Captura global nas navegações, não apenas montagem do formulário, e releitura no submit. Nova campanha substitui o conjunto inteiro para não misturar campos antigos. Sem parâmetro novo, usa o último conjunto consentido da sessão. Não recupera histórico anterior à autorização se ele já saiu da URL.

- `utm_source`: meta/facebook/instagram/fb/ig/google/bing.
- `utm_medium`: paid_social/paid_search/cpc/social.
- `utm_campaign` e `utm_content`: IDs numéricos de 5 a 30 dígitos explicitamente aprovados nas listas públicas `NEXT_PUBLIC_ATTRIBUTION_CAMPAIGN_IDS` e `NEXT_PUBLIC_ATTRIBUTION_CREATIVE_IDS` (separados por vírgula). Formato numérico sozinho não comprova ausência de PII: CPF/telefone não aprovado é descartado. Nunca inserir dados pessoais nessas listas. Vazias por padrão: campos são descartados e Pixel não carrega em landing que os contenha até configuração autorizada. Meta: `{{campaign.id}}`/`{{ad.id}}`; Google Ads: `{campaignid}`/`{creative}`. Macros precisam expandir para IDs previamente aprovados; placeholder literal é descartado. Mudanças de env pública precisam de nova integração/build pelo responsável.
- `utm_term`: descartado. `fbclid`: formato opaco limitado; não sintetiza cookie `_fbc`.
- URL persistida/notificada/CAPI: mesma origem configurada, apenas rota pública conhecida, sem query/hash/credenciais. Origem inválida ou rota desconhecida cai na raiz. Cookies fbp/fbc têm formato limitado antes da transmissão.
- GA4 não adicionado; nenhum ID/acesso disponível no escopo. Não colocar nome, telefone, e-mail, unidade ou formulário em URLs/UTMs/IDs de campanha.

## Critérios que não se confundem

1. **Clique:** abertura do formulário/WhatsApp ou navegação. Não comprova mensagem enviada nem lead recebido. Atalhos WhatsApp existentes fora do formulário continuam fora da captura.
2. **Cadastro recebido pela aplicação:** gravação bem-sucedida do draft privado no Sanity, evidenciada por consulta autenticada em ambiente autorizado. Apenas então a action responde sucesso. Este trabalho não verificou recepção real.
3. **Recebido pelo corretor:** confirmação independente de acesso ao cadastro/notificação ou mensagem efetivamente recebida no WhatsApp. Não inferir a partir do redirecionamento ou status HTTP do provedor.
4. **Qualificado:** avaliação humana, com retorno do interessado e adequação a imóvel/região/financiamento/disponibilidade. Não converter automaticamente status `novo` em qualificado, nem considerar evento Meta prova de qualificação.

## Verificações executadas nesta alteração

Smoke isolado com Node e transpileModule do TypeScript, usando dependências substituídas em memória e contatos estritamente sintéticos, sem rede e sem arquivos de teste permanentes:

- Action recusada: sucesso e draft em memória, zero CAPI e zero leituras de cookies publicitários; atribuição ausente.
- Action autorizada: sucesso e integração em memória, mesmo eventId da resposta; URL query removida.
- Sanitização anterior à revisão de allowlists: origem externa na raiz, e-mail sintético em query/campanha descartado e utm_term descartado. A aceitação numérica exercitada naquele smoke não é o contrato final; agora exige aprovação explícita nas envs públicas.
- Render isolado do componente e efeitos: recusa não cria script; query contendo e-mail sintético não cria script; consentimento com URL limpa cria um script e um PageView na fila.

Não executados: build/lint/suíte/formatter, browser real, integração real Sanity/Resend/Meta, lead real, campanha ou gasto. Smoke isolado não comprova visual no browser nem entrega externa. Orquestrador valida integração após todos os agentes.

Revisões posteriores solicitadas pelo orquestrador: fontes Google/Bing, UTMs aprovados no gate Pixel, registro de marketing no schema/draft, metadata própria, espera de leitura inicial/guarda da última URL para PageView e allowlists públicas explícitas de IDs. Nenhum check adicional executado nessas revisões, por orientação de não executar checks mid-flight; validação do contrato final fica com o orquestrador.

- Escolha de marketing em runtime isolado: autorização/recusa persistidas, atribuição removida, comando revoke e notificações de mudança observados.
## Matriz para validação integrada autorizada

- Navegador limpo: preferências visíveis, nenhum request Meta antes de escolha, checkbox de marketing desmarcado.
- Recusar, preencher contato sintético em ambiente isolado: mesma conclusão funcional; sem Pixel/CAPI/atribuição.
- Autorizar, navegar entre páginas sem formulário: UTMs consentidas retidas; campanha nova incompleta não herda campos antigos.
- Recarregar e abrir outra aba: escolha persistida. Revogar: checkbox sincronizado, eventos novos suprimidos e atribuição/cookies locais removidos.
- UTMs/fbclid e referência aprovados: Pixel permitido com consentimento; query desconhecida/inválida/duplicada/hash/referrer inseguro/rota inválida: nenhuma transmissão Pixel. Action/CAPI somente URL limpa. Não testar com PII real.
- Sucesso/falha Sanity: sem evento Lead antes da gravação; falha não apresenta sucesso. Configurar integrações apenas em ambiente autorizado, nunca ativar verba para validar código.
- Escolha granted armazenada + recarga/Strict Mode: apenas um PageView para a URL. Recusar/autorizar repetidamente sem navegar não reenviar PageView. Navegar para URL aprovada nova gera um evento.
- Allowlists vazias: CPF/telefone numérico em campaign/content descartado, Pixel bloqueado em landing contendo esses campos. Com IDs aprovados sintéticos no ambiente isolado: apenas esses IDs passam; número distinto não aprovado continua bloqueado.

## Limites e pré-requisitos externos

IDs públicos Sanity recuperados do CI; build/runtime local exercitados com catálogo real, sem tokens de escrita. Entrega real depende de credenciais/operadores configurados e validação autorizada. Política factual atualizada, mas base legal, retenção, atendimento de direitos e revisão jurídica precisam do responsável. Schema local recebeu campos readOnly marketing; nenhuma mutação CMS. CLAUDE/ARQUITETURA conciliados.

## Provas finais integradas — 29/09/2026

- Typecheck e ESLint exit0. Produção local Next iniciou e serviu páginas reais.
- Chromium mobile390×844 e desktop1440×1000: autorização refletida no checkbox, reload preserva escolha após hidratação, recusa sincronizada; sem overflow. Pixel ID ausente no teste real: zero scripts Meta; sem envio externo. Capturas geradas; inspeção estética de imagem indisponível ao modelo.
- SmokeConversaoFinal:17 grupos PASS (action final com Zod real/dependências em memória). Draft privado false/true + versão/data, mesmo eventID CAPI/resposta, URL sem query/hash; falha Sanity não retorna sucesso e não inicia CAPI/cookies. Helpers rejeitam CPF/telefone não aprovados, query desconhecida/duplicada/hash/referrer com query; allowlist explícita admite somente IDs sintéticos configurados. Prova reexecutável no artefato local://smoke-lead-final-proof.md.
- SmokePixelFinal: componente/módulos reais transpilados, fake hooks/browser sem rede. Stored granted + cleanup/setup StrictMode:1script/1PageView; grant repetido mantém1; navegar contato gera2; revogar/navegar mantém2 e Lead0. Query aprovada permite1; desconhecida com PII sintética gera0. Script temporário removido. Não equivale React DOM/SDK Meta remoto.
- Recepção Sanity/Resend/corretor, deduplicação Events Manager e GA4/GSC permanecem não verificadas. Clique/cadastro simulado não são contato recebido.
