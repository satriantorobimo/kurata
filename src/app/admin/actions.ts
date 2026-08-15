"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDatabase } from "@/infrastructure/database/client";
import { forms, properties } from "@/infrastructure/database/schema";
import { container } from "@/infrastructure/di/container";
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

  const database = getDatabase();
  const [form] = await database
    .select({
      formType: forms.formType,
      fullName: forms.fullName,
      email: forms.email,
      phone: forms.phone,
      reviewStatus: forms.reviewStatus,
    })
    .from(forms)
    .where(eq(forms.id, formId))
    .limit(1);

  if (!form) {
    return { ok: false, message: "Pengajuan tidak ditemukan." };
  }

  const approvingBroker = form.formType === "broker_application"
    && form.reviewStatus !== "published"
    && status === "published";

  await database
    .update(forms)
    .set({ reviewStatus: status })
    .where(eq(forms.id, formId));

  if (approvingBroker) {
    await container.cmsRepo.promoteBrokerFromApplication(
      formId,
      form.email,
      form.fullName,
      form.phone,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/cms/forms");
  revalidatePath("/cms/users");

  return {
    ok: true,
    message: approvingBroker
      ? "Pengajuan mitra disetujui dan akun broker telah dibuat."
      : "Status pengajuan diperbarui.",
  };
}
