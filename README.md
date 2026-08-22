# Cláudio Corretor

Site de captação de leads para imóveis Minha Casa Minha Vida no Grande Rio. A aplicação
reúne 40 empreendimentos, catálogo com filtros, páginas individuais com mapa/fotos/plantas,
CMS Sanity e integração preparada para Meta Pixel + Conversions API.

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
copy .env.example .env.local
npm run dev
```

O site abre em `http://localhost:3000` e o painel de conteúdo em
`http://localhost:3000/studio`.

## Variáveis obrigatórias

- `NEXT_PUBLIC_SITE_URL`: endereço público final do site.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET`: leitura do conteúdo.
- `SANITY_API_WRITE_TOKEN`: gravação dos leads.
- `SANITY_REVALIDATE_SECRET`: validação do webhook de publicação do Sanity.

Para anúncios no Meta, configurar também `NEXT_PUBLIC_META_PIXEL_ID` e
`META_CAPI_ACCESS_TOKEN`. Para avisos por e-mail, configurar as três variáveis do Resend
descritas em [.env.example](./.env.example).

## Verificação antes de publicar

```bash
npm run typecheck
npm run lint
npm run build
```

## Publicação

Importar o repositório na Vercel, copiar as variáveis de `.env.local` para o ambiente de
produção e trocar `NEXT_PUBLIC_SITE_URL` pela URL definitiva. Depois, cadastrar no Sanity o
webhook `https://SEU-DOMINIO/api/revalidate` com o segredo de revalidação.

As decisões, pendências externas e o estado detalhado do projeto ficam em
[CLAUDE.md](./CLAUDE.md).
