"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/application/dto/AuthFormDTO";
import { setSessionCookie } from "@/infrastructure/auth/session-cookie";
import { createSession, type SessionRole } from "@/infrastructure/auth/session-service";
import { verifyPassword } from "@/infrastructure/auth/password-hasher";
import { getDatabase } from "@/infrastructure/database/client";
import { passwordCredentials, securityEvents, users } from "@/infrastructure/database/schema";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? h.get("x-real-ip")
    ?? "127.0.0.1";
}

async function isLockedOut(userId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60 * 1000);
  const recent = await getDatabase()
    .select({ count: sql<number>`count(*)` })
    .from(securityEvents)
    .where(
      and(
        eq(securityEvents.userId, userId),
        eq(securityEvents.eventType, "login_failed"),
        gt(securityEvents.createdAt, cutoff),
      ),
    );
  return (recent[0]?.count ?? 0) >= MAX_FAILED_ATTEMPTS;
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const website = String(formData.get("website") ?? "");

  if (website) return { status: "success", message: "Permintaan diterima." };

  const ip = await clientIp();
  const rl = rateLimit(`login:${ip}`, 10);
  if (!rl.allowed) {
    return { status: "error", message: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

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

  if (account) {
    const locked = await isLockedOut(account.id);
    if (locked) {
      return { status: "error", message: "Email atau password tidak sesuai." };
    }
  }

  const isValid = account ? await verifyPassword(account.passwordHash, password) : false;

  if (!account || !isValid || account.status !== "active" || !account.emailVerifiedAt) {
    if (account) {
      await getDatabase().insert(securityEvents).values({
        userId: account.id,
        eventType: "login_failed",
        ipHash: ip,
      });
    }
    return { status: "error", message: "Email atau password tidak sesuai." };
  }

  const session = await createSession({
    userId: account.id,
    role: account.role as SessionRole,
    ipHash: ip,
  });
  await setSessionCookie(session);
  await getDatabase()
    .update(users)
    .set({ lastSignedInAt: new Date(), updatedAt: new Date() })
    .where(and(eq(users.id, account.id), eq(users.status, "active")));
  await getDatabase().insert(securityEvents).values({
    userId: account.id,
    eventType: "login_succeeded",
    ipHash: ip,
  });

  if (account.role === "admin" || account.role === "super_admin") redirect("/admin");
  if (account.role === "broker") redirect("/broker/dashboard");
  redirect("/dashboard");
}
