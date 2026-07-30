import type { BlogArticle } from "../../domain/entities/BlogArticle";
import type { IBlogArticleRepository } from "../../domain/repositories/IBlogArticleRepository";

export class GetBlogArticleBySlug {
  constructor(private readonly repository: IBlogArticleRepository) {}

  async execute(slug: string): Promise<BlogArticle | null> {
    return this.repository.getBySlug(slug);
  }
}
