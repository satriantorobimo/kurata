import type { IContentSectionRepository } from "../../domain/repositories/IContentSectionRepository";
import { SUPPORT_CATEGORIES, type SupportCategory } from "../../domain/entities/SupportRequest";
import type { SupportCategoryDefinition, SupportFaq } from "../config/supportContent";

export interface SupportContent {
  categories: SupportCategoryDefinition[];
  faqs: SupportFaq[];
}

function isSupportCategory(value: string): value is SupportCategory {
  return (SUPPORT_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Use case: Retrieve help-center categories and FAQs from the content store.
 */
export class GetSupportContent {
  constructor(private readonly repository: IContentSectionRepository) {}

  async execute(): Promise<SupportContent> {
    const [categorySections, faqSections] = await Promise.all([
      this.repository.getBySection("faq-categories"),
      this.repository.getBySection("faqs"),
    ]);

    const categories: SupportCategoryDefinition[] = [];
    for (const section of categorySections) {
      const data = section.content as Record<string, unknown>;
      const id = String(data.id);
      if (!isSupportCategory(id)) continue;
      categories.push({
        id,
        title: String(data.title),
        description: String(data.description),
      });
    }

    const faqs: SupportFaq[] = [];
    for (const section of faqSections) {
      const data = section.content as Record<string, unknown>;
      const category = String(data.category);
      if (!isSupportCategory(category)) continue;
      faqs.push({
        id: String(data.id),
        category,
        question: String(data.question),
        answer: String(data.answer),
      });
    }

    return { categories, faqs };
  }
}
