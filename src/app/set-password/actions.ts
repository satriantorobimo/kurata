"use server";

import { and, eq, gt, isNull } from "drizzle-orm";

import { hashPassword } from "@/infrastructure/auth/password-hasher";
import { hashOpaqueToken } from "@/infrastructure/auth/secure-token";
import { getDatabase } from "@/infrastructure/database/client";
import { passwordCredentials, passwordResetTokens, users } from "@/infrastructure/database/schema";

export interface SetPasswordState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: { password?: string; confirmPassword?: string };
}

export async function setPassword(
  _previousState: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const fieldErrors: NonNullable<SetPasswordState["fieldErrors"]> = {};

  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    fieldErrors.password = "Gunakan minimal 8 karakter dengan huruf dan angka.";
  }
  if (confirmPassword !== password) fieldErrors.confirmPassword = "Konfirmasi password tidak sama.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali password Anda.", fieldErrors };
  }
  if (token.length < 10) return { status: "error", message: "Tautan pembuatan password tidak valid." };

  try {
    const database = getDatabase();
    const now = new Date();
    const passwordHash = await hashPassword(password);

    const result = await database.transaction(async (trx) => {
    const [resetToken] = await trx
      .update(passwordResetTokens)
      .set({ consumedAt: now })
      .where(and(
        eq(passwordResetTokens.tokenHash, hashOpaqueToken(token)),
        isNull(passwordResetTokens.consumedAt),
        gt(passwordResetTokens.expiresAt, now),
      ))
      .returning({ userId: passwordResetTokens.userId });

    if (!resetToken) return false;

    await trx
      .update(passwordCredentials)
      .set({ passwordHash, passwordChangedAt: now, mustChangePassword: false, updatedAt: now })
      .where(eq(passwordCredentials.userId, resetToken.userId));

    await trx
      .update(users)
      .set({ emailVerifiedAt: now, updatedAt: now })
      .where(eq(users.id, resetToken.userId));

    return true;
    });

    if (!result) {
      return { status: "error", message: "Tautan pembuatan password tidak valid atau sudah kedaluwarsa." };
    }

    return { status: "success", message: "Password berhasil dibuat. Anda sekarang dapat masuk ke dashboard Mitra Kurata." };
  } catch (error) {
    console.error("[set-password] Failed to set password:", error);
    return { status: "error", message: "Password belum dapat disimpan. Silakan coba lagi atau minta admin mengirim ulang akses akun." };
  }
}
