"use server";

import { eq } from "drizzle-orm";

import { getDatabase } from "@/infrastructure/database/client";
import { forms, properties } from "@/infrastructure/database/schema";
import { requireRole } from "@/infrastructure/security/authorization-dal";

export type ReviewStatus =
  | "pending"
  | "under_review"
  | "changes_requested"
  | "rejected"
  | "published"
  | "draft";

const REVIEW_STATUSES: ReviewStatus[] = ["pending", "under_review", "changes_requested", "rejected", "published", "draft"];

function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as string[]).includes(value);
}

export interface ReviewActionResult {
  ok: boolean;
  message: string;
}

export async function updateAssetReviewStatus(propertyId: string, status: string): Promise<ReviewActionResult> {
  await requireRole("admin", "super_admin");

  if (!isReviewStatus(status)) {
    return { ok: false, message: "Status tidak valid." };
  }

  await getDatabase()
    .update(properties)
    .set({
      reviewStatus: status,
      isPublished: status === "published",
      updatedAt: new Date(),
    })
    .where(eq(properties.id, propertyId));

  return { ok: true, message: "Status aset diperbarui." };
}

export async function updateFormReviewStatus(formId: string, status: string): Promise<ReviewActionResult> {
  await requireRole("admin", "super_admin");

  if (!isReviewStatus(status)) {
    return { ok: false, message: "Status tidak valid." };
  }

  await getDatabase()
    .update(forms)
    .set({ reviewStatus: status })
    .where(eq(forms.id, formId));

  return { ok: true, message: "Status pengajuan diperbarui." };
}
