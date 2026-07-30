import type { BlogArticle } from "../../domain/entities/BlogArticle";
import type { IBlogArticleRepository } from "../../domain/repositories/IBlogArticleRepository";

export class GetBlogArticles {
  constructor(private readonly repository: IBlogArticleRepository) {}

  async execute(): Promise<BlogArticle[]> {
    return this.repository.getAll();
  }
}
