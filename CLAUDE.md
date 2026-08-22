# CLAUDE.md — Cláudio Corretor

Site de captação de leads para corretor de imóveis no Rio de Janeiro — **multi-construtora**:
Cury, JV (Jerônimo da Veiga), Direcional, Construtora Você RJ e Rebouças.
Objetivo primário: **converter tráfego pago do Meta em leads no WhatsApp.**

> Leia também `docs/PLANO-DE-ACAO.md` (fases), `docs/AUDITORIA-DADOS.md` (o scrape da Cury),
> `docs/SELECAO-CORRETOR.md` (os 39 escolhidos) e `docs/MATERIAL-NOVO.md` (as outras
> construtoras). Este arquivo é o contrato de trabalho.

---

## 1. Dados do cliente (usar em footer, JSON-LD, WhatsApp, metadata)

| Campo        | Valor                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| Nome do site | Cláudio Corretor                                                            |
| CRECI        | 103666 — **obrigatório no rodapé de todas as páginas**                      |
| E-mail       | claudioshema2009@gmail.com                                                  |
| Instagram    | https://www.instagram.com/claudio_corretordeimoveis                         |
| WhatsApp     | +55 21 97685-2128 → `5521976852128` (formato wa.me)                         |
| Praça        | Rio de Janeiro / Baixada / Niterói / São Gonçalo                            |
| Construtoras | Cury · JV (Jerônimo da Veiga) · Direcional · Construtora Você RJ · Rebouças |

**Bio oficial** (usar exatamente assim, com acentos):

> Ajudo famílias a realizar o sonho da casa própria. Empreendimentos do programa Minha Casa
> Minha Vida com parcelas que cabem no seu bolso, lazer completo e localização privilegiada
> no Rio de Janeiro.

Posicionamento que ela fixa: **MCMV, parcela acessível, família** — guia o tom da home e dos
criativos do Meta.

O e-mail informado originalmente terminava em `.co`; assumido `.com` (typo).
**Confirmar com o cliente antes do deploy.**

---

## 2. Stack

| Camada     | Escolha                                                   | Por quê                                                 |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------- |
| Framework  | **Next.js 16.2 (App Router)** + React 19.2                | PPR, Server Actions, intercepting routes                |
| Linguagem  | **TypeScript** (`strict: true`)                           | Único idioma do app e dos scripts                       |
| Estilo     | **Tailwind CSS v4** + CSS vars                            | Zero runtime CSS-in-JS; ajuda no LCP                    |
| CMS        | **Sanity** (Studio embutido em `/studio`, locale `pt-BR`) | Corretor edita sozinho; CDN de imagem resolve os 641 MB |
| Imagens    | `next/image` + loader do Sanity CDN                       | AVIF/WebP + resize sob demanda                          |
| Formulário | Server Actions + **Zod**                                  | Sem API pública exposta, validação compartilhada        |
| Rastreio   | **Meta Pixel + Conversions API** (dedup por `eventID`)    | CAPI é a fonte primária; Pixel é secundário             |
| E-mail     | **Resend**                                                | Notifica o corretor a cada lead                         |
| Hospedagem | **Vercel** (`*.vercel.app` por ora)                       | Deploy nativo Next; domínio próprio depois              |
| Testes     | **Vitest** (unit) + **Playwright** (smoke E2E)            | Cobrir normalizador e funil de lead                     |
| Scripts    | **Node/TS** + `sharp` + `@sanity/client`                  | Import e otimização de imagem                           |
| Scrape     | **Python** — permanece em `C:\projetos\scrapping-curry`   | Só para re-scrape futuro. **Não** entra neste repo      |

### Next.js 16 — leia a doc antes de codar

O projeto roda **Next 16.2**, que tem breaking changes em relação ao seu conhecimento prévio.
A doc versionada está em `node_modules/next/dist/docs/` (é o que o `AGENTS.md` manda ler).
**Consulte-a antes de escrever qualquer código de Next** — não confie na memória.

O que já foi apurado e vale como decisão:

- **Cache Components está ligado** (`cacheComponents: true` em `next.config.ts`).
  O modelo é `use cache` + `cacheLife()` + `cacheTag()`, com **PPR por padrão**.
  Isso substitui o plano original de ISR/`revalidatePath`.
