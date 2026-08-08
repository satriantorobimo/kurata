export type ReviewStatus = "pending" | "under_review" | "verified" | "changes_requested" | "rejected" | "published" | "draft";

export interface ReviewAttachment {
  id: string;
  name: string;
  type: "photo" | "certificate" | "document";
  status: "complete" | "needs_review" | "missing";
  note: string;
  previewUrl?: string;
}

export interface ReviewRecord {
  id: string;
  entityId?: string;
  name: string;
  email?: string;
  subtitle: string;
  submittedAt: string;
  status: ReviewStatus;
  details: string[];
  attachments?: ReviewAttachment[];
}
