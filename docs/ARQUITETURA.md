# Arquitetura do Cláudio Corretor

Este documento explica como o projeto está dividido, como os dados circulam e onde cada
tipo de alteração deve ser feita. O objetivo é permitir manutenção segura sem precisar
redescobrir as decisões técnicas.

## 1. Visão geral

O site é uma aplicação Next.js com três responsabilidades principais:

1. Entregar páginas públicas rápidas para visitantes e campanhas.
2. Permitir que o corretor atualize imóveis pelo Sanity Studio.
3. Capturar o lead antes de encaminhar a conversa para o WhatsApp.

O App Router combina Server Components, páginas pré-renderizadas e pequenos componentes
client-side. O catálogo filtra um payload compacto no navegador; dados grandes da ficha do
imóvel só são carregados na rota dedicada.

## 2. Rotas

| Rota                | Papel                                              |
| ------------------- | -------------------------------------------------- |
| `/`                 | Home comercial, destaques, regiões e captura geral |
| `/imoveis`          | Catálogo completo com filtros locais               |
| `/imoveis/[regiao]` | Landing regional para SEO e campanhas              |
| `/imovel/[slug]`    | Ficha completa do empreendimento                   |
| `/sobre`            | Autoridade, bio e atendimento do corretor          |
| `/contato`          | Conversão geral e canais oficiais                  |
| `/obrigado`         | Confirmação pós-lead e continuidade no WhatsApp    |
| `/privacidade`      | Transparência LGPD                                 |
| `/studio`           | Painel autenticado do Sanity                       |
| `/api/revalidate`   | Webhook assinado para revalidar cache              |

`sitemap.ts`, `robots.ts`, `opengraph-image.tsx` e `llms.txt` complementam SEO,
compartilhamento e descoberta por buscadores e assistentes.

## 3. Server Components e componentes interativos

Componentes são de servidor por padrão. Eles consultam o Sanity, montam metadados e enviam
HTML já pronto. Um arquivo recebe `"use client"` apenas quando precisa de estado, eventos do
navegador ou APIs visuais.

Principais ilhas client-side:

- `Catalogo.tsx`: filtros, ordenação e quantidade de resultados.
- Galeria e visualizador de plantas: navegação e modal acessível.
- Formulários de lead: estado de envio, mensagens e redirecionamento.
- `MetaPixel.tsx`: carregamento tardio e evento do navegador.
- Componentes de movimento: `IntersectionObserver` e scroll progressivo.

Essa fronteira reduz JavaScript inicial e preserva o desempenho mobile.

## 4. Camada Sanity

### Clientes

`src/lib/sanity/client.ts` fornece dois clientes:

- leitura pública, sem token, com CDN e perspectiva `published`;
- escrita, somente no servidor, com `SANITY_API_WRITE_TOKEN` e CDN desligado.

Nunca importe o cliente de escrita em um Client Component.

### Queries

Todas as consultas GROQ ficam em `src/lib/sanity/queries.ts`. Isso evita strings duplicadas,
facilita auditoria e mantém as projeções consistentes.

- Projeções de card retornam somente os dados necessários ao catálogo.
- A query da ficha retorna galeria, plantas, tipologias, localização e relacionados.
- Queries regionais alimentam páginas estáticas e navegação local.
- A Server Action possui uma query mínima para validar o imóvel informado pelo navegador.

### Cache e revalidação

As funções em `src/lib/sanity/fetch.ts` usam Cache Components, `cacheLife` e `cacheTag`.
Quando um documento muda, o webhook assinado em `/api/revalidate` identifica o tipo e
invalida as tags correspondentes. O próximo acesso recebe o conteúdo atualizado sem limpar
todo o cache.

## 5. Fluxo completo do lead

1. O visitante chega por uma página ou anúncio com UTMs e, quando aplicável, `fbclid`.
2. Os parâmetros são preservados durante a navegação.
3. O formulário envia os dados para `src/app/(site)/actions/lead.ts`.
4. O servidor identifica a origem da requisição e aplica limite de tentativas.
5. Zod normaliza nome, telefone, e-mail, consentimento e campos de campanha.
6. Honeypot e tempo de preenchimento rejeitam automação simples.
7. Se houver imóvel, o servidor consulta o Sanity e ignora nome/bairro enviados pelo cliente.
8. A página de origem é aceita somente quando pertence ao próprio site.
9. O lead é criado como `drafts.lead.<eventId>` no Sanity.
10. Meta CAPI e Resend são executados em paralelo, com timeout.
11. O navegador recebe apenas sucesso, `eventId` e a URL segura do WhatsApp.

