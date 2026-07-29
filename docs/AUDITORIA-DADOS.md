# Auditoria do scrape — Cury RJ

Auditoria dos 105 imóveis extraídos em `C:\projetos\scrapping-curry\output\rj_imoveis`.
Números medidos em 28/07/2026 sobre os arquivos reais, não sobre os resumos gerados.

---

## 1. O que existe

| Item                             | Quantidade                        |
| -------------------------------- | --------------------------------- |
| Imóveis com pasta e `dados.json` | **105**                           |
| Fotos                            | 1.298                             |
| Plantas                          | 567                               |
| Arquivos de imagem (com banners) | **1.991**                         |
| Peso total das imagens           | **641 MB** (média 330 KB/arquivo) |

### Por status

| Status            | Total |
| ----------------- | ----- |
| Pronto para Morar | 72    |
| Em Obras          | 25    |
| Lançamento        | 8     |

### Por zona (extraída da URL da Cury)

| Zona                             | Imóveis |
| -------------------------------- | ------- |
| Zona Norte                       | 36      |
| Zona Oeste                       | 20      |
| Zona Portuária / Porto Maravilha | 20      |
| São Gonçalo                      | 11      |
| Baixada Fluminense               | 8       |
| Niterói                          | 7       |
| Centro                           | 3       |

Essas 7 zonas viram o **primeiro nível do filtro de localidade**; as 28 regiões/bairros
viram o segundo nível.

### Tipologias mais comuns

`2q` (27) · `1q+2q` (27) · `2q+3q` (19) · `1q+2q+3q` (13) · `studio+1q+2q` (8)

Inventário completo em [`inventario-imoveis.csv`](inventario-imoveis.csv).

---

## 2. Campos disponíveis por imóvel

Bom material — dá para montar uma página rica sem inventar nada:

`id` · `title` · `url` · `status` · `region` · `bedrooms` · `highlight_text` ·
`description_html` / `description_text` · `amenities[]` (nome + ícone) ·
`highlight_amenities[]` · `locations[]` (endereço + Waze + Google Maps) ·
`coordinates[]` (lat/lng) · `region_image` · `region_description` · **`legal_text`**
(registro de incorporação — resolve compliance) · `related_properties[]` ·
`photos[]` · `plants[]` · `banners{desktop,mobile}`

**Cobertura:** 105/105 com endereço, coordenadas e descrição. Nenhum imóvel sem localização.

---

## 3. Problemas encontrados

### 3.1 🔴 O campo `sold` é inválido — **crítico**

47 dos 105 imóveis vêm com `sold: true`. Mas o cruzamento revela o padrão:

| `sold`  | Status            | Qtd    |
| ------- | ----------------- | ------ |
| `false` | Pronto para Morar | 58     |
| `true`  | Em Obras          | **25** |
| `true`  | Pronto para Morar | 14     |
| `true`  | Lançamento        | **8**  |

**100% dos Em Obras e 100% dos Lançamentos** estão marcados como vendidos. Verificação ao
vivo no site da Cury:

- `nova-norte-raizes` (Em Obras, `sold: true`) → página ativa, CTA "Fale com um corretor",
  WhatsApp, simulador de financiamento, acompanhamento de obra. **À venda.**
- `parque-piedade-condominio-aquarela` (Lançamento, `sold: true`) → "Compre na planta com
  preços imperdíveis", múltiplos CTAs. **À venda.**

O campo vem cru da API da Cury (`api_item.get("sold")` em `scraper.py:99`) e claramente
significa outra coisa — provavelmente "existem unidades já vendidas" ou algum controle
interno de estoque.

**Impacto no projeto:** `generate_excel.py:104` pintou de cinza e escreveu `(VENDIDO)` ao
lado desses 33 imóveis na planilha enviada ao corretor. Se ele confiou no rótulo — e não há
razão para não confiar — ele descartou justamente os **Lançamentos e Em Obras**, que são o
produto de maior comissão, melhor apelo de tráfego pago ("compre na planta", entrada
parcelada) e maior prazo de venda.

**Ação:** reenviar ao corretor a lista abaixo perguntando quais entram. Nunca usar `sold`
como fonte de disponibilidade no site.

<details>
<summary><b>Os 33 imóveis rotulados errado</b></summary>

