# SEO local e campanhas — rascunhos para aprovação

Pesquisa documental em 29/09/2026. **Nada neste documento autoriza ativar campanhas, gastar, publicar páginas, alterar estoque ou contatar terceiros.** Único arquivo desta tarefa: `docs/SEO-LOCAL-CAMPANHAS.md`. Sem dependências novas, serviços, alterações Next.js ou dados pessoais de leads.

## 1. Base factual e limites

Fontes internas: [CLAUDE.md](../CLAUDE.md), [seleção do corretor](SELECAO-CORRETOR.md), [material novo](MATERIAL-NOVO.md); descoberta de rotas e queries pelo scout `ConversaoLocal`, seguida de leitura do seed regional. `AGENTS.md` foi lido. Nenhum código Next.js foi editado; os guias instalados só serão pré-requisito de uma implementação futura.

- A seleção de 28/07/2026 tem **39 empreendimentos Cury**, não 39 unidades disponíveis: 17 na Zona Portuária, dos quais 11 Porto Maravilha; 23 em obras, 8 lançamentos e 8 prontos naquela fotografia histórica. O campo `sold` do scrape **não determina disponibilidade**.
- Material posterior acrescenta Conceito Califórnia (JV) e Conquista Parque Iguaçu (Direcional), ambos em Nova Iguaçu. O book do primeiro tem data indefinida; o do segundo contém nota de revisão interna. Não transformar book em comprovação de estoque atual.
- Preço nunca público: **“Consulte condições”** substitui sugestões antigas de preço nos documentos. Não divulgar tabelas internas, parcelas, entrada, subsídios, renda mínima, isenções ou promessa de crédito sem validação; mesmo depois de validado, manter a proibição de preço público do contrato.
- O scout confirmou `/`, `/imoveis`, `/imoveis/[regiao]`, `/imovel/[slug]`, `/sobre`, `/contato`, `/privacidade`, `/obrigado`. Regiões e imóveis efetivamente servidos dependem do Sanity; scripts/rotas existentes não provam uma landing publicada e utilizável hoje.
- Seed confirma `porto-maravilha`, `santo-cristo`, `centro-rio`, `sao-cristovao`, `imperial-sao-cristovao`, `nova-iguacu`. **Centro do Rio não é Centro de Niterói.** Duas regiões de São Cristóvão precisam de conferência dos imóveis/limites antes de decidir a URL principal; não duplicar textos para capturar a mesma busca.
- Falha baseline informada pelo orquestrador: `NEXT_PUBLIC_SANITY_PROJECT_ID` ausente. Não foi repetida. Não foi consultado CMS remoto nem comprovado catálogo público atual.

**Hipóteses, não métricas:** intenção de compra tende a ser mais explícita nas buscas por apartamento + bairro, na planta + bairro e nome de empreendimento. Mobilidade, plantas e estágio de obra são temas de diferenciação sugeridos pela oferta concorrente. Não há volumes, CPC, CPA, ROAS, posição SERP, ranking de concorrentes ou previsão de leads medidos nesta pesquisa.

## 2. Concorrência e fontes regionais

Amostra qualitativa, não inventário completo nem ranking. Construtoras que integram o portfólio podem também concorrer diretamente pela mesma busca. Não afirmar representação exclusiva, parceria ou disponibilidade por causa de uma notícia. Não usar marcas concorrentes em anúncios neste rascunho.

