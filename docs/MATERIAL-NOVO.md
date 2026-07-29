# Material novo enviado pelo corretor — 28/07/2026

Origem: `C:\Users\Administrator\Documents\uguyg\` — 37 arquivos, 91 MB.
Exportação de WhatsApp, com duplicatas e extensões erradas.

---

## 1. 🔴 O projeto deixou de ser só Cury

Este é o achado que muda a arquitetura. O material novo traz **três construtoras além da Cury**:

| Construtora                | Empreendimento          | Cidade      | Material disponível                    |
| -------------------------- | ----------------------- | ----------- | -------------------------------------- |
| **JV** (Jerônimo da Veiga) | Conceito Califórnia     | Nova Iguaçu | ✅ Book 37 pág. + 12 fotos do decorado |
| **Direcional**             | Conquista Parque Iguaçu | Nova Iguaçu | ✅ Book 32 pág. com plantas            |
| **Construtora Você RJ**    | Nova York               | ?           | ⚠️ só tabela de vendas interna         |
| **Construtora Você RJ**    | Recanto das Águas       | ?           | ❌ nenhum                              |
| **Construtora Você RJ**    | Nova Zelândia           | ?           | ❌ nenhum                              |
| **Rebouças Residencial**   | Rebouças                | ?           | ❌ só links do Google Drive            |

Fontes: `linktr.ee/construtoravocerj` (Você RJ — "35 anos, +7 mil imóveis entregues",
`construtoravoce.com.br`) e `linktr.ee/Reboucas_Residencial`.

**Consequências diretas:**

1. O schema precisa de um document type **`construtora`** (nome, logo, slug) referenciado pelo
   `imovel` — e vira **filtro** no catálogo.
2. A tese "vitrine de Porto Maravilha" registrada em `SELECAO-CORRETOR.md` §2 fica
   **incompleta**: o portfólio real é _Cury no Porto/Centro_ **+** _lançamentos em Nova Iguaçu_.
3. Ironia útil: ele recusou os imóveis **Cury** de Nova Iguaçu na planilha, mas está
   empurrando **JV e Direcional** em Nova Iguaçu. É relação comercial, não região.
4. A escolha de CMS (Fase 3) se confirma — imóveis sem scrape entram à mão pelo Studio.
5. O pipeline da Fase 4 (`01-normalize-scrape.ts`) cobre **só a Cury**. Os novos são
   cadastro manual, alimentado pelos books.

---

## 2. ✅ A qualidade do material novo é melhor do que você imaginava

Preocupação levantada: _"a qualidade do conteúdo não chega nem perto do que extraí da Cury."_
Os números dizem o contrário:

| Fonte                          | Resolução       | Formato          |
| ------------------------------ | --------------- | ---------------- |
| Fotos do scrape da Cury        | **1440 × 900**  | WebP, 400–900 KB |
| Renders dentro dos books novos | **1920 × 1080** | JPEG embutido    |

Os books trazem **40 renders Full HD** (Conceito Califórnia) e **42** (Conquista Parque
Iguaçu), extraíveis na resolução nativa direto do PDF — sem re-renderizar página, sem perda.
São renders profissionais de agência: fachada, piscina, salão de festas, churrasqueira,
miniquadra, playground, pet place, fitness, plantas humanizadas.

**É material melhor que o da Cury.** O que falta não é qualidade, é _cobertura_ — três
empreendimentos ainda sem nada.

---

## 3. Fichas técnicas extraídas

### Conceito Califórnia — JV (Jerônimo da Veiga)

- **Endereço:** Rua Carlos Laert, 35 — Vila Nova, Nova Iguaçu/RJ
- Terreno 14.325 m² · 6 blocos · 15 pavimentos por bloco
- **900 unidades** · 502 vagas (até 1 por unidade)
- **2 quartos com varanda** · apto tipo 45,6 m² · 60 Gardens de até 124,4 m²
- Lazer: complexo aquático, quadra poliesportiva, beach tennis, fitness interno e externo,
  churrasqueira coberta e americana, salão de festas, mini mercado, pet place, car wash,
  playground baby e kids, horta, bicicletário
- Slogan: _"Aqui é onde a vida acontece"_ · identidade neon roxo/amarelo/ciano
- ⚠️ Data de lançamento no book está como **`xx/xx`** — não definida

### Conquista Parque Iguaçu — Direcional

- Nova Iguaçu · terreno 34.880,26 m²
- **8 torres** · 5 pavimentos · 8 e 12 apartamentos por andar
- **440 unidades** · 294 vagas
- **1 e 2 quartos** com lazer integrado ao verde
- Plantas: Tipo Ponta 41,19 m² · Tipo Meio 41,27 m² · Garden Ponta 53,90 m² ·
  Garden Meio 56,47 m² · Studio/PCD 56,72 m²
- Lazer: guarita, bicicletário, salão de festas com varanda, churrasqueiras com varandas,
  piscina adulto com deck molhado, piscina infantil, redário, miniquadra, playground,
  praça de jogos, fitness externo, piquenique, espaço pet
- ⚠️ O PDF contém uma **nota interna não removida**: _"Temos que atualizar com a revista que
  a Jess mandou."_ — material ainda em rascunho, confirmar versão final antes de publicar

### Nova York — Construtora Você RJ

Só existe a tabela de vendas. Dela dá para extrair, sem tocar em preço:

- Tipologias **1Q e 2Q** · área privativa **43,22 m²** · vaga rotativa · 5 pavimentos

---

## 4. 🔴 Não publicar: `NOVA YORK TABELA DE VENDAS JULHO 2026`

É **material comercial interno**, unidade por unidade: valor de avaliação CAIXA, desconto,
VGV, financiamento + FGTS + subsídio, sinal, percentual e valor de pró-soluto, número de
parcelas.

Nunca vai para o site, nem como imagem, nem como PDF para download. Serve só para o corretor
responder no WhatsApp. A decisão de exibir **"Consulte condições"** em vez de preço já cobre
isso — mas fica registrado porque o arquivo está na pasta e é fácil alguém subir sem pensar.

---

## 5. Inventário dos arquivos

**37 arquivos → 26 únicos.** Onze duplicatas do WhatsApp (aquele padrão `nome 2.jpg`,
`nome 3.jpg`).

| Tipo        | Total | Únicos |
| ----------- | ----- | ------ |
| Fotos JPEG  | 22    | **17** |
| Vídeos MP4  | 10    | **4**  |
| PDFs        | 5     | **4**  |
| TXT (links) | 4     | 2 URLs |

### Fotos (17 únicas)

- **12 do apartamento decorado do Conceito Califórnia** — 960×1280, retrato, marca d'água
  `CONCEITO CALIFÓRNIA` + logo `JV`. Cobrem sala/jantar, cozinha, quarto casal, quarto
  infantil com beliche, banheiro, varanda. Boa qualidade.
- **5 aéreas de drone de canteiro de obra** — 1600×902, sem marca. ⚠️ **Não dá para saber de
  qual empreendimento são.** Precisa perguntar. Duas mostram conjunto quase pronto, uma mostra
  obra ativa com guindaste.

### Vídeos (4 únicos) — 🟡 qualidade fraca

| Arquivo              | Resolução   | Duração |
| -------------------- | ----------- | ------- |
| `VIDEO-...-15 2.mp4` | 1024×576    | 11,6 s  |
| `VIDEO-...-15.mp4`   | 1024×576    | 21,1 s  |
| `VIDEO-...-16.mp4`   | 1024×576    | 17,6 s  |
| `VIDEO-...-30.mp4`   | **480×864** | 70,7 s  |

1024×576 fica abaixo de HD e o vertical de 480×864 é ruim. Vídeo pixelado passa impressão
pior que ausência de vídeo. Recomendação: subir os três horizontais no YouTube como não
listados e embutir com _facade_ (thumbnail estática que só carrega o player no clique, para
não derrubar o Lighthouse). O vertical de 480p fica de fora, ou só como story no Instagram.

### Foto do corretor — 🟡 `corretor.jpg`

- **A extensão mente:** o arquivo é **AVIF**, não JPEG. O pipeline precisa detectar por
  assinatura (`ftyp`), não por extensão.
- 540 × 1204, apenas 17 KB. Retrato formal, terno escuro e camisa azul, fundo de porta clara.
- Serve para avatar e para um retrato médio na seção "Sobre". **Não serve** para hero de
  página inteira nem para corte largo — falta resolução.
- Vale pedir uma foto melhor. Se não vier, o design contorna: recorte vertical, tratamento
  de fundo e uso em tamanho contido.

---

## 6. Bio oficial do corretor

> Ajudo famílias a realizar o sonho da casa própria. Empreendimentos do programa Minha Casa
> Minha Vida com parcelas que cabem no seu bolso, lazer completo e localização privilegiada
> no Rio de Janeiro.

Recebida sem acentuação; acentos restaurados acima. Usar esta versão.

Ela fixa o posicionamento: **MCMV, parcela acessível, família**. Isso conversa bem com os
lançamentos de Nova Iguaçu e com boa parte do portfólio Cury — e deve guiar o tom da home e
dos criativos do Meta.

---

## 7. O que ainda falta pedir

- [ ] **De qual empreendimento são as 5 fotos aéreas de obra?**
- [ ] Material de **Recanto das Águas** e **Nova Zelândia** (Você RJ)
- [ ] Material do **Rebouças Residencial** — os arquivos estão no Google Drive do linktree,
      precisam ser baixados e enviados
- [ ] **Nova York**: onde fica, e book/fotos (só temos a tabela interna)
- [ ] Confirmar se o book da Direcional já é a **versão final** (tem nota de rascunho)
- [ ] Data de lançamento do Conceito Califórnia (está `xx/xx`)
- [ ] Foto do corretor em resolução maior, se possível
- [ ] Autorização de uso do material de marca de JV, Direcional e Você RJ
