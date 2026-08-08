import "server-only";

import { and, asc, eq } from "drizzle-orm";

import type { ContentSection, IContentSectionRepository } from "../../domain/repositories/IContentSectionRepository";
import { getDatabase } from "../database/client";
import { contentSections } from "../database/schema";

/** Page content sections stored as flexible JSON in the content schema. */
export class PostgresContentSectionRepository implements IContentSectionRepository {
  async getBySection(section: string): Promise<ContentSection[]> {
    const rows = await getDatabase()
      .select()
      .from(contentSections)
      .where(and(eq(contentSections.section, section), eq(contentSections.isPublished, true)))
      .orderBy(asc(contentSections.position));

    return rows.map((row) => ({
      id: row.id,
      content: row.content,
    }));
  }
}
