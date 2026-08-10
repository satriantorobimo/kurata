"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/application/dto/AuthFormDTO";
import { setSessionCookie } from "@/infrastructure/auth/session-cookie";
import { createSession, type SessionRole } from "@/infrastructure/auth/session-service";
import { verifyPassword } from "@/infrastructure/auth/password-hasher";
import { getDatabase } from "@/infrastructure/database/client";
import { passwordCredentials, securityEvents, users } from "@/infrastructure/database/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const website = String(formData.get("website") ?? "");

  if (website) return { status: "success", message: "Permintaan diterima." };

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Masukkan alamat email yang valid.";
  if (password.length < 8 || password.length > 128) fieldErrors.password = "Masukkan password yang valid.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali data yang Anda masukkan.", fieldErrors };
  }

  const [account] = await getDatabase()
    .select({
      id: users.id,
      role: users.role,
      status: users.status,
      emailVerifiedAt: users.emailVerifiedAt,
      passwordHash: passwordCredentials.passwordHash,
    })
    .from(users)
    .innerJoin(passwordCredentials, eq(passwordCredentials.userId, users.id))
    .where(eq(users.email, email))
    .limit(1);

  const isValid = account ? await verifyPassword(account.passwordHash, password) : false;

  if (!account || !isValid || account.status !== "active") {
    if (account) {
      await getDatabase().insert(securityEvents).values({
        userId: account.id,
        eventType: "login_failed",
      });
    }
    return { status: "error", message: "Email atau password tidak sesuai." };
  }

  if (!account.emailVerifiedAt) {
    return {
      status: "error",
      message: "Email Anda belum diverifikasi.",
      fieldErrors: { email: "email-belum-diverifikasi" },
    };
  }

  const canSignIn = Boolean(account && isValid && account.status === "active" && account.emailVerifiedAt);

  if (!canSignIn || !account) {
    if (account) {
      await getDatabase().insert(securityEvents).values({
        userId: account.id,
        eventType: "login_failed",
      });
    }
    return { status: "error", message: "Email atau password tidak sesuai." };
  }

  const session = await createSession({
    userId: account.id,
    role: account.role as SessionRole,
  });
  await setSessionCookie(session);
  await getDatabase()
    .update(users)
    .set({ lastSignedInAt: new Date(), updatedAt: new Date() })
    .where(and(eq(users.id, account.id), eq(users.status, "active")));
  await getDatabase().insert(securityEvents).values({
    userId: account.id,
    eventType: "login_succeeded",
  });

  if (account.role === "admin" || account.role === "super_admin") redirect("/admin");
  if (account.role === "broker") redirect("/broker/dashboard");
  redirect("/dashboard");
}