- Toda query do Sanity leva `'use cache'` + `cacheTag(...)`. O webhook do Studio cai num
  **Route Handler**, e ali o certo é **`revalidateTag`** — `updateTag` só funciona dentro de
  Server Action e lançaria erro. `revalidatePath` não se usa: tag é mais preciso.
- Qualquer componente que leia `cookies`, `headers`, `searchParams` ou `params` sem
  `generateStaticParams` **precisa** estar dentro de `<Suspense>`, senão o build quebra com
  `Uncached data was accessed outside of <Suspense>`.
- `next/font/google` auto-hospeda — não baixar arquivo de fonte à mão.

### Regras de stack

- **Nunca** adicionar biblioteca de animação pesada no caminho crítico. Animação = CSS +
  `IntersectionObserver`. Se precisar de física, importar dinamicamente e fora do LCP.
- **Nunca** adicionar UI kit inteiro (MUI, Chakra). Primitivos próprios em `src/components/ui`,
  acessibilidade via Radix apenas onde for necessário (Dialog, Popover, Select).
- Sem `useEffect` para buscar dados. Server Components por padrão; `"use client"` só em
  filtro, galeria, modal e formulário.

---

## 3. Estrutura de pastas

```
Claudio-Imoveis-V2/
├─ CLAUDE.md
├─ docs/                       PLANO-DE-ACAO.md · AUDITORIA-DADOS.md · META-ADS.md
├─ sanity/
│  ├─ schemas/documents/       imovel · lead · regiao · depoimento · siteSettings
│  ├─ schemas/objects/         planta · diferencial · seo
│  ├─ structure.ts             Desk customizado, rótulos em pt-BR
│  └─ sanity.config.ts
├─ scripts/
│  ├─ 01-normalize-scrape.ts   105 dados.json → imoveis.normalized.json
│  ├─ 02-optimize-images.ts    sharp: resize + AVIF/WebP + LQIP
│  └─ 03-import-to-sanity.ts   upload de assets + criação de documentos
├─ src/
│  ├─ app/
│  │  ├─ (site)/
│  │  │  ├─ page.tsx                        Home
│  │  │  ├─ imoveis/page.tsx                Catálogo + filtros
│  │  │  ├─ imoveis/[regiao]/page.tsx       Landing por região (SEO + campanha)
│  │  │  ├─ imovel/[slug]/page.tsx          Página dedicada (landing de anúncio)
│  │  │  ├─ obrigado/page.tsx               Pós-conversão
│  │  │  ├─ sobre · contato · privacidade
│  │  │  └─ @modal/(.)imovel/[slug]/page.tsx   Pop-out interceptado
│  │  ├─ api/lead/route.ts · api/revalidate/route.ts
│  │  ├─ studio/[[...tool]]/page.tsx
│  │  └─ sitemap.ts · robots.ts · opengraph-image.tsx
│  ├─ components/  ui · layout · imovel · catalogo · conversao
│  ├─ lib/         sanity · meta · filtros · whatsapp · seo · utils
│  ├─ types/  └─ styles/
└─ e2e/
```

---

## 4. Decisões travadas (não reabrir sem o usuário pedir)

1. **CMS Sanity**, não site estático — o corretor precisa editar sozinho.
2. **Lead = formulário curto → depois WhatsApp.** Nunca botão direto sem captura na
   rota principal de conversão. O lead tem que ser gravado antes de sair do site.
3. **Preço: NÃO exibir valor em lugar nenhum.** Sempre `"Consulte condições"`.
   Decisão do cliente em 28/07/2026 — substitui a decisão anterior de `"A partir de R$ X"`.
   Portanto **não existe filtro por faixa de preço** no catálogo, e nenhum campo de preço
   público no schema. Reforço: a `TABELA DE VENDAS` do Nova York é material comercial interno
   (VGV, desconto, sinal, pró-soluto por unidade) e **nunca** vai para o site.
4. **Hospedagem**: Vercel em `*.vercel.app` por enquanto. Domínio próprio depois —
   toda URL canônica passa por `NEXT_PUBLIC_SITE_URL` para a troca ser trivial.
5. **Página dedicada E pop-out**: resolvido com Parallel + Intercepting Routes, um só conteúdo.
6. **Tema escuro, e só ele.** Decisão do cliente em 29/07/2026. Preto quente
   (`noite-*`) + dourado (`ouro-*`) como acento único. Sem tema claro e sem
   alternador. Regras que caíram junto:
   - Tom `noite-600` ou mais escuro **nunca** é cor de texto — só superfície e
     borda. Texto secundário começa em `noite-400`.
   - Dourado como fundo pede texto `noite-950`. Branco sobre dourado não passa
     em contraste e ainda suja a cor.
   - Todo par texto/fundo tem que passar AA (4,5:1; 3:1 em texto grande). Já
     existe um script de auditoria de contraste usado na verificação — rodar
     de novo a cada mudança de paleta.
