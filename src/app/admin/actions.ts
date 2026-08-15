"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDatabase } from "@/infrastructure/database/client";
import { forms, passwordCredentials, passwordResetTokens, properties, users } from "@/infrastructure/database/schema";
import { container } from "@/infrastructure/di/container";
import { createPasswordSetupToken } from "@/infrastructure/auth/password-setup";
import { sendBrokerPasswordSetupEmail } from "@/infrastructure/email/send-broker-onboarding-email";
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
  retryAfterSeconds?: number;
}

const PASSWORD_SETUP_RESEND_COOLDOWN_SECONDS = 120;

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

  let onboardingEmailFailed = false;
  if (approvingBroker) {
    const promotion = await container.cmsRepo.promoteBrokerFromApplication(
      formId,
      form.email,
      form.fullName,
      form.phone,
    );

    if (promotion.requiresPasswordSetup) {
      const token = await createPasswordSetupToken(promotion.userId);
      try {
        await sendBrokerPasswordSetupEmail(form.email, token, form.fullName);
      } catch (error) {
        onboardingEmailFailed = true;
        console.error("[broker-approval] Failed to send password setup email:", error);
      }
    }
  }

  revalidatePath("/admin");
  revalidatePath("/cms/forms");
  revalidatePath("/cms/users");

  return {
    ok: true,
    message: approvingBroker
      ? onboardingEmailFailed
        ? "Pengajuan mitra disetujui, tetapi email pembuatan password gagal dikirim. Periksa SMTP lalu buat ulang tautan akses."
        : "Pengajuan mitra disetujui. Email pembuatan password telah dikirim bila akun baru dibuat."
      : "Status pengajuan diperbarui.",
  };
}

export async function resendBrokerPasswordSetupEmail(formId: string): Promise<ReviewActionResult> {
  await requireRole("admin", "super_admin");

  const [form] = await getDatabase()
    .select({ formType: forms.formType, fullName: forms.fullName, email: forms.email, reviewStatus: forms.reviewStatus })
    .from(forms)
    .where(eq(forms.id, formId))
    .limit(1);

  if (!form || form.formType !== "broker_application" || form.reviewStatus !== "published") {
    return { ok: false, message: "Pengajuan mitra yang disetujui tidak ditemukan." };
  }

  const [user] = await getDatabase()
    .select({ id: users.id, role: users.role, mustChangePassword: passwordCredentials.mustChangePassword })
    .from(users)
    .innerJoin(passwordCredentials, eq(passwordCredentials.userId, users.id))
    .where(eq(users.email, form.email))
    .limit(1);

  if (!user || user.role !== "broker" || !user.mustChangePassword) {
    return { ok: false, message: "Akun ini sudah menggunakan password yang dibuat pengguna." };
  }

  const [latestToken] = await getDatabase()
    .select({ createdAt: passwordResetTokens.createdAt })
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, user.id))
    .orderBy(desc(passwordResetTokens.createdAt))
    .limit(1);

  if (latestToken) {
    const elapsedSeconds = Math.floor((Date.now() - latestToken.createdAt.getTime()) / 1000);
    const retryAfterSeconds = PASSWORD_SETUP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;
    if (retryAfterSeconds > 0) {
      return { ok: false, message: `Tunggu ${retryAfterSeconds} detik sebelum mengirim ulang akses akun.`, retryAfterSeconds };
    }
  }

  const token = await createPasswordSetupToken(user.id);
  try {
    await sendBrokerPasswordSetupEmail(form.email, token, form.fullName);
  } catch (error) {
    console.error("[broker-approval] Failed to resend password setup email:", error);
    return { ok: false, message: "Gagal mengirim email akses. Periksa konfigurasi SMTP." };
  }

  return { ok: true, message: "Email pembuatan password telah dikirim ulang.", retryAfterSeconds: PASSWORD_SETUP_RESEND_COOLDOWN_SECONDS };
}
