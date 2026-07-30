import type { BlogArticle } from "../entities/BlogArticle";

export interface IBlogArticleRepository {
  getAll(): Promise<BlogArticle[]>;
  getBySlug(slug: string): Promise<BlogArticle | null>;
}
