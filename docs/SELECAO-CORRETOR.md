# Seleção do corretor — planilha devolvida em 28/07/2026

Fonte: `imoveis_cury_rj.xlsx`, aba `Imoveis Cury RJ`, coluna `Incluir? (Sim/Não)`.
Convenção usada por ele: **S = sim, N = não, célula vazia = sem resposta**.
Dados cruzados com o scrape em [`selecao-corretor.json`](selecao-corretor.json).

| Resposta                | Imóveis |
| ----------------------- | ------- |
| **S — entram no site**  | **39**  |
| N — ficam de fora       | 46      |
| _(vazio)_ — sem decisão | 20      |
|                         | **105** |

---

## 1. Ele ignorou o rótulo `(VENDIDO)` — e fez certo

A auditoria alertava que a planilha marcou 33 Lançamentos/Em Obras como vendidos por erro.
O corretor passou por cima do rótulo:

| Rótulo na planilha          | S            | N   | vazio |
| --------------------------- | ------------ | --- | ----- |
| Lançamento (VENDIDO)        | **8 de 8**   | 0   | 0     |
| Em Obras (VENDIDO)          | **23 de 25** | 0   | 2     |
| Pronto para Morar (VENDIDO) | 4            | 10  | 0     |
| Pronto para Morar           | 4            | 36  | 18    |

Ele pegou **100% dos lançamentos e 92% das obras** — exatamente o material que o rótulo
mandava descartar. O risco levantado na auditoria não se concretizou: ele conhece o estoque.

O que isso confirma: o campo `sold` do scrape é lixo e **a planilha é a única fonte de
disponibilidade**. Continua valendo a regra do CLAUDE.md §5.1.

Repare no inverso: dos 58 imóveis que o scrape dizia estarem "ativos", ele recusou 36 e
deixou 18 em branco — só 4 entraram.

---

## 2. O perfil comercial que a seleção revela

**Zona portuária domina: 17 dos 39 (44%).** Porto Maravilha sozinho tem 11.

| Zona           | Selecionados |
| -------------- | ------------ |
| Zona Portuária | 17           |
| Zona Norte     | 11           |
| Zona Oeste     | 5            |
| Niterói        | 4            |
| Centro         | 2            |

| Status            | Selecionados |
| ----------------- | ------------ |
| Em Obras          | 23           |
| Lançamento        | 8            |
| Pronto para Morar | 8            |

E o que ele **deixou de fora** fecha o retrato: São Gonçalo, Engenho Novo, Maria Paula,
Belford Roxo, Rocha Miranda, Nova Iguaçu, Campo Grande — quase todo o produto periférico
e "pronto para morar".

**Conclusão para o site e para as campanhas:** este não é um catálogo genérico de "imóveis no
RJ". É uma vitrine de **lançamento e obra na região portuária, Centro e São Cristóvão** —
público de investidor e de comprador urbano, com apelo de "compre na planta". A home, a
hierarquia das regiões e os criativos do Meta devem refletir isso, não tratar as 13 regiões
como iguais.

---

## 3. Os 39 selecionados

### Lançamento (8)

Luzes do Rio – Candeeiro · Luzes do Rio – Lamparina · Nova Irajá Residencial ·
Origem Porto Imperial · Orla Central · Parque Piedade – Aquarela ·
Residencial Pixinguinha – Rosa · Saudosa Praça Onze

### Em Obras (23)

Américas 19 · Arcos do Porto · Baía · Caminhos da Guanabara · Ciata Residencial ·
Completo Parque Brito III · Epicentro · Farol da Guanabara · Heitor dos Prazeres – Colombina ·
Heitor dos Prazeres – Pierrot · Mirante da Guanabara · My Jacarepaguá Life ·
My Jacarepaguá Mood · Nova Norte – Ginga · Nova Norte – Raízes · Orla Mauá ·
Residencial Cartola · Residencial Cartola II · Residencial Nova Olaria ·
Residencial Pixinguinha – Carinhoso · Residencial Porto Maravilha · Rio Branco 220 ·
The Pier Residencial

### Pronto para Morar (8)

Alto São Cristóvão · Completo Piedade · Connect Bonsucesso · Cury Bonsucesso ·
Parque Brito II · Pateo Nazareth · Rio Energy · Urban Zona Norte

---

## 4. 🟠 Os 20 em branco — precisam de resposta

Os vazios estão **espalhados** pela planilha (linhas 20, 32, 38, 40, 44, 45, 46, 50, 54, 56,
60, 62, 64, 65, 66, 75, 79, 90, 103, 105), não agrupados no fim. Ele percorreu a lista toda e
pulou esses de propósito — não é planilha abandonada no meio. Provavelmente significa
"talvez" ou "preciso checar".

**Prioridade alta — são Em Obras, e ele levou 23 dos outros 25:**

| Imóvel                      | Região         | Fotos/Plantas |
| --------------------------- | -------------- | ------------- |
| Metropolitan Dream          | Barra Olímpica | 18 / 10       |
| Residencial Quinta do Bispo | Rio Comprido   | 13 / 5        |

**Os outros 18** são todos Pronto para Morar em praça periférica — coerente com o que ele
recusou, então provavelmente são "não":

São Gonçalo (7): Bela Vista · Completo Guanabara · Completo São Gonçalo · Completo São
Gonçalo II · Dez Covanca · Meu Lar · Parque dos Sonhos · Viva Mais
Engenho Novo (4): Cury Completo · Cury Viva Mais · Mérito · Único
Maria Paula (3): Ecopark Floral Park · Water Park · Wood Park
Outros: Completo Zona Norte (Tomás Coelho) · Dez Portal (Belford Roxo) · Dez Rocha Miranda

---

## 5. 🟡 Lacunas de material nos selecionados

| Imóvel                | Problema                                        |
| --------------------- | ----------------------------------------------- |
| Origem Porto Imperial | **sem plantas** (tem 20 fotos) — e é Lançamento |
| Completo Piedade      | **sem fotos** (tem 3 plantas)                   |
| Urban Zona Norte      | **sem fotos** (tem 3 plantas)                   |

Sem foto não existe card no catálogo nem imagem de anúncio. Ou o corretor manda o material,
ou esses dois saem. Origem Porto Imperial sem planta é menos grave, mas planta converte muito
em lançamento.

---

## 6. Carga de imagens — bem melhor que o cenário total

|                                | Arquivos | Peso                   |
| ------------------------------ | -------- | ---------------------- |
| Acervo completo (105)          | 1.991    | 641 MB                 |
| **Selecionados (39)**          | 893      | **358,6 MB**           |
| Após teto de 12 fotos/imóvel   | 695      | ~279 MB                |
| **Após AVIF/WebP q78 @2000px** | 695      | **~60–90 MB estimado** |

624 fotos + 269 plantas nos 39. O teto de 12 fotos corta 198 arquivos sem perda real — a
maioria dos imóveis tem entre 10 e 28 fotos e as últimas são repetição de ângulo.

Cabe folgado no plano free do Sanity. **Meta de imagens: resolvida.**

---

## 7. O que ainda falta (Fase 0)

- [ ] Decisão sobre os 20 em branco — sobretudo Metropolitan Dream e Quinta do Bispo
- [ ] Imóveis novos que ele mandou no WhatsApp (nome + link Cury de cada)
- [ ] Fotos do Completo Piedade e do Urban Zona Norte, plantas do Origem Porto Imperial
- [ ] Faixa de preço "a partir de" dos 39
- [ ] Foto em alta e bio do corretor
- [ ] Confirmar e-mail (`.com` vs `.co`) e autorização de uso do material Cury