| Imóvel                                    | Status real | Região                    |
| ----------------------------------------- | ----------- | ------------------------- |
| Américas 19                               | Em Obras    | Recreio                   |
| Arcos do Porto                            | Em Obras    | Porto Maravilha           |
| Baía                                      | Em Obras    | Porto Maravilha           |
| Caminhos da Guanabara                     | Em Obras    | Niterói                   |
| Ciata Residencial                         | Em Obras    | Porto Maravilha           |
| Completo Parque Brito III                 | Em Obras    | Campo Grande              |
| Epicentro                                 | Em Obras    | Porto Maravilha           |
| Farol da Guanabara                        | Em Obras    | Santo Cristo              |
| Heitor dos Prazeres - Colombina           | Em Obras    | Porto Maravilha           |
| Heitor dos Prazeres - Pierrot             | Em Obras    | Porto Maravilha           |
| Metropolitan Dream                        | Em Obras    | Barra Olímpica            |
| Mirante da Guanabara                      | Em Obras    | Porto Maravilha           |
| My Jacarepaguá Life                       | Em Obras    | Jacarepaguá               |
| My Jacarepaguá Mood                       | Em Obras    | Jacarepaguá               |
| Nova Norte - Ginga                        | Em Obras    | Irajá                     |
| Nova Norte - Raízes                       | Em Obras    | Irajá                     |
| Orla Mauá                                 | Em Obras    | Porto Maravilha           |
| Residencial Cartola                       | Em Obras    | São Cristóvão             |
| Residencial Cartola II                    | Em Obras    | São Cristóvão             |
| Residencial Nova Olaria                   | Em Obras    | Olaria                    |
| Residencial Pixinguinha - Cond. Carinhoso | Em Obras    | Santo Cristo              |
| Residencial Porto Maravilha               | Em Obras    | Porto Maravilha           |
| Residencial Quinta do Bispo               | Em Obras    | Rio Comprido              |
| Rio Branco 220                            | Em Obras    | Centro                    |
| The Pier Residencial                      | Em Obras    | Niterói                   |
| Luzes do Rio - Cond. Candeeiro            | Lançamento  | Imperial de São Cristóvão |
| Luzes do Rio - Cond. Lamparina            | Lançamento  | Imperial de São Cristóvão |
| Nova Irajá Residencial                    | Lançamento  | Irajá                     |
| Origem Porto Imperial                     | Lançamento  | São Cristóvão             |
| Orla Central                              | Lançamento  | Centro                    |
| Parque Piedade - Cond. Aquarela           | Lançamento  | Piedade                   |
| Residencial Pixinguinha - Cond. Rosa      | Lançamento  | Santo Cristo              |
| Saudosa Praça Onze Residencial            | Lançamento  | Centro                    |

</details>

Os 14 "Pronto para Morar" com `sold: true` (Galeria Estação Zona Norte, Alto São Cristóvão,
Urban Downtown, Urban São Cristóvão, Rio Energy, Único Bonsucesso, Vargas 1140, Pateo
Nazareth, Trendy Cachambi, My Jacarepaguá, Orla Recreio Reserva, Connect Bonsucesso, Nova
Norte Samba, Orla Recreio Praia do Pontal) **podem** estar realmente esgotados — prontos
esgotam de verdade. Confirmar caso a caso com o corretor.

### 3.2 🟠 Encoding nos arquivos consolidados

Os 105 `dados.json` individuais estão em **UTF-8 limpo** (verificado nos 105).
Já `resumo.json`, `ativos.json`, `ativos_consolidado.json`, `todos_consolidado.json`,
`resumo_completo.json` e `lista_whatsapp.txt` têm **mojibake** (`SÃ£o GonÃ§alo`,
`LanÃ§amento`). Usar **sempre** os `dados.json` individuais como fonte.

### 3.3 🟠 Peso das imagens

641 MB é inviável tanto para o Lighthouse quanto para a cota do Sanity. Pipeline obrigatório:
redimensionar para 2000px, converter para AVIF/WebP q78, limitar a 12 fotos por imóvel.
Estimativa: **641 MB → menos de 120 MB**.

### 3.4 🟡 Campos que precisam de normalização

- `bedrooms` vem assim: `"2 dorms.                  ,           3 dorms."` — normalizar
  para `number[]`. `Studio` aparece como tipologia e vira `0`.
- `description_html` traz lixo de colagem do Word: `<o:p>`, `class="MsoNormal"`, `\r\n`.
- `video_tour` e `presentation_video` quase sempre vêm sem ID
  (`youtube.com/embed/?rel=0&showinfo=0&origin=...`) — tratar como ausente.
- `hide_price: 1` em 42 imóveis — a própria Cury esconde preço nesses.

### 3.5 🟡 Lacunas pontuais

| Imóvel                                | Falta   |
| ------------------------------------- | ------- |
| `0067_parque-dos-sonhos-campo-grande` | plantas |
| `0255_origem-porto-imperial`          | plantas |
| `0120_completo-piedade`               | fotos   |
| `0132_urban-zona-norte`               | fotos   |

Se algum deles for selecionado, buscar o material com o corretor.

### 3.6 🟡 Sem nenhum preço

O scrape não trouxe valor nenhum. Como a decisão foi exibir `"A partir de R$ X"`, esse dado
tem que vir do corretor (item 0.4 do plano).

### 3.7 🟡 Descrições da Cury

Copiar na íntegra gera conteúdo duplicado e prejudica o ranqueamento orgânico. Reescrever as
descrições dos imóveis publicados.

---

## 4. O que isso significa para o site

- Filtro de localidade em **dois níveis** (7 zonas → 28 bairros) — é o corte natural do
  acervo e resolve o problema do scroll infinito.
- Filtro de quartos com 4 opções: **Studio, 1, 2, 3+** — cobre todas as tipologias.
- Filtro de status vale muito: "Lançamento" e "Pronto para Morar" atraem públicos
  diferentes e merecem campanhas diferentes no Meta.
- 105 imóveis com coordenadas → mapa e página por região saem de graça.
- `legal_text` presente em todos → compliance de incorporação resolvido sem trabalho extra.
