import type { AdminReviewData } from "../../infrastructure/repositories/PostgresAdminRepository";
import type { ReviewRecord, ReviewStatus } from "../config/adminDemoData";

/**
 * Use case: retrieve admin review queues derived from real persisted data.
 */
export class GetAdminReviewData {
  constructor(private readonly repository: { getReviewData(): Promise<AdminReviewData> }) {}

  async execute(): Promise<{
    users: ReviewRecord[];
    brokers: ReviewRecord[];
    assets: ReviewRecord[];
    content: ReviewRecord[];
  }> {
    const data = await this.repository.getReviewData();

    return {
      users: data.users.map(toReviewRecord),
      brokers: data.brokers.map(toReviewRecord),
      assets: data.assets.map(toReviewRecord),
      content: data.content.map(toReviewRecord),
    };
  }
}

function toReviewRecord(
  item: {
    id: string;
    entityId: string;
    name: string;
    email?: string;
    subtitle: string;
    submittedAt: string;
    status: string;
    details: string[];
  },
): ReviewRecord {
  return {
    id: item.id,
    entityId: item.entityId,
    name: item.name,
    email: item.email,
    subtitle: item.subtitle,
    submittedAt: item.submittedAt,
    status: item.status as ReviewStatus,
    details: item.details,
  };
}
