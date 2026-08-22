import { buscarImoveis, buscarRegioes } from "@/lib/sanity/fetch";
import { site } from "@/lib/site";

export async function GET() {
  const [imoveis, regioes] = await Promise.all([buscarImoveis(), buscarRegioes()]);

  const conteudo = [
    `# ${site.nome}`,
    "",
    `> Site oficial de ${site.nome}, ${site.creci}, especializado em apartamentos Minha Casa Minha Vida, lançamentos e imóveis prontos no Rio de Janeiro e região.`,
    "",
    `${site.bio} O site não publica preços: valores, entrada, subsídio e disponibilidade devem ser confirmados diretamente com o corretor.`,
    "",
    `Contato: WhatsApp ${site.whatsappExibicao}; e-mail ${site.email}; Instagram ${site.instagramHandle}.`,
    "",
    "## Páginas principais",
    "",
    `- [Página inicial](${site.url}): apresentação do corretor, imóveis em destaque, processo de compra e perguntas frequentes.`,
    `- [Catálogo de imóveis](${site.url}/imoveis): lista completa com filtros por região, quartos, construtora e estágio da obra.`,
    `- [Política de privacidade](${site.url}/privacidade): tratamento dos dados enviados pelos formulários.`,
    "",
    "## Imóveis por região",
    "",
    ...regioes.map(
      (regiao) =>
        `- [Apartamentos em ${regiao.nome}](${site.url}/imoveis/${regiao.slug}): ${regiao.total ?? 0} empreendimento${regiao.total === 1 ? "" : "s"} disponível${regiao.total === 1 ? "" : "is"}.`,
    ),
    "",
    "## Empreendimentos",
    "",
    ...imoveis.map(
      (imovel) =>
        `- [${imovel.nome}](${site.url}/imovel/${imovel.slug}): ${imovel.chamada ?? `apartamentos em ${imovel.regiao.nome}`}. Consulte condições e disponibilidade.`,
    ),
    "",
    "## Canais oficiais",
    "",
    `- [WhatsApp do Cláudio](https://api.whatsapp.com/send?phone=${site.whatsapp}): atendimento direto sobre financiamento, subsídio e disponibilidade.`,
    `- [Instagram do Cláudio](${site.instagram}): perfil oficial do corretor.`,
  ].join("\n");

  return new Response(conteudo, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, s-maxage=900, stale-while-revalidate=86400",
    },
  });
}
