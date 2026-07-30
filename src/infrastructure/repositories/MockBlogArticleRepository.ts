import type { BlogArticle } from "../../domain/entities/BlogArticle";
import type { IBlogArticleRepository } from "../../domain/repositories/IBlogArticleRepository";
import { mockBlogArticles } from "../data/mock-blog-articles";

/** Development-only article source. Replace with a CMS or content API in production. */
export class MockBlogArticleRepository implements IBlogArticleRepository {
  async getAll(): Promise<BlogArticle[]> {
    return [...mockBlogArticles].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
  }

  async getBySlug(slug: string): Promise<BlogArticle | null> {
    return mockBlogArticles.find((article) => article.slug === slug) ?? null;
  }
}
