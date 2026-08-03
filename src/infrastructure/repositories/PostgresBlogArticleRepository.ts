import "server-only";

import { asc, desc, eq, inArray } from "drizzle-orm";

import { isBlogCategory, type BlogArticle, type BlogSection } from "../../domain/entities/BlogArticle";
import type { IBlogArticleRepository } from "../../domain/repositories/IBlogArticleRepository";
import { getDatabase } from "../database/client";
import { blogArticles, blogRelatedArticles, blogSections } from "../database/schema";

type ArticleRow = typeof blogArticles.$inferSelect;

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mapArticle(
  row: ArticleRow,
  sections: BlogSection[],
  relatedSlugs: string[],
): BlogArticle {
  if (!isBlogCategory(row.category)) {
    throw new Error(`Invalid blog category for article ${row.slug}.`);
  }

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    publishedAt: toDateString(row.publishedAt),
    updatedAt: row.updatedAt ? toDateString(row.updatedAt) : undefined,
    readingMinutes: row.readingMinutes,
    coverImageUrl: row.coverImageUrl,
    coverImageAlt: row.coverImageAlt,
    isFeatured: row.isFeatured,
    sections,
    relatedSlugs,
  };
}

/** Published blog content from PostgreSQL; drafts never reach public pages. */
export class PostgresBlogArticleRepository implements IBlogArticleRepository {
  async getAll(): Promise<BlogArticle[]> {
    const database = getDatabase();
    const articles = await database
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.isPublished, true))
      .orderBy(desc(blogArticles.publishedAt));

    return this.withContent(articles);
  }

  async getBySlug(slug: string): Promise<BlogArticle | null> {
    const [article] = await getDatabase()
      .select()
      .from(blogArticles)
      .where(eq(blogArticles.slug, slug));

    if (!article || !article.isPublished) return null;

    const [result] = await this.withContent([article]);
    return result ?? null;
  }

  private async withContent(articles: ArticleRow[]): Promise<BlogArticle[]> {
    if (articles.length === 0) return [];

    const database = getDatabase();
    const slugs = articles.map((article) => article.slug);
    const [sectionRows, relatedRows] = await Promise.all([
      database.select().from(blogSections).where(inArray(blogSections.articleSlug, slugs)).orderBy(asc(blogSections.articleSlug), asc(blogSections.position)),
      database.select().from(blogRelatedArticles).where(inArray(blogRelatedArticles.articleSlug, slugs)).orderBy(asc(blogRelatedArticles.articleSlug), asc(blogRelatedArticles.position)),
    ]);
    const sectionsByArticle = new Map<string, BlogSection[]>();
    const relatedByArticle = new Map<string, string[]>();

    for (const row of sectionRows) {
      const sections = sectionsByArticle.get(row.articleSlug) ?? [];
      sections.push({ heading: row.heading, paragraphs: row.paragraphs, points: row.points ?? undefined, callout: row.callout ?? undefined });
      sectionsByArticle.set(row.articleSlug, sections);
    }
    for (const row of relatedRows) {
      const related = relatedByArticle.get(row.articleSlug) ?? [];
      related.push(row.relatedSlug);
      relatedByArticle.set(row.articleSlug, related);
    }

    return articles.map((article) => mapArticle(article, sectionsByArticle.get(article.slug) ?? [], relatedByArticle.get(article.slug) ?? []));
  }
}