O lead é salvo antes das integrações. Assim, uma indisponibilidade do Meta ou do e-mail não
faz o contato desaparecer.

## 6. Meta Pixel e Conversions API

O evento `Lead` pode chegar por duas fontes:

- navegador, pelo Pixel;
- servidor, pela Conversions API.

As duas usam o mesmo `eventID`, permitindo deduplicação no Events Manager. Telefone e
e-mail são normalizados e transformados em SHA-256 antes do envio server-side. Token da CAPI
nunca é incluído no bundle público.

## 7. Imagens

Imagens ficam no Sanity CDN e passam pelo loader em `src/lib/sanity/image-loader.ts`.
`next/image` informa largura, qualidade e formato; o CDN gera a variante necessária sob
demanda. Cards usam tamanhos menores, enquanto galeria e plantas ampliadas recebem qualidade
maior.

Toda imagem deve ter dimensões previsíveis e atributo `sizes`. Isso evita download excessivo
e mudança de layout.

## 8. Segurança

### Dados pessoais

O dataset de conteúdo é público, mas APIs anônimas do Sanity não leem drafts. Por isso leads
sempre recebem prefixo `drafts.` e o Studio remove a ação de publicação. Somente usuários
autenticados e o token server-side acessam esses documentos.

### Proteção antiabuso

Em produção, o limitador usa documentos técnicos privados por janela de dez minutos. O IP é
transformado por HMAC antes de compor o identificador; o endereço bruto não é armazenado.
Controles expirados são removidos gradualmente.

### Navegador e rede

`next.config.ts` aplica CSP, HSTS, Referrer Policy, Permissions Policy, proteção contra
clickjacking e MIME sniffing. O Studio recebe um conjunto reduzido porque autenticação e
previews possuem necessidades próprias.

Fetches externos têm timeout. O webhook usa assinatura. Queries recebem parâmetros em vez
de concatenar conteúdo enviado pelo visitante.

## 9. Organização visual

O tema usa preto quente, branco editorial e dourado como acento. CSS global guarda tokens,
animações e utilitários compartilhados. Componentes preservam contraste AA, foco visível e
alvos de toque adequados.

Movimento é progressivo: o conteúdo continua disponível quando animações não são suportadas
ou quando `prefers-reduced-motion` está ativo.

## 10. Deploy

O fluxo esperado é:

```text
commit no master
  → GitHub Actions valida dependências, tipos, lint e build
  → integração Vercel cria o deployment
  → produção recebe o alias após build aprovado
  → smoke test confirma home, catálogo, Studio e formulário
```

Variáveis públicas entram no build; variáveis server-only ficam criptografadas na Vercel.
Não copie `.env.local` para o repositório.

## 11. Onde alterar cada coisa

| Necessidade                       | Arquivo ou área                           |
| --------------------------------- | ----------------------------------------- |
| Telefone, CRECI, bio e redes      | `src/lib/site.ts`                         |
| Textos e imóveis                  | Sanity Studio                             |
| Query ou projeção de conteúdo     | `src/lib/sanity/queries.ts`               |
| Política de cache                 | `src/lib/sanity/fetch.ts`                 |
| Mensagem do WhatsApp              | `src/lib/whatsapp.ts`                     |
| Evento de conversão               | `src/lib/meta/`                           |
| Validação do formulário           | `src/app/(site)/actions/lead.ts`          |
| Paleta, tokens e movimento        | `src/app/globals.css`                     |
| Cabeçalhos de segurança e imagens | `next.config.ts`                          |
| Modelos e painel editorial        | `sanity/schemas/` e `sanity/structure.ts` |

## 12. Regras para evoluir o projeto

- Consulte a documentação versionada do Next antes de alterar APIs do framework.
- Mantenha queries GROQ centralizadas.
- Não exponha preço; use “Consulte condições”.
- Não invente depoimentos, números ou disponibilidade.
- Não envie segredo para componentes client-side.
- Rode `typecheck`, `lint`, `build` e auditoria antes do deploy.
- Atualize README, este documento e `CLAUDE.md` quando uma decisão estrutural mudar.
