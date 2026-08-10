"use server";

import { and, eq, gt, isNull } from "drizzle-orm";

import { getDatabase } from "@/infrastructure/database/client";
import { emailVerificationTokens, users } from "@/infrastructure/database/schema";
import { hashOpaqueToken, createOpaqueToken } from "@/infrastructure/auth/secure-token";
import { sendVerificationEmail } from "@/infrastructure/email/send-verification-email";

const TOKEN_EXPIRY_HOURS = 24;

export interface VerificationResult {
  ok: boolean;
  message: string;
}

export async function verifyEmailTokenAction(token: string): Promise<VerificationResult> {
  if (!token || token.length < 10) {
    return { ok: false, message: "Tautan verifikasi tidak valid." };
  }

  const database = getDatabase();
  const tokenHash = hashOpaqueToken(token);
  const now = new Date();

  const [record] = await database
    .select({ id: emailVerificationTokens.id, userId: emailVerificationTokens.userId })
    .from(emailVerificationTokens)
    .where(
      and(
        eq(emailVerificationTokens.tokenHash, tokenHash),
        isNull(emailVerificationTokens.consumedAt),
        gt(emailVerificationTokens.expiresAt, now),
      ),
    )
    .limit(1);

  if (!record) {
    return { ok: false, message: "Tautan verifikasi tidak valid atau sudah kedaluwarsa. Silakan daftar ulang atau minta tautan baru." };
  }

  await database.transaction(async (trx) => {
    await trx
      .update(emailVerificationTokens)
      .set({ consumedAt: now })
      .where(eq(emailVerificationTokens.id, record.id));

    await trx
      .update(users)
      .set({ emailVerifiedAt: now, updatedAt: now })
      .where(eq(users.id, record.userId));
  });

  return { ok: true, message: "Email berhasil diverifikasi. Anda sekarang dapat masuk ke akun Kurata." };
}

export async function resendVerificationEmailAction(email: string): Promise<VerificationResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false, message: "Masukkan alamat email yang valid." };
  }

  const database = getDatabase();
  const [user] = await database
    .select({ id: users.id, fullName: users.fullName, emailVerifiedAt: users.emailVerifiedAt })
    .from(users)
    .where(eq(users.email, cleanEmail))
    .limit(1);

  if (!user || user.emailVerifiedAt) {
    return { ok: true, message: "Jika email terdaftar dan belum diverifikasi, tautan verifikasi akan dikirim." };
  }

  const now = new Date();

  await database
    .update(emailVerificationTokens)
    .set({ consumedAt: now })
    .where(
      and(
        eq(emailVerificationTokens.userId, user.id),
        isNull(emailVerificationTokens.consumedAt),
      ),
    );

  const verificationToken = createOpaqueToken();
  const tokenHash = hashOpaqueToken(verificationToken);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await database.insert(emailVerificationTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
    createdAt: now,
  });

  try {
    await sendVerificationEmail(cleanEmail, verificationToken, user.fullName);
  } catch {
    return { ok: false, message: "Gagal mengirim email verifikasi. Silakan coba lagi nanti." };
  }

  return { ok: true, message: "Email verifikasi telah dikirim ulang. Silakan periksa kotak masuk Anda." };
}
