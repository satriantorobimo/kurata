export const BLOG_CATEGORIES = [
  "panduan-tanah",
  "investasi",
  "legalitas",
  "wawasan-pasar",
  "pemilik-broker",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
  callout?: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  coverImageUrl: string;
  coverImageAlt: string;
  isFeatured: boolean;
  relatedSlugs: string[];
  sections: BlogSection[];
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  "panduan-tanah": "Panduan Tanah",
  investasi: "Investasi",
  legalitas: "Legalitas & Dokumen",
  "wawasan-pasar": "Wawasan Pasar",
  "pemilik-broker": "Pemilik & Broker",
};

export function isBlogCategory(value: string | undefined): value is BlogCategory {
  return Boolean(value && BLOG_CATEGORIES.includes(value as BlogCategory));
}
