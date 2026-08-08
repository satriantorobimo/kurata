"use server";

import { eq } from "drizzle-orm";

import type { AuthFormState } from "@/application/dto/AuthFormDTO";
import { hashPassword } from "@/infrastructure/auth/password-hasher";
import { getDatabase } from "@/infrastructure/database/client";
import { passwordCredentials, securityEvents, userProfiles, userVerifications, users } from "@/infrastructure/database/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
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
    return { status: "error", fieldErrors: { email: "Email sudah terdaftar. Gunakan email lain atau masuk ke akun Anda." } };
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
      emailVerifiedAt: now,
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
  await database.insert(securityEvents).values({ userId: created.id, eventType: "account_registered" });

  return {
    status: "success",
    message: "Akun berhasil dibuat. Silakan masuk dengan email dan password Anda.",
  };
}