7. **Multi-construtora.** O schema tem document type `construtora` (nome, logo, slug)
   referenciado pelo `imovel`, e construtora é **filtro** no catálogo. O pipeline da Fase 4
   cobre só a Cury; os imóveis de JV, Direcional, Você RJ e Rebouças entram à mão pelo Studio,
   alimentados pelos books em `docs/MATERIAL-NOVO.md`.

---

## 5. Armadilhas conhecidas (leia antes de mexer nos dados)

### 5.1 O campo `sold` do scrape é FALSO — não filtrar por ele

`dados.json` marca 47 dos 105 imóveis como `sold: true`, incluindo **todos** os 25 "Em Obras"
e **todos** os 8 "Lançamento". Verificado ao vivo no site da Cury: `nova-norte-raizes`
(Em Obras) e `parque-piedade-condominio-aquarela` (Lançamento) estão **ativamente à venda**,
com CTA de corretor e WhatsApp. O campo vem cru da API da Cury e significa outra coisa.

O Excel enviado ao corretor (`generate_excel.py`) rotulou esses 33 imóveis como `(VENDIDO)`.
**Risco não se concretizou:** ele ignorou o rótulo e selecionou 8/8 dos Lançamentos e 23/25
dos Em Obras (ver `docs/SELECAO-CORRETOR.md`).

Regra que continua valendo: disponibilidade vem **da planilha do corretor**, nunca do campo
`sold`. Se houver re-scrape, o campo continua inútil.

### 5.2 Encoding

Os 105 `dados.json` individuais estão em **UTF-8 limpo** — usar sempre esses como fonte.
Os consolidados (`resumo.json`, `ativos.json`, `todos_consolidado.json`, `lista_whatsapp.txt`,
`resumo_completo.json`) têm **mojibake** (`Ã§`, `Ã£`). Não usar como fonte de verdade.

### 5.3 Peso das imagens

1.991 arquivos, **641 MB**, média de 330 KB. Servir cru mata o Lighthouse e estoura o
Sanity. Obrigatório passar pelo `02-optimize-images.ts` antes de qualquer upload.

### 5.4 Campos sujos no scrape

- `bedrooms` vem como `"2 dorms.       ,          3 dorms."` — whitespace e `\n` no meio.
  Normalizar para `number[]` (`[2, 3]`).
- `description_html` traz lixo do Word (`<o:p>`, `MsoNormal`). Sanitizar ou reescrever.
- `video_tour` / `presentation_video` costumam vir vazios (`youtube.com/embed/?rel=0...`
  sem ID). Tratar como ausente.
- 4 imóveis têm lacunas: `0067` e `0255` sem plantas; `0120` e `0132` sem fotos.

### 5.4b Escopo real: 39 imóveis, não 105

A seleção do corretor concentra **44% na zona portuária** (Porto Maravilha 11) e é
**79% lançamento + obra**. Ele recusou quase todo o produto periférico (São Gonçalo,
Engenho Novo, Maria Paula, Baixada). O site **não** é catálogo genérico do RJ — é vitrine de
lançamento/obra em Porto Maravilha, Centro e São Cristóvão. Home, hierarquia de regiões e
criativos do Meta devem refletir isso. Detalhes em `docs/SELECAO-CORRETOR.md`.

Carga de imagem dos 39: 893 arquivos / 358,6 MB → ~695 arquivos após teto de 12 fotos →
**~60–90 MB** após AVIF/WebP q78. Cabe no plano free do Sanity.

### 5.4c Extensão de arquivo não é fonte de verdade

O material do WhatsApp veio com extensão mentindo: `corretor.jpg` é na verdade **AVIF**
(assinatura `ftyp`), 540×1204, 17 KB. O pipeline de imagem deve detectar tipo por
**assinatura de bytes**, nunca por extensão. E 37 arquivos entregues eram só 26 únicos —
o WhatsApp duplica com sufixo ` 2`, ` 3`. **Sempre desduplicar por hash antes de importar.**

### 5.5 Conteúdo duplicado

