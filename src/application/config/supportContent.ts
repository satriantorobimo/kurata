import type { SupportCategory } from "../../domain/entities/SupportRequest";

export interface SupportCategoryDefinition {
  id: SupportCategory;
  title: string;
  description: string;
}

export interface SupportFaq {
  id: string;
  category: SupportCategory;
  question: string;
  answer: string;
}
