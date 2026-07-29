# Plano de ação — Cláudio Corretor

Da planilha do corretor até campanha rodando no Meta. Cada fase tem entregável verificável.
Fases 1–3 podem começar sem a planilha; a Fase 4 depende dela.

---

## Fase 0 — Destravar os dados `BLOQUEADA`

Nada de conteúdo real entra no site antes disso.

| #    | Item                                                                                                                       | Responsável     | Status                                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------ |
| 0.1  | Planilha de seleção devolvida pelo corretor                                                                                | você            | ✅ **39 selecionados**                           |
| 0.3  | Revalidar os 33 rotulados errado como VENDIDO                                                                              | você + corretor | ✅ **não se concretizou** — ele ignorou o rótulo |
| 0.2  | Material novo do WhatsApp                                                                                                  | você            | ✅ **4 construtoras novas**                      |
| 0.4  | ~~Faixa de preço~~                                                                                                         | —               | ✅ **cancelado** — decidido não exibir preço     |
| 0.5  | Foto do corretor + bio                                                                                                     | corretor        | ✅ recebidos (foto em baixa resolução)           |
| 0.7  | Decisão sobre os **20 em branco** — sobretudo Metropolitan Dream e Residencial Quinta do Bispo (Em Obras)                  | corretor        | ⬜                                               |
| 0.8  | Fotos do **Completo Piedade** e do **Urban Zona Norte**; plantas do **Origem Porto Imperial**                              | corretor        | ⬜                                               |
| 0.9  | **De qual empreendimento são as 5 fotos aéreas de obra?**                                                                  | corretor        | ⬜                                               |
| 0.10 | Material de **Recanto das Águas**, **Nova Zelândia** e **Rebouças**; localização e book do **Nova York**                   | corretor        | ⬜                                               |
| 0.11 | Book da **Direcional** é versão final? (contém nota de rascunho) · data de lançamento do **Conceito Califórnia** (`xx/xx`) | corretor        | ⬜                                               |
| 0.6  | Confirmar e-mail (`.com` vs `.co`) e autorização de uso das marcas Cury, JV, Direcional e Você RJ                          | corretor        | ⬜                                               |

> Análise completa da seleção em [`SELECAO-CORRETOR.md`](SELECAO-CORRETOR.md).
> Resumo: 23 Em Obras + 8 Lançamento + 8 Pronto para Morar, **44% na zona portuária**.
> O site é vitrine de lançamento/obra no Porto Maravilha e Centro, não catálogo genérico do RJ.

---

## Fase 1 — Fundação `pode começar agora`

1. `git init` + `.gitignore` + repositório remoto.
2. `create-next-app` — TypeScript, App Router, Tailwind v4, ESLint, sem `src/app` default.
3. `tsconfig` em `strict`, path alias `@/*`.
4. Prettier + ESLint + `lint-staged`.
5. `next/font` local (Geist ou Inter), subset latin, `display: swap`.
6. Deploy vazio na Vercel — valida o pipeline antes de existir conteúdo.

**Entregável:** URL `*.vercel.app` no ar com página em branco e CI verde.

---

## Fase 2 — Design system

Antes de qualquer página. Design impecável começa por tokens consistentes, não por tela bonita.

1. Tokens em CSS vars: paleta, tipografia, espaçamento, raios, sombras, `z-index`.
   Direção: sofisticado e confiável — imobiliário de alto padrão, não "panfleto de MCMV".
   Neutros quentes + um acento forte para CTA. Dark mode **não** é prioridade.
2. Primitivos em `components/ui`: `Button`, `Badge`, `Dialog`, `Select`, `Sheet`, `Input`,
   `Skeleton`, `Chip`, `Carousel`.
3. Padrões de movimento: `ScrollReveal` (IntersectionObserver, ~1 KB), transições de imagem,
   `prefers-reduced-motion` respeitado.
4. Grid responsivo e escala tipográfica fluida (`clamp()`).

**Entregável:** rota `/dev/ui` com todos os primitivos. Removida antes do deploy final.

---

## Fase 3 — Sanity

