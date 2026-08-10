"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import type { AuthFormState } from "@/application/dto/AuthFormDTO";
import { hashPassword } from "@/infrastructure/auth/password-hasher";
import { createOpaqueToken, hashOpaqueToken } from "@/infrastructure/auth/secure-token";
import { getDatabase } from "@/infrastructure/database/client";
import { emailVerificationTokens, passwordCredentials, securityEvents, userProfiles, userVerifications, users } from "@/infrastructure/database/schema";
import { sendVerificationEmail } from "@/infrastructure/email/send-verification-email";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOKEN_EXPIRY_HOURS = 24;

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? h.get("x-real-ip")
    ?? "127.0.0.1";
}

export async function register(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const ip = await clientIp();
  const rl = rateLimit(`register:${ip}`, 3);
  if (!rl.allowed) {
    return { status: "error", message: "Terlalu banyak permintaan. Silakan coba lagi nanti." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const emailRl = rateLimit(`register-email:${email}`, 2);
  if (!emailRl.allowed) {
    return { status: "success", message: "Jika email belum terdaftar, tautan verifikasi akan dikirim." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const acceptedTerms = formData.get("acceptedTerms") === "on";
  const website = String(formData.get("website") ?? "");

  if (website) return { status: "success", message: "Permintaan diterima." };

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (fullName.length < 2 || fullName.length > 100) fieldErrors.fullName = "Nama lengkap harus terdiri dari 2–100 karakter.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Masukkan alamat email yang valid.";
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 16) fieldErrors.phone = "Masukkan nomor WhatsApp yang valid.";
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) fieldErrors.password = "Gunakan minimal 8 karakter dengan huruf dan angka.";
  if (confirmPassword !== password) fieldErrors.confirmPassword = "Konfirmasi password tidak sama.";
  if (!acceptedTerms) fieldErrors.acceptedTerms = "Anda perlu menyetujui ketentuan pendaftaran.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali data pendaftaran Anda.", fieldErrors };
  }

  const database = getDatabase();
  const [existing] = await database.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { status: "success", message: "Jika email belum terdaftar, tautan verifikasi akan dikirim." };
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const [created] = await database
    .insert(users)
    .values({
      email,
      fullName,
      phone: phone || null,
      role: "user",
      status: "active",
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: users.id });

  await database.insert(passwordCredentials).values({
    userId: created.id,
    passwordHash,
    passwordChangedAt: now,
    mustChangePassword: false,
    createdAt: now,
    updatedAt: now,
  });
  await database.insert(userProfiles).values({ userId: created.id });
  await database.insert(userVerifications).values({ userId: created.id, status: "not_started" });
  await database.insert(securityEvents).values({ userId: created.id, eventType: "account_registered", ipHash: ip });

  const verificationToken = createOpaqueToken();
  const tokenHash = hashOpaqueToken(verificationToken);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await database.insert(emailVerificationTokens).values({
    userId: created.id,
    tokenHash,
    expiresAt,
    createdAt: now,
  });

  sendVerificationEmail(email, verificationToken, fullName).catch((err) =>
    console.error("[registration] Failed to send verification email:", err),
  );

  return {
    status: "success",
    message: "Akun berhasil dibuat. Kami telah mengirim email verifikasi ke alamat Anda. Silakan periksa kotak masuk dan klik tautan verifikasi untuk mengaktifkan akun.",
  };
}