As descrições vêm do site da Cury. Copiar na íntegra gera duplicate content e derruba o SEO.
**Reescrever** as descrições dos imóveis publicados.

### 5.6 `vercel.app` não é verificável no Meta

`vercel.app` está na Public Suffix List → o Business Manager **não permite verificar**
subdomínio `*.vercel.app`. Sem verificação de domínio não há Aggregated Event Measurement
(os 8 eventos priorizados) e a atribuição em iOS degrada bastante. Pixel e CAPI continuam
funcionando. **Registrar domínio antes de ligar verba de verdade.**

---

### 5.8 Animação de saída em overlay Radix trava a página — não usar

O `Presence` do Radix só desmonta o nó **depois do `animationend`**. Se a animação não
progride, o dialog fecha visualmente mas **continua montado, com o overlay bloqueando
cliques na página inteira**. Reproduzido aqui: animação `running` presa em `currentTime: 0`,
nó preso em `data-state="closed"`, overlays empilhando a cada abertura.

Acontece quando a página não compõe frames (aba em segundo plano, janela oculta) e é
agravado pelo reset de `prefers-reduced-motion`, que zera a duração via `!important`.

Regras que valem para todo overlay do projeto:

1. **Nenhuma animação de saída** (`data-[state=closed]:animate-*`). Sem ela, `animationName`
   é `none` no fechamento e o Radix desmonta na hora.
2. **Animação de entrada sempre com `motion-safe:`**. Sem isso, uma entrada que parte de
   `translateY(100%)` ou `opacity: 0` deixa o conteúdo fora da tela / invisível se travar.
3. Não usar `requestAnimationFrame` para estado visível de UI (dots de carrossel, contador
   de leitor de tela): rAF é estrangulado em aba oculta e o indicador congela.

### 5.9 Alvo de toque: 44px, com uma exceção documentada

Todo controle tem no mínimo 44px. A única exceção é o **X de remover chip de filtro**
(28px) — um X de 44px ficaria maior que o chip. Atende o mínimo de 24px do WCAG 2.5.8 e
nunca é o único caminho: existe sempre um "Limpar filtros" ao lado.

### 5.10 O Studio precisa ficar fora do grafo do servidor

Duas armadilhas encontradas ao montar `/studio`. Não "simplifique" o arranjo atual:

**a) `sanity.config.ts` não pode ser importado por Server Component.**
O padrão da doc do next-sanity usa uma página server. Aqui o build morre com
`Export default doesn't exist in target module`: o pacote `sanity` resolve pela condição
`react-server` e puxa `swr/dist/index/react-server.mjs`, que não tem export default.
Por isso `src/app/studio/[[...tool]]/page.tsx` é **`"use client"`** — assim o config só
existe no grafo do navegador.

**b) Metadata da rota mora em `src/app/studio/layout.tsx`,** porque client component não
exporta `metadata`/`viewport`. E os valores são **reescritos à mão** em vez de
`export { metadata } from "next-sanity/studio"` — reexportar traria o bundle do Studio de
volta ao servidor e recriaria o problema (a).

**c) O layout tem um marcador dinâmico (`connection()` dentro de `<Suspense>`).**
Com Cache Components, o `params` de rota catch-all conta como dado de request; sem o
marcador o build falha com `next-prerender-dynamic-metadata`. Renderizar por request é o
certo para um painel: é SPA, sem SEO, com um usuário só.

### 5.11 Nunca gravar `.env.local` com `Set-Content -Encoding UTF8`

O PowerShell 5.1 escreve **BOM**, e o BOM vira parte do nome da primeira variável —
`﻿NEXT_PUBLIC_SANITY_PROJECT_ID`. O `--env-file` do Node lê e a variável simplesmente
não existe, com erro que aponta para o lugar errado. Já aconteceu uma vez aqui.
Para editar arquivo de env por script, use `[System.IO.File]::WriteAllText` com
`UTF8Encoding($false)`, ou o Write tool.

## 5.7 Compliance (não remover)

- CRECI 103666 visível no rodapé de toda página.
- "Imagens meramente ilustrativas" nas galerias e plantas.
- `legal_text` de cada imóvel (registro de incorporação) — já existe no scrape, exibir na
  página do imóvel.
- LGPD: consentimento explícito no formulário + página de política de privacidade.
  O lead é dado pessoal e vai para Sanity + Meta CAPI (hasheado).