1. Projeto Sanity + dataset `production`.
2. Schemas:
   - **`imovel`** — nome, slug, status, **construtora (ref)**, região (ref), bairro, endereço,
     coordenadas, tipologias (`quartos: number[]`, área, vagas, suíte), ficha técnica
     (terreno, blocos, pavimentos, total de unidades, vagas), diferenciais, galeria,
     plantas (imagem + rótulo + área), descrição reescrita, `textoLegal`, vídeo,
     `publicado`, `destaque`, `ordem`, bloco `seo`.
     **Sem campo de preço público** — ver decisão 3 do CLAUDE.md.
   - **`construtora`** — nome, slug, logo, cor de marca. Vira filtro no catálogo.
   - **`regiao`** — nome, slug, zona, texto de SEO, imagem — alimenta `/imoveis/[regiao]`.
   - **`lead`** — nome, whatsapp, email, imóvel de interesse, origem/UTM, status
     (novo/contatado/convertido/perdido), data. _O corretor ganha um CRM básico de graça._
   - **`depoimento`**, **`siteSettings`** (dados de contato, textos da home, pixel ID).
3. Studio embutido em `/studio` + `@sanity/locale-pt-br` + `structure.ts` com rótulos
   em português e agrupamento por status.
4. Webhook Sanity → `/api/revalidate` (ISR sob demanda ao publicar).

**Entregável:** corretor consegue logar em `/studio` e editar um imóvel de teste.

---

## Fase 4 — Pipeline de dados `depende da Fase 0`

Três scripts encadeados, todos idempotentes (rodar duas vezes não duplica nada).

**`01-normalize-scrape.ts`** — lê os 105 `dados.json` (UTF-8 limpo), cruza com a planilha
do corretor, e normaliza:

- `bedrooms` sujo → `quartos: number[]`
- limpa lixo do Word do `description_html`
- descarta `video_tour` sem ID de vídeo
- resolve zona a partir da URL da Cury (`/zona-norte/`, `/zona-oeste/`…)
- **ignora o campo `sold`** — disponibilidade vem da planilha
- valida com Zod e falha alto se faltar campo obrigatório
- saída: `data/imoveis.normalized.json` + relatório de lacunas

**`02-optimize-images.ts`** — `sharp` sobre as imagens selecionadas:

- máx. 2000px no maior lado, AVIF + WebP, qualidade 78
- LQIP base64 (20px, blur) embutido no JSON
- **teto de 12 fotos por imóvel** (as melhores) + todas as plantas
- meta: 641 MB → **< 120 MB**

**`03-import-to-sanity.ts`** — sobe assets, cria/atualiza documentos por `_id` determinístico
(`imovel-<slug>`), com `--dry-run` e log de diffs.

**`04-extract-book-images.ts`** — extrai os renders embutidos nos PDFs dos books na resolução
nativa (**1920×1080**, 40 no Conceito Califórnia e 42 no Conquista Parque Iguaçu), desduplica
por hash e entrega prontos para upload manual no Studio. Sem re-renderizar página, sem perda.

> Desduplicar **sempre por hash**: o material do WhatsApp veio com 37 arquivos que eram só 26
> únicos, e com extensão mentindo (`corretor.jpg` é AVIF). Detectar tipo por assinatura.

**Entregável:** imóveis selecionados visíveis e editáveis no `/studio`.

---

## Fase 5 — Páginas

### `/` Home

Hero com busca rápida (localidade + quartos) · faixa de credibilidade (CRECI, nº de imóveis,
regiões) · imóveis em destaque · atalhos por região com imagem · como funciona (3 passos) ·
sobre o Cláudio com foto real · depoimentos · CTA final.

### `/imoveis` Catálogo — _resolve o "scroll gigante"_

- Barra de filtros **sticky**: Localidade (agrupada por zona), Quartos, Status, **Construtora**.
  Não há filtro por preço — o site não exibe valores.
- Filtragem **100% client-side** sobre payload enxuto (~4 KB gzip) — resposta instantânea,
  zero request.
- Estado espelhado na URL (`?zona=norte&quartos=2`) → link filtrado é anunciável no Meta.
- **12 cards + "Carregar mais"** — nunca lista de 60 itens de uma vez.
- Mobile: filtros viram bottom-sheet com contador no botão ("Ver 12 imóveis").
- Chips de filtro ativo, com "limpar", e empty state que oferece o WhatsApp.

### `/imoveis/[regiao]`

Rota estática por região: SEO orgânico ("apartamento em Jacarepaguá") e landing de campanha
segmentada por bairro.

### `/imovel/[slug]` — landing dos anúncios

Galeria · ficha técnica · tipologias com plantas (lightbox + zoom) · diferenciais com ícones ·
mapa + pontos de interesse · descrição reescrita · **formulário de lead sempre visível**
(sidebar no desktop, sticky no mobile) · texto legal · imóveis relacionados.

### Pop-out

