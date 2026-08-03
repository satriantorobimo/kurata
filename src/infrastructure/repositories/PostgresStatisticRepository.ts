import "server-only";

import { asc, eq } from "drizzle-orm";

import { Statistic } from "../../domain/entities/Statistic";
import type { IStatisticRepository } from "../../domain/repositories/IStatisticRepository";
import { getDatabase } from "../database/client";
import { siteStatistics } from "../database/schema";

/** Public site statistics maintained in the content schema. */
export class PostgresStatisticRepository implements IStatisticRepository {
  async getAll(): Promise<Statistic[]> {
    const rows = await getDatabase()
      .select()
      .from(siteStatistics)
      .where(eq(siteStatistics.isPublished, true))
      .orderBy(asc(siteStatistics.displayOrder));

    return rows.map((row) => Statistic.create({
      id: row.id,
      label: row.label,
      value: row.value,
      icon: row.icon,
    }));
  }
}
