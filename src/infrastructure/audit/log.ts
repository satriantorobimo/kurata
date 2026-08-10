import "server-only";

import { getDatabase } from "@/infrastructure/database/client";
import { auditEvents } from "@/infrastructure/database/schema";

export interface AuditEntry {
  actorUserId: string;
  subjectUserId?: string;
  eventType: string;
  entityType: string;
  entityId?: string;
  metadata?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await getDatabase().insert(auditEvents).values({
      actorUserId: entry.actorUserId,
      subjectUserId: entry.subjectUserId ?? null,
      eventType: entry.eventType,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      metadata: entry.metadata ?? null,
    });
  } catch {
    // audit failure must never break the business operation
  }
}
