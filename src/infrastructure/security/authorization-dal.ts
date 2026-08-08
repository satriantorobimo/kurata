import "server-only";

import { and, eq, gt, isNull } from "drizzle-orm";

import { getSessionCookie } from "@/infrastructure/auth/session-cookie";
import { hashOpaqueToken } from "@/infrastructure/auth/secure-token";
import { getDatabase } from "@/infrastructure/database/client";
import { sessions, users } from "@/infrastructure/database/schema";

export type KurataRole = "user" | "broker" | "admin" | "super_admin";

export interface AuthContext {
  sessionId: string;
  userId: string;
  role: KurataRole;
  email: string;
  authenticatedAt: Date;
  mfaCompletedAt: Date | null;
}

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication is required.");
  }
}

export class AuthorizationDeniedError extends Error {
  constructor() {
    super("You are not allowed to perform this action.");
  }
}

export async function getCurrentAuthContext(): Promise<AuthContext | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const now = new Date();
  const [result] = await getDatabase()
    .select({
      sessionId: sessions.id,
      userId: users.id,
      role: users.role,
      email: users.email,
      authenticatedAt: sessions.authenticatedAt,
      mfaCompletedAt: sessions.mfaCompletedAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, hashOpaqueToken(token)),
        isNull(sessions.revokedAt),
        gt(sessions.idleExpiresAt, now),
        gt(sessions.absoluteExpiresAt, now),
        eq(users.status, "active"),
      ),
    )
    .limit(1);

  if (!result) return null;

  return result;
}

export async function requireAuthenticatedUser(): Promise<AuthContext> {
  const context = await getCurrentAuthContext();
  if (!context) throw new AuthenticationRequiredError();

  return context;
}

export async function requireRole(...roles: KurataRole[]): Promise<AuthContext> {
  const context = await requireAuthenticatedUser();
  if (!roles.includes(context.role)) throw new AuthorizationDeniedError();

  return context;
}
