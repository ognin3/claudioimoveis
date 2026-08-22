import type { MetadataRoute } from "next";
import { buscarRegioes, buscarSlugsImoveis } from "@/lib/sanity/fetch";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, regioes] = await Promise.all([buscarSlugsImoveis(), buscarRegioes()]);
  const agora = new Date();

  return [
    {
      url: site.url,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/imoveis`,
      lastModified: agora,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${site.url}/sobre`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/contato`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...slugs.map((slug) => ({
      url: `${site.url}/imovel/${slug}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...regioes.map((regiao) => ({
      url: `${site.url}/imoveis/${regiao.slug}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    {
      url: `${site.url}/privacidade`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