`@modal/(.)imovel/[slug]` — clicar num card dentro do catálogo abre modal, URL muda, sem
recarregar. Refresh ou link direto renderiza a página completa. **Um conteúdo, duas
apresentações** — atende "página dedicada ou pop-out" sem escolher.

### Demais

`/sobre` · `/contato` · `/obrigado` (dispara conversão) · `/privacidade` · `not-found`.

---

## Fase 6 — Conversão e Meta

**Funil:** CTA → formulário (Nome, WhatsApp, E-mail opcional, consentimento LGPD) →
Server Action → Zod + honeypot + rate limit → grava `lead` no Sanity → **CAPI `Lead`** →
e-mail ao corretor (Resend) → `/obrigado` → abre WhatsApp com mensagem pré-preenchida
citando o imóvel.

**Por que o formulário antes do WhatsApp:** o lead fica gravado mesmo se a pessoa desistir de
abrir o zap, e telefone/e-mail hasheados (SHA-256) melhoram muito o match quality do CAPI —
que é o que faz o algoritmo do Meta baratear o lead.

**Eventos:** `PageView` · `ViewContent` (imóvel, `content_ids = slug`) · `Search` (uso do
filtro) · `Lead` · `Contact` (clique direto no WhatsApp).

**Dedup:** Pixel e CAPI disparam o mesmo `eventID` (UUID por evento). Sem isso a conta conta
o lead duas vezes e a otimização degrada.

**Performance:** Pixel carregado só em idle/primeira interação. CAPI é a fonte primária —
independe de bloqueador de anúncio e não pesa no LCP.

**UTMs:** capturados na entrada, persistidos em `sessionStorage`, gravados no lead.
O corretor passa a saber qual criativo trouxe qual cliente.

---

## Fase 7 — SEO, performance, acessibilidade

- `generateMetadata` por rota; OG image dinâmica por imóvel (`opengraph-image.tsx`).
- JSON-LD: `RealEstateAgent` (global) + `Residence`/`Product` por imóvel + `BreadcrumbList`.
- `sitemap.ts` e `robots.ts` gerados do Sanity.
- Auditoria Lighthouse mobile — metas na §6 do CLAUDE.md são **bloqueantes**.
- Teclado e leitor de tela em galeria, modal e filtros; contraste AA; alvos de toque ≥ 44px.
- Playwright: catálogo filtra, modal abre, formulário grava lead.

---

## Fase 8 — Publicação

1. Variáveis de ambiente na Vercel.
2. Pixel + CAPI validados no Events Manager (checar dedup e match quality).
3. Treinar o corretor no `/studio` — vídeo curto de 5 min.
4. Search Console + sitemap.
5. **Registrar domínio próprio** (`.com.br`, ~R$ 40/ano) e verificar no Meta _antes_ de
   escalar verba. Em `*.vercel.app` a verificação é impossível (Public Suffix List) e a
   atribuição em iOS fica capenga.

---

## Riscos

| Risco                                   | Impacto                       | Mitigação                                                        |
| --------------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| ~~Seleção enviesada pelo `sold` falso~~ | —                             | ✅ **Descartado** — ele ignorou o rótulo                         |
| ~~641 MB de imagem~~                    | —                             | ✅ **Reduzido** — só 39 imóveis = 358 MB → ~60–90 MB comprimidos |
| ~~Cota do plano free do Sanity~~        | —                             | ✅ **Resolvido** pelo item acima                                 |
| 2 imóveis selecionados sem nenhuma foto | Médio — sem card nem criativo | Item 0.8, ou tirar do ar                                         |
| `vercel.app` invisível para o Meta      | Médio                         | Domínio antes de escalar; `NEXT_PUBLIC_SITE_URL`                 |
| Descrição duplicada da Cury             | Médio — SEO                   | Reescrever as descrições publicadas                              |
| Direito de uso das imagens Cury         | Médio — jurídico              | Confirmar autorização com o corretor (0.6)                       |
| Sem preço                               | Médio — conversão             | Item 0.4; fallback "Consulte condições"                          |
| Imóvel vendido continua no ar           | Médio — lead queimado         | Toggle `publicado` no Studio + revisão mensal                    |

---

## Ordem de execução

```
Fase 0 (você)  ──────────────┐
Fase 1 → 2 → 3 (paralelo) ───┴──→ Fase 4 → 5 → 6 → 7 → 8
```

Fases 1, 2 e 3 não dependem da planilha. **Podemos começar agora** e a Fase 4 encaixa o
conteúdo real quando ele chegar.
