/**
 * Repository contract for content sections.
 * Content sections hold flexible JSON payloads for page sections that are
 * managed outside code (service catalog, FAQs, investment analysis, etc.).
 */
export interface ContentSection {
  id: string;
  content: unknown;
}

export interface IContentSectionRepository {
  getBySection(section: string): Promise<ContentSection[]>;
}
