# Recuperação técnica — coordenação e registro

## Segurança e estado inicial — 29/09/2026

- OMP instalado: 18.4.2 (`omp --version`, `omp --help`). Runtime observado: Node 24.18.0, npm 11.16.0. O pacote do runtime observado pelo navegador é `@oh-my-pi/pi-coding-agent`.
- Documentação consultada: `omp://task-agent-discovery.md`; agentes locais suportados em `.omp/agents/*.md`, frontmatter `name`, `description`, `tools`, `spawns`. Descoberta refeita no despacho. Limite efetivo lido em `cfg://task`: 32 concorrentes, profundidade 2, isolamento desativado, nenhum agente desabilitado. Não alteramos configuração global ou modelos.
- Git inicial limpo em `master`, HEAD `7f63655fbab65967545b48ec14214424f43a15e7`. Origin: `renatin77/claudioimoveis2`; referência informada: `ognin3/claudioimoveis`. Sem push até confirmar hPanel/repo/branch/commit de produção.
- Preservados: `02e3a4e`, `42366e7`, `c025a49`, `7f63655` (compatibilidade Hostinger).
- Next 16.3.2 / React 19.2.8 confirmados por `npm ls`. Instruções: AGENTS.md fornecido pelo ambiente e CLAUDE.md lido. A hospedagem Vercel citada nas instruções é histórico, substituído pelo relato atual Hostinger.

## Coordenação real

Esta sessão atua como orquestrador. Definições persistidas exclusivamente no projeto:

| Agente | Responsabilidade | Dependências / conclusão |
| --- | --- | --- |
| claudio-orquestrador | prioridade, contexto, atribuição exclusiva de arquivos, integração e aprovação | relatórios; entrega integrada verificada |
| claudio-aplicacao | runtime, Sanity, rotas e deploy | diagnóstico, guias Next, ambiente; causa reproduzida e patch reversível |
| claudio-seo-tecnico | indexabilidade, metadata, sitemap, canonicals, schema | domínio e estoque; URLs e HTML coerentes |
| claudio-seo-local | intenção regional e conteúdo factual | região/estoque; mapa busca→página→CTA com fontes |
| claudio-conversao | contatos, eventos, consentimento e campanhas | acessos e orçamento; evidência sem duplicação, rascunhos sem ativação |
| claudio-qualidade | revisão read-only | alterações integradas; riscos e evidências |

A rodada inicial usa três scouts read-only: AplicacaoDeploy, SeoTecnico, ConversaoLocal. Agentes de implementação recebem arquivos exclusivos após a inspeção; nenhum arquivo será editado simultaneamente. Revisão central após integração; build/lint/typecheck e smoke executados pelo orquestrador, não durante as edições dos agentes. Uso do Agent Hub: Alt+A. O agente personalizado qualidade foi despachado para verificar as definições; a disponibilidade dos demais será declarada conforme execução, não apenas pela existência do arquivo.

Todo relatório deve separar: fatos observados, hipóteses, arquivos alterados, verificações executadas e bloqueios. Nenhuma conclusão de agente substitui o smoke integrado. Não publicar, enviar contato real ou ativar mídia sem aprovação apropriada.

## Briefing extraído (não equivale a confirmação atual de estoque)

- Atuação documentada: Rio de Janeiro, Baixada, Niterói, São Gonçalo; prioridade histórica: lançamentos/obras em Porto Maravilha, Centro, São Cristóvão. Compra/casa própria; MCMV e famílias. Não há base para campanhas de locação.
- Funil documentado: formulário curto → lead privado no Sanity → WhatsApp. Meta era o canal prioritário.
- Marca documentada: Cláudio Corretor; CRECI informado 103666. Não inserir endereço, avaliações ou credenciais adicionais.
- Preços públicos proibidos nas instruções: usar “Consulte condições”. Disponibilidade não pode vir do campo `sold` do scrape.
- Contato oficial deve ser validado contra o código e com recepção do responsável. E-mail permanece pendente de confirmação desde as instruções; não copiar dados pessoais para este registro.

## Registro de execução

1. Estado inicial e ferramentas identificados; três inspeções independentes iniciadas. Nenhuma mudança de aplicação ou publicação feita nesta etapa.
2. Criadas seis definições locais de agentes, preservando configurações existentes. Revisão de descoberta em execução.

## Métricas de linha de base

Sem acesso confirmado à propriedade Search Console/GA4/hPanel: tráfego, conversões, CWV de campo e commit publicado ainda não medidos. Resultados históricos em CLAUDE.md não serão apresentados como medições atuais. Resultados de laboratório serão registrados separadamente após execução.
