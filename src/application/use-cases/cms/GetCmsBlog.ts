import type { CmsBlogDetail, CmsBlogListItem } from "../../../infrastructure/repositories/PostgresCmsRepository";

/**
 * Use case: retrieve blog article lists and detail for the CMS.
 */
export class GetCmsBlogList {
  constructor(private readonly repository: { listBlogArticles(keyword: string, category: string): Promise<CmsBlogListItem[]> }) {}

  execute(keyword = "", category = ""): Promise<CmsBlogListItem[]> {
    return this.repository.listBlogArticles(keyword, category);
  }
}

export class GetCmsBlogDetail {
  constructor(private readonly repository: { getBlogBySlug(slug: string): Promise<CmsBlogDetail | null> }) {}

  execute(slug: string): Promise<CmsBlogDetail | null> {
    return this.repository.getBlogBySlug(slug);
  }
}