---

## 6. Metas de performance (bloqueantes para deploy)

| Métrica                               | Alvo          |
| ------------------------------------- | ------------- |
| Lighthouse mobile — Performance       | ≥ 95          |
| Acessibilidade / Best Practices / SEO | 100           |
| LCP (mobile, 4G)                      | < 1.8 s       |
| CLS                                   | < 0.05        |
| INP                                   | < 200 ms      |
| JS inicial                            | < 110 KB gzip |

Táticas: catálogo filtra **client-side sobre payload enxuto** (~4 KB gzip) — zero request por
filtro; `next/font` local com subset latin; Pixel deferido para idle; imagem LCP com
`priority` + `fetchPriority="high"`; `sizes` correto em toda imagem; sem layout shift em card
(aspect-ratio fixo + LQIP blur).

---

## 7. Convenções de código

- Componentes `PascalCase.tsx`; hooks `useAlgo.ts`; utilitários `camelCase.ts`.
- Nada de `any`. Tipos derivados do schema Sanity em `src/types`.
- Textos de UI em **pt-BR**, sem i18n. Código, nomes de variáveis e commits em pt-BR também
  (o dono do projeto é brasileiro) — mas termos técnicos ficam em inglês.
- Toda query GROQ mora em `src/lib/sanity/queries.ts`, nunca inline no componente.
- Todo evento Meta passa por `src/lib/meta/events.ts` — nunca chamar `fbq` direto.
- Toda montagem de link do WhatsApp passa por `src/lib/whatsapp.ts`.

## 8. Segredos (`.env.local`, nunca commitar)

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION # código do Search Console
NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET
SANITY_API_WRITE_TOKEN          # server-only: grava lead
SANITY_REVALIDATE_SECRET
NEXT_PUBLIC_META_PIXEL_ID
META_CAPI_ACCESS_TOKEN          # server-only
META_GRAPH_API_VERSION
META_CAPI_TEST_EVENT_CODE       # opcional
RESEND_API_KEY                  # server-only
RESEND_FROM_EMAIL
LEAD_NOTIFICACAO_EMAIL
```

## 9. Estado atual

Atualizado em **22/08/2026**.

- Site funcional em Next.js, com tema escuro, home, catálogo filtrável, páginas dedicadas,
  15 páginas regionais, galeria, plantas, mapa, política de privacidade e Studio Sanity.
- **40 imóveis publicados** no Sanity e **71 rotas** geradas no build de produção.
- Correção aplicada no link esticado dos cards: filtros do catálogo não abrem mais imóveis.
- Funil de lead concluído: formulário curto na home e em cada imóvel → grava no Sanity →
  dispara `Lead` no Pixel/CAPI com deduplicação → página `/obrigado` → WhatsApp.
- UTMs e `fbclid` persistem durante a navegação e são armazenados junto ao lead.
- E-mail via Resend é opcional; falha de Meta/Resend nunca impede a gravação do lead.
- SEO/AEO/GEO presente: metadados únicos, imagem social, canonical, JSON-LD, FAQ visível,
  páginas regionais, sitemap, robots e `llms.txt` com todos os empreendimentos.
- Build de produção, TypeScript e ESLint passam. Testes manuais cobriram desktop e mobile,
  filtro, mapa, ausência de overflow horizontal, formulário e captura de campanha.
- Lighthouse local mobile em produção: home chegou a **90/100 performance e 100/100 nas
  demais categorias**; catálogo ficou em 100/100 nas categorias não relacionadas a
  performance após as correções semânticas. O resultado de performance varia no ambiente
  local e deve ser repetido no endereço final da Vercel.

### Bloqueios antes de ligar tráfego pago

1. Definir `NEXT_PUBLIC_SITE_URL` com a URL final e publicar na Vercel.
2. Informar `NEXT_PUBLIC_META_PIXEL_ID` e `META_CAPI_ACCESS_TOKEN`; validar em Eventos de
   Teste no Meta antes de remover `META_CAPI_TEST_EVENT_CODE`.
3. Configurar domínio verificado no Meta antes de investir verba relevante.
4. Configurar Resend (`RESEND_API_KEY` e `RESEND_FROM_EMAIL`) ou aceitar leads apenas no
   Studio + WhatsApp.
5. Confirmar com o cliente o e-mail `claudioshema2009@gmail.com` e a autorização de uso das
   marcas/fotos das construtoras.
