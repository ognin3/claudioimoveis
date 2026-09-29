import type { MetadataRoute } from "next";
import { buscarDocumentosSitemap } from "@/lib/sanity/fetch";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { imoveis, regioes } = await buscarDocumentosSitemap();

  return [
    {
      url: site.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/imoveis`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${site.url}/sobre`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/contato`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...imoveis.map((imovel) => ({
      url: `${site.url}/imovel/${imovel.slug}`,
      lastModified: imovel._updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...regioes.map((regiao) => ({
      url: `${site.url}/imoveis/${regiao.slug}`,
      lastModified: regiao._updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}