| Praça | Oferta/disputa observada e fonte | Leitura para conteúdo (hipótese) | Limite de evidência |
| --- | --- | --- | --- |
| Porto Maravilha | [Tempo Real RJ, 18/01/2026](https://temporealrj.com/porto-moradia-finalmente-a-zona-portuaria-do-rio-ganha-ares-de-bairro-residencial-em-2026/) aborda ocupação residencial e Cury; a seleção interna reúne diversos produtos Cury no eixo portuário. | Competição entre atendimento direto da construtora e corretores por lançamento, obra e moradia urbana. Diferenciar pela comparação verificável de plantas/estágio, não por “valorização garantida”. | Fonte jornalística e seleção histórica; não prova unidades atuais, participação de mercado ou qualidade do entorno. |
| Centro do Rio | [Diário do Rio, 11/08/2026](https://diariodorio.com/apos-esgotar-mais-de-400-apartamentos-em-menos-de-12-horas-residencial-no-centro-do-rio-vai-abrir-nova-fase-de-vendas/index.html) descreve Connect Square/Patrimar, plantas variadas, mobilidade e rooftop. | Busca pode comparar retrofit, lançamento e acesso ao trabalho. Explicar o produto próprio com documentação, sem copiar diferenciais da Patrimar. | Relato de venda atribuído à empresa; não reproduzir escassez, preços ou vendas como oferta própria. |
| São Cristóvão | [BRJ Imóveis, 22/07/2026](https://www.brjimoveis.com.br/noticias/378-mirante-boa-vista-chega-a-sao-cristovao-com-441-apartamentos-e-aposta-na-valorizacao-do-eixo-porto-maravilha.html) apresenta Mirante Boa Vista/Tenda, localização, plantas e lazer, com ressalvas comerciais. O portal usa notícia detalhada e CTA WhatsApp. | Concorrência de Tenda e BRJ por produto econômico/localização. Conteúdo útil: planta real, memorial e transporte sem tempos inventados. | Portal comercial concorrente, não confirmação direta da Tenda; não importar condições ou ficha para o catálogo próprio. |
| Nova Iguaçu | [BRJ Imóveis, 26/07/2026](https://www.brjimoveis.com.br/noticias/389-uniq:-direcional-lanca-condominio-clube-com-543-apartamentos-proximo-a-unig--em-nova-iguacu.html) descreve UNIQ/Direcional e condomínio-clube. Material interno documenta Conceito Califórnia/JV e Conquista Parque Iguaçu. | Concorrência por lançamento, quartos, varanda e lazer; separar campanha Baixada do eixo Porto/Centro e adequar a conversa ao produto. | **Conflito:** matéria BRJ atribui à apresentação Direcional Conquista Parque Iguaçu 100% vendido. Isso não autoriza mudar CMS; bloqueia anúncio específico até confirmação comercial atual. UNIQ não passa a integrar portfólio por aparecer nesta pesquisa. |

Buscas por páginas primárias das construtoras retornaram resultados insuficientes e alguns provedores falharam/bloquearam. Por isso notícias comerciais/jornalísticas estão identificadas como fontes secundárias, e não tratadas como confirmação oficial de estoque. Não houve contato externo. A intenção abaixo é proposta editorial baseada na linguagem das ofertas e nos documentos, não volume observado.

## 3. Mapa busca → intenção → página → CTA

**P0:** pré-requisito antes de mídia. **P1:** primeira seleção editorial/comercial após estoque confirmado. **P2:** aprofundamento condicionado a dados e demanda observada. Existente = rota no código, não página remota validada. Todo CTA comercial principal passa por **formulário curto → persistência confirmada → WhatsApp**, conforme contrato. Se a região não tiver formulário regional, escolher imóvel publicado com formulário; não inventar captura que a página não possui.

| Busca candidata | Intenção | Página existente / proposta | Prioridade | Dados necessários antes de usar | CTA |
| --- | --- | --- | --- | --- | --- |
| apartamentos Porto Maravilha; apartamento na planta Porto Maravilha | Compra regional / comparar lançamentos | Existente `/imoveis/porto-maravilha`; links para imóveis publicados; enriquecer a mesma landing, não criar doorway | P1 | Estoque datado, bairros corretos, estágio, plantas, material autorizado, incorporação | “Conheça as opções” → imóvel → “Consultar condições” |
| apartamento Santo Cristo Porto Maravilha | Compra em recorte específico | Existente `/imoveis/santo-cristo` quando houver produto; ligação contextual com Porto, sem texto duplicado | P2 | Endereço do imóvel confirmado e limite editorial Porto/Santo Cristo | “Ver empreendimento” → formulário |
| apartamento Centro Rio de Janeiro; lançamento Centro RJ | Compra urbana | Existente `/imoveis/centro-rio`; não usar `/imoveis/centro-niteroi` | P1 | Imóveis corretamente classificados, tipologias, estágio e fontes locais | “Comparar opções no Centro” → detalhe → formulário |
| apartamento São Cristóvão RJ; lançamento São Cristóvão | Compra local | Existem `/imoveis/sao-cristovao` e `/imoveis/imperial-sao-cristovao`; escolher destino pelo estoque real e corrigir sobreposição editorial antes de anunciar | P1 | Vínculos regionais CMS, escopo dos dois agrupamentos, canonical/links auditados | “Conhecer plantas” → imóvel → formulário |
| apartamento Nova Iguaçu; apartamento 2 quartos Nova Iguaçu | Compra / requisitos de planta | Existente `/imoveis/nova-iguacu`, apenas se oferta confirmada | P1 condicional | Publicação JV/Direcional, quartos disponíveis, book final, estágio e conflito de estoque resolvido | “Consultar opções em Nova Iguaçu” → detalhe → formulário |
| Conceito Califórnia Nova Iguaçu; Conquista Parque Iguaçu | Navegacional/comercial específico | Existente família `/imovel/[slug]`; slug deve ser copiado do CMS, não derivado do nome. Nenhuma URL individual aprovada nesta tarefa | P0 estoque / P1 campanha | URL pública, identificação, autorização, disponibilidade atual; Conquista bloqueado até resolver conflito | “Consultar condições” → formulário → WhatsApp |
| Minha Casa Minha Vida Porto Maravilha; MCMV Nova Iguaçu; FGTS apartamento RJ | Financiamento / elegibilidade + compra | Proposta: FAQ útil dentro da landing regional e do imóvel elegível; nenhuma página genérica nova | P2 | Enquadramento de cada produto e regras oficiais vigentes; revisão comercial | “Conversar sobre possibilidades” → formulário; sem “aprovação garantida” |
| morar no Porto Maravilha; morar no Centro RJ; transporte São Cristóvão | Informacional / avaliar bairro | Proposta: seção local original nas landings existentes, com fontes de operadores/prefeitura e data | P2 | Rotas/estações atuais, endereço real, método para distância; não prometer segurança ou minutos sem evidência | “Ver imóveis da região” → catálogo/detalhe |
| Cláudio Corretor imóveis RJ | Navegacional / confiança | Existentes `/sobre`, `/contato`, `/` | P2 | Identidade e credenciais aprovadas, canais confirmados; endereço comercial não fornecido | “Solicitar atendimento” → formulário |

### Conteúdo local e presença empresarial

Enriquecer páginas existentes com seleção real, fotos autorizadas, plantas legíveis, texto original, estágio datado, restrições de vaga/tipologia, registro da incorporação e “Imagens meramente ilustrativas”. Linkar região ↔ imóvel e distinguir município/bairro. Não criar páginas vazias para cada keyword nem FAQ idêntica em todas as regiões. Texto de seed que sugere acessibilidade de orçamento não comprova condições atuais.

Perfil da Empresa no Google: somente revisar/criar após confirmar elegibilidade de atendimento presencial, nome real, categoria, horários e área atendida. Não inventar endereço/loja, mapa, avaliações ou atendimento em todos os bairros. Se atuar como área de serviço e não receber clientes no endereço, observar as regras de ocultação de endereço. Fonte oficial: [diretrizes de representação](https://support.google.com/business/answer/3038177?hl=pt-BR). Esta tarefa não acessou nem criou perfil.

### Política recomendada para imóvel vendido, indisponível ou removido

1. **Sinal inconclusivo:** `sold` do scrape, book antigo ou notícia não alteram estoque. Solicitar confirmação datada do responsável; pausar publicidade específica enquanto o conflito persistir.
2. **Indisponibilidade temporária comprovada:** retirar oferta/CTA de venda, informar indisponibilidade e manter página útil somente se houver perspectiva real de retorno e conteúdo relevante. Oferecer alternativas reais da região, sem simular disponibilidade e sem coleta para aquele imóvel como se estivesse à venda.
3. **Vendido definitivamente, página ainda útil:** pode permanecer `200` como arquivo claramente marcado indisponível, com descrição histórica e links reais. Retirar anúncios e qualquer marcação de oferta disponível; excluir do sitemap comercial de estoque ativo. Indexação somente se o conteúdo histórico realmente servir ao usuário.
4. **Página removida sem substituto equivalente:** `404` ou `410` reais, remover sitemap e links internos; página de erro pode sugerir catálogo sem virar soft-404 `200`. Não redirecionar tudo para home/região só para reter tráfego.
5. **Mesma entidade movida de URL:** `301` para a URL nova correspondente, atualizar canonical, sitemap, links e anúncios. Produto diferente não é substituto equivalente automático.
6. Se região ficar sem estoque, pausar anúncios regionais e revisar indexação/links; não exibir catálogo falso. Retenção de uma página editorial local exige conteúdo útil próprio, não apenas lista vazia.

Referências oficiais: [erros soft 404 e HTTP](https://developers.google.com/search/docs/crawling-indexing/http-network-errors), [redirecionamentos](https://developers.google.com/search/docs/crawling-indexing/301-redirects). Política recomendada apenas; nenhuma alteração de status/CMS/rotas foi feita.

## 4. Google Ads — rascunho pausado

### Configuração comum

Objetivo: leads no site; rede de Pesquisa, sem expansão automática para Display, sem Performance Max na abertura. Português; campanhas separadas por praça para controle de gasto. Não comprar buscas de marcas concorrentes neste rascunho. Não ativar assets de ligação/mensagem que pulem a captura principal.

Geo proposto: campanha `G-PORTO-CENTRO-SC` no município do Rio de Janeiro; campanha `G-NOVA-IGUACU` em Nova Iguaçu. Expansão a outras cidades metropolitanas apenas após aprovação comercial e análise de origem agregada. Bairros são intenção das keywords, não promessa de segmentação exata disponível. Conferir o que a conta oferece na criação; a [documentação oficial atual de local avançado](https://support.google.com/google-ads/answer/1722038?hl=pt-BR) contém orientação de presença e também aviso de migração para presença ou interesse. **Não prometer controle “somente presença” se indisponível**; registrar configuração efetiva, excluir territórios fora do atendimento aprovado e revisar relatório geográfico. Localização não tem precisão garantida.

Lances: decisão final depende de teto, estimativas reais do Planejador e mensuração validada. Sem histórico confiável, preparar início controlado com limite de lance derivado de estimativas aprovadas; não inventar CPC/tCPA nem alegar que Maximizar conversões funcionará com eventos inexistentes. Migrar otimização para conversões somente com qualidade verificável. Datas de início/fim e fuso da conta são pendentes; rascunhos permanecem pausados.

| Grupo | Keywords exatas e de frase propostas | Landing |
| --- | --- | --- |
| Porto | `[apartamentos porto maravilha]`, `"apartamento porto maravilha"`, `"apartamento na planta porto maravilha"` | `/imoveis/porto-maravilha` validada; produto com formulário na sequência |
| Centro | `[apartamento centro rio de janeiro]`, `"apartamentos centro rj"`, `"lançamento centro rio de janeiro"` | `/imoveis/centro-rio` validada |
| São Cristóvão | `[apartamento são cristóvão rj]`, `"apartamentos são cristóvão rio"`, `"lançamento são cristóvão rj"` | Regional escolhida após conferir duplicidade; não dois grupos para mesma intenção |
| Nova Iguaçu | `[apartamento nova iguaçu]`, `"apartamento 2 quartos nova iguaçu"`, `"lançamento nova iguaçu"` | `/imoveis/nova-iguacu` validada |
| Produto autorizado | Nome exato + cidade, somente após slug/estoque confirmados | URL CMS do produto; Conquista Parque Iguaçu bloqueado |

Não iniciar correspondência ampla. Adicionar buscas de MCMV/FGTS somente quando elegibilidade do destino estiver confirmada. Revisar variantes próximas e termos reais após liberação.

**Negativas iniciais (oferta de compra residencial):** aluguel, alugar, temporada, diária, hotel, hostel, emprego, vagas de emprego, currículo, concurso, curso de corretor, sala comercial, galpão, terreno. Usar frase/exata conforme contexto; adicionar também variantes plural/acento relevantes porque negativas não cobrem tudo automaticamente. Não negativar `planta`, `FGTS`, `simulação`, `financiamento` ou `Minha Casa Minha Vida` indiscriminadamente. `vaga` isolada excluiria quem procura garagem. Para Centro Rio, negativar frases “centro de niterói” e “centro de nova iguaçu” no grupo pertinente, não na conta inteira. Produto comprovadamente não ofertado entra como negativa específica, não filtro baseado no `sold`.

### Anúncios responsivos — textos completos para os quatro grupos

Títulos compartilhados: `Cláudio Corretor`; `Conheça os Empreendimentos`; `Consulte Condições`; `Compare as Opções`; `Atendimento com Corretor`; `Solicite Mais Informações`.

| Grupo | Títulos locais adicionais (máx. 30 caracteres) | Descrições (máx. 90 caracteres) |
| --- | --- | --- |
| Porto | `Apartamentos Porto Maravilha`; `Opções no Porto Maravilha` | `Conheça empreendimentos no Porto Maravilha. Consulte condições com o corretor.` / `Veja as informações dos imóveis. Preencha o formulário para solicitar atendimento.` |
| Centro | `Apartamentos no Centro RJ`; `Conheça Opções no Centro` | `Conheça empreendimentos no Centro do Rio. Consulte condições com o corretor.` / `Compare informações e plantas. Preencha o formulário para solicitar atendimento.` |
| São Cristóvão | `Apartamentos São Cristóvão`; `Conheça Opções na Região` | `Conheça empreendimentos em São Cristóvão, no Rio. Consulte condições com o corretor.` / `Veja as informações dos imóveis. Preencha o formulário para solicitar atendimento.` |
| Nova Iguaçu | `Apartamentos Nova Iguaçu`; `Conheça Opções na Baixada` | `Conheça empreendimentos em Nova Iguaçu. Consulte condições com o corretor.` / `Compare informações e plantas. Preencha o formulário para solicitar atendimento.` |

Textos são condicionados à presença de oferta e, onde citado, plantas no destino. Sem preço, “últimas unidades”, prazos de entrega inventados, valorização, crédito garantido ou identidade de construtora como se fosse o anunciante. Paths de exibição sugeridos: `imoveis/porto`, `imoveis/centro-rio`, `imoveis/sao-cristovao`, `imoveis/nova-iguacu`. URLs finais absolutas dependem do domínio canônico aprovado.

Sitelinks em rascunho: `Conheça o Corretor` → `/sobre`; `Ver Empreendimentos` → `/imoveis`; `Solicitar Atendimento` → `/contato`, somente se houver captura funcional. Não usar link direto WhatsApp como sitelink principal.

## 5. Meta Ads — rascunho pausado

Campanha proposta `M-LEADS-SITE`, objetivo Leads, local de conversão site e evento primário confirmado de lead persistido. Não escolher tráfego como se clique fosse lead. Não criar formulário instantâneo nem campanha WhatsApp direta nesta abertura: quebraria o fluxo principal estabelecido. Pixel/CAPI só após consentimento aplicável e validação; se indisponíveis, campanha permanece pausada.

Conjuntos: `M-PORTO` e `M-CENTRO-SC` para município Rio; `M-NOVA-IGUACU` para Nova Iguaçu. Se verba não comportar separação, começar com uma praça aprovada e não pulverizar conjuntos. Público geográfico amplo, sem discriminação por gênero, estado civil, parentalidade, raça, religião, deficiência ou vulnerabilidade financeira. Não inferir renda por bairro nem usar listas de leads pessoais. Não afirmar que recorte de bairro/raio ou controle de residência estará disponível: registrar opções efetivas da conta.

Posicionamentos sugeridos: Facebook/Instagram Feed, Stories e Reels; adaptar imagens aprovadas para 4:5 e 9:16, sem cortes de texto legal. Não usar drones sem empreendimento identificado. Criativo: foto/render autorizado ou planta do próprio imóvel, identificando perspectiva/decorado e “Imagens meramente ilustrativas”; identificação profissional aprovada no criativo e destino. Não reaproveitar criativo do concorrente.

| Rascunho | Texto principal | Título | Descrição / botão | Landing |
| --- | --- | --- | --- | --- |
| Porto | `Conheça empreendimentos no Porto Maravilha e compare as informações de cada opção. Consulte condições com Cláudio Corretor. Preencha o formulário para solicitar atendimento.` | `Opções no Porto Maravilha` | `Consulte condições` / `Saiba mais` | `/imoveis/porto-maravilha` validada |
| Centro | `Conheça empreendimentos no Centro do Rio e veja as informações disponíveis sobre cada imóvel. Solicite atendimento com Cláudio Corretor pelo formulário do site.` | `Conheça Opções no Centro` | `Consulte condições` / `Saiba mais` | `/imoveis/centro-rio` validada |
| São Cristóvão | `Conheça empreendimentos em São Cristóvão, no Rio de Janeiro. Compare as opções e solicite atendimento com Cláudio Corretor pelo formulário do site.` | `Opções em São Cristóvão` | `Consulte condições` / `Saiba mais` | Regional selecionada após conferência |
| Nova Iguaçu | `Conheça empreendimentos em Nova Iguaçu e compare as informações de cada opção. Consulte condições com Cláudio Corretor pelo formulário do site.` | `Opções em Nova Iguaçu` | `Consulte condições` / `Saiba mais` | `/imoveis/nova-iguacu` validada |

Variante de produto: somente com URL, material e disponibilidade aprovados; mostrar o nome real do produto e suas características comprovadas. Não usar “você tem renda baixa?”, “negativado?”, “sua família precisa”, “aprovado sem análise” ou retorno garantido. Remarketing é etapa condicionada a consentimento, política de retenção e elegibilidade; não há audiência/lista criada neste trabalho.

## 6. Conversões, privacidade e qualificação

Especificação recomendada, **não alegação de implementação atual**:

- **Primária Google/Meta:** lead válido, consentimento aplicável e gravação privada bem-sucedida. Disparar uma vez por confirmação; não por clique Enviar, abertura de WhatsApp ou simples carregamento de `/obrigado`. Meta Pixel/CAPI compartilham `eventID` opaco para deduplicação; Google deve evitar dupla contagem por imports/tags do mesmo resultado. Configurar contagem de lead uma por interação e registrar a janela de atribuição efetiva aprovada.
- **Secundárias, sem otimização primária:** visualização de detalhe, início do formulário e clique WhatsApp após captura. Clique não comprova conversa, visita ou venda. Sessões/eventos de teste devem ficar fora dos relatórios comerciais.
- Qualificação e venda são indicadores internos distintos. Importação offline de lead qualificado só em etapa autorizada, com base legal, processo privado e teste de deduplicação; não presumir integração existente nem promover hash a dado anônimo.
- Contrato de atribuição atualizado comunicado pelo integrador `CorrigeConversao` após revisão Main: UTMs somente com marketing autorizado; `utm_source` aceita `meta/facebook/instagram/fb/ig/google/bing`, `utm_medium` aceita `paid_social/cpc/social/paid_search`, `utm_campaign` e `utm_content` exigem IDs numéricos de 5–30 dígitos **e presença em listas explícitas de IDs publicitários aprovados**: `NEXT_PUBLIC_ATTRIBUTION_CAMPAIGN_IDS` e `NEXT_PUBLIC_ATTRIBUTION_CREATIVE_IDS`, separadas por vírgula e vazias por padrão. Regex numérica sozinha não protege contra CPF/telefone; nunca cadastrar dados pessoais nessas listas públicas. Sem aprovação, esses campos não persistem e a landing com esses parâmetros não habilita Pixel. `utm_term` é descartado. Template Meta: `utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_content={{ad.id}}`. Template Google: `utm_source=google&utm_medium=paid_search&utm_campaign={campaignid}&utm_content={creative}`. Conferir que as macros expandem para IDs reais previamente aprovados nas respectivas listas antes de ativação; a macro em si não é valor admitido. Nomes internos como Porto/Nova Iguaçu pertencem ao mapa privado campanha→praça, não às UTMs. Nunca colocar nome, telefone, e-mail, renda, CPF ou texto livre em URL, evento, log, screenshot ou dashboard.
- Ainda segundo o integrador, query/hash nunca seguem para Meta. Pixel permite query composta somente por UTMs/fbclid aprovados e bloqueia parâmetros desconhecidos, duplicados ou inválidos, hash e referrer; CAPI recebe URL limpa somente pós-gravação/autorização. Não retirar proteção para ganhar atribuição. A escolha de marketing passa a ter versão/data registrada no draft e schema autorizado. Comportamento comunicado, não exercitado nesta tarefa; exigir smoke integrado, deduplicação e relatório agregado sem PII antes de verba.
- Nesta proposta, medição externa recebe somente evento e dimensões comerciais não pessoais. Não habilitar correspondência avançada/Enhanced Conversions nem enviar hashes de contato por padrão; eventual uso exige autorização e revisão específica. Formulário e dados de qualificação ficam em armazenamento privado; consentimento de atendimento não é automaticamente consentimento para publicidade.
- Recusa de rastreio não impede atendimento. Não instalar serviço/tag durante esta tarefa. Consentimento, política de privacidade, acesso, retenção e exclusão precisam de revisão do responsável antes de verba.

**Roteiro privado de atendimento (não formulário de anúncio com atributos financeiros):** confirmar região/produto, quartos necessários, objetivo moradia/investimento, estágio/prazo preferido e interesse em visita ou análise de condições. Se houver interesse em financiamento, orientar que a análise dependerá da instituição; documentos e informações financeiras somente no canal privado adequado, com necessidade e autorização, não no analytics.

Classificações operacionais: recebido → contato autorizado → interesse confirmado em oferta atual → atendimento/visita solicitada → proposta → venda confirmada. Duplicado, spam, sem retorno e interesse fora da oferta são estados separados; não contar como qualificado automaticamente. Não usar atributos protegidos para rejeitar compradores. Relatório agregado por praça/campanha: gasto, leads únicos, contatos efetivos, qualificados e visitas confirmadas; CPL = gasto/leads e custo por qualificado = gasto/qualificados, apenas quando denominador existir. Não prometer taxa ou custo alvo sem dados. Responsável e capacidade/horário de resposta pendentes; não inventar SLA.

## 7. Orçamento condicional e regras de decisão

Verba segue pendente conforme resposta do responsável; manter o foco regional documentado. **Solicitar ao responsável:** teto autorizado por período, teto diário compatível, duração do piloto, custo máximo aceitável por lead qualificado, margem/critério comercial, praças prioritárias e capacidade de atendimento. Sem resposta, orçamento aprovado é inexistente e todos os rascunhos ficam pausados.

Proposta de divisão, **não benchmark ou promessa**: 60% do teto aprovado para Google Pesquisa (intenção explícita), 40% para Meta (descoberta). Dentro de cada canal, ponto de partida sujeito ao estoque: 50% Porto, 30% Centro/São Cristóvão, 20% Nova Iguaçu. São percentuais de planejamento, não números medidos. Se Nova Iguaçu não passar no gate, não redistribuir automaticamente: solicitar aprovação de nova divisão mantendo o teto. Se estimativas reais mostrarem pulverização excessiva, usar uma praça e um canal escolhidos com o responsável em vez de tentar financiar todos.

O teto não equivale simplesmente a orçamento diário da interface: conferir regras de sobre-entrega/faturamento de cada plataforma, duração e mecanismo de pausa aprovado antes de gasto. Pausar oferta que perde disponibilidade, formulário que não persiste ou medição que duplica/vaza dados. Avaliar termos/geos e qualidade; só transferir verba com autorização dentro do teto. Não inventar CPC, CPA, mínimo de investimento, quantidade de leads ou prazo para atingir performance. Nenhuma cobrança/cartão/conta foi configurada.

## 8. Políticas oficiais e aplicação ao Brasil

Fontes consultadas diretamente em 29/09/2026, salvo links complementares explicitados. Não substituem revisão jurídica nem revisão da plataforma antes de publicação.

| Fonte oficial | Regra observada | Aplicação regional e decisão |
| --- | --- | --- |
| [Google: Housing in personalized advertising](https://support.google.com/adspolicy/answer/16701755?hl=en) | Restrições habitacionais descritas para EUA/Canadá: idade, gênero, parentalidade, estado civil e ZIP codes. | Não declarar que restrição específica norte-americana automaticamente é exigência brasileira. Manter desenho inclusivo e revisar políticas gerais/conta para Brasil. |
| [Google: Deturpação](https://support.google.com/adspolicy/answer/6020955?hl=pt-BR) | Proíbe alegações enganosas, afiliação falsa, ofertas indisponíveis e irrelevância entre anúncio/destino. | Aplicável às campanhas brasileiras. Identificar corretor, conferir oferta/destino, não prometer crédito/retorno nem apresentar-se como construtora. “Consulte condições” não permite ocultar informações materiais na proposta/contratação. |
| [Google: local avançado](https://support.google.com/google-ads/answer/1722038?hl=pt-BR) | Presença/interesse, exclusões e limitações/migração descritas; precisão não garantida. | Registrar opção real da conta e origem do tráfego; não afirmar geo perfeito nem exigir opção já migrada. |
| [Meta: Advertising Standards](https://transparency.meta.com/policies/ad-standards/) | Proíbe práticas discriminatórias/enganosas, revisa criativo, segmentação e landing. Texto exige identificação de Special Ad Category para anunciante EUA ou targeting EUA/Canadá/certas partes da Europa, conforme disponibilidade. | Não extrapolar que Brasil sempre exige, nem que nunca exigirá: verificar país do anunciante/conta, destino e opções no Ads Manager; se categoria Housing for exigida, selecionar e obedecer controles. Não contornar categoria nem usar exclusões discriminatórias. |
| [Meta: Privacy Violations and Personal Attributes](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/) | Proíbe sugerir conhecimento de atributos pessoais, vulnerabilidade financeira ou informações privadas. | Aplicação global, incluindo Brasil. Copy centrada no imóvel, sem pressupor renda, dívida, saúde, religião ou composição familiar do leitor. |

Links oficiais complementares para checklist de implementação, **sem verificação de configuração nesta tarefa**: [Google: dados pessoais na medição](https://support.google.com/analytics/answer/6366371?hl=pt-BR), [ANPD: cookies e proteção de dados](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes), [LGPD — texto legal](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm). Rever base legal e consentimento por finalidade; hashing não elimina obrigações LGPD. Publicidade imobiliária deve usar identificação profissional e registro da incorporação conforme contrato e revisão legal; este documento não reproduz contato pessoal nem valida registro em órgão externo.

## 9. Gate de liberação, entregáveis e evidência

Antes de qualquer ativação, o orquestrador/responsável precisa registrar:

1. Catálogo real acessível, credenciais/ambiente corretos sem expor segredos, domínio canônico e URLs finais validados; preservar correções Hostinger. Domínio e verificação Meta devem ser conferidos na conta atual, sem tratar notas antigas de Vercel como diagnóstico atual.
2. Lista datada de imóveis comercializáveis por praça, unidades/tipologias disponíveis quando necessário, material autorizado/final, incorporação e identificação aprovadas; resolver conflito Conquista Parque Iguaçu. Não deduzir estoque do seed ou `publicado` sozinho.
3. Decisão sobre as duas regiões de São Cristóvão, distinção Centro Rio/Niterói e landing sem catálogo vazio. Formulário → persistência → WhatsApp funcional, privacidade e consentimento revisados.
4. IDs reais de campanha/criativo previamente aprovados nas listas públicas de atribuição (vazias por padrão), sem PII; macros expandidas comprovadamente admitidas. Conversão primária real, deduplicação, recusa de rastreio e ausência de PII em payloads demonstradas em ambiente autorizado pelo integrador; aprovação de contas/políticas regionais e assets.
5. Teto/período/divisão de verba explicitamente autorizados, responsável por atendimento, capacidade e critérios de qualificação. Somente depois criar/configurar os rascunhos na conta mediante autorização; este arquivo contém rascunhos textuais, não campanhas salvas no Ads Manager.

**Entregue:** pesquisa regional com fontes e limitações; mapa intenção/página/prioridade/dados/CTA; política de vendido/removido; rascunhos Google e Meta com grupos, geo, keywords/negativas, copy, destino, mensuração e qualificação; orçamento proporcional condicionado; matriz de políticas e pendências de liberação.

**Verificações realmente realizadas:** leitura de `AGENTS.md`, `CLAUDE.md`, documentos de estoque e seed; consulta ao scout; pesquisas públicas e leitura direta das fontes regionais e políticas indicadas como consultadas; conferência pontual dos limites de caracteres da copy Google por script local. Não executados build, lint, testes, formatter, CMS remoto, publicação, contas de anúncios, contato externo ou medição em produção. Documento sem alteração comportamental de aplicação; validação integrada e smoke do funil cabem ao orquestrador.

**Bloqueios externos para ativação (não para o rascunho entregue):** ambiente/CMS e estoque atual não comprovados; conflito de disponibilidade; URLs individuais/domínio e material comercial final; consentimento/mensuração efetivos; aprovação de teto e atendimento. Nenhuma indisponibilidade foi mascarada com catálogo inventado.
