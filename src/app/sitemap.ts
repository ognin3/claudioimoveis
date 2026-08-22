import type { MetadataRoute } from "next";
import { buscarSlugsImoveis } from "@/lib/sanity/fetch";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await buscarSlugsImoveis();
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
    ...slugs.map((slug) => ({
      url: `${site.url}/imovel/${slug}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/privacidade`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
