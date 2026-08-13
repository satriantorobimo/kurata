import type { MetadataRoute } from "next";
import { GetBlogArticles } from "@/application/use-cases/GetBlogArticles";
import { container } from "@/infrastructure/di/container";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [propertyIds, investmentPropertyIds, articles] = await Promise.all([
    container.propertyRepo.getAllIds("common"),
    container.propertyRepo.getAllIds("business_potential"),
    new GetBlogArticles(container.blogArticleRepo).execute(),
  ]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/cari-tanah"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/investasi"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/layanan"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/untuk-broker"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/bantuan"), changeFrequency: "monthly", priority: 0.5 },
  ];
  return [
    ...staticPages,
    ...propertyIds.map((id) => ({ url: absoluteUrl(`/cari-tanah/${id}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...investmentPropertyIds.map((id) => ({ url: absoluteUrl(`/investasi/${id}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...articles.map((article) => ({ url: absoluteUrl(`/blog/${article.slug}`), lastModified: article.updatedAt ?? article.publishedAt, changeFrequency: "monthly" as const, priority: 0.7, images: [article.coverImageUrl] })),
  ];
}
