import "server-only";

import { eq } from "drizzle-orm";

import { getDatabase } from "@/infrastructure/database/client";
import { sessions } from "@/infrastructure/database/schema";

import { createOpaqueToken, hashOpaqueToken } from "./secure-token";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const SESSION_POLICY = {
  userIdleDays: 7,
  userAbsoluteDays: 30,
  adminIdleMinutes: 30,
  adminAbsoluteHours: 8,
} as const;

export type SessionRole = "user" | "broker" | "admin" | "super_admin";

export interface CreateSessionInput {
  userId: string;
  role: SessionRole;
  userAgentSummary?: string;
  ipHash?: string;
  mfaCompleted?: boolean;
}

export interface CreatedSession {
  token: string;
  idleExpiresAt: Date;
  absoluteExpiresAt: Date;
}

function expiryFor(role: SessionRole, now: Date) {
  if (role === "admin" || role === "super_admin") {
    return {
      idleExpiresAt: new Date(now.getTime() + SESSION_POLICY.adminIdleMinutes * 60 * 1000),
      absoluteExpiresAt: new Date(now.getTime() + SESSION_POLICY.adminAbsoluteHours * 60 * 60 * 1000),
    };
  }

  return {
    idleExpiresAt: new Date(now.getTime() + SESSION_POLICY.userIdleDays * DAY_IN_MS),
    absoluteExpiresAt: new Date(now.getTime() + SESSION_POLICY.userAbsoluteDays * DAY_IN_MS),
  };
}

export async function createSession(input: CreateSessionInput): Promise<CreatedSession> {
  const token = createOpaqueToken();
  const now = new Date();
  const { idleExpiresAt, absoluteExpiresAt } = expiryFor(input.role, now);

  await getDatabase().insert(sessions).values({
    userId: input.userId,
    tokenHash: hashOpaqueToken(token),
    createdAt: now,
    lastSeenAt: now,
    authenticatedAt: now,
    mfaCompletedAt: input.mfaCompleted ? now : null,
    idleExpiresAt,
    absoluteExpiresAt,
    userAgentSummary: input.userAgentSummary,
    ipHash: input.ipHash,
  });

  return { token, idleExpiresAt, absoluteExpiresAt };
}

export async function revokeSession(token: string, reason: string): Promise<void> {
  await getDatabase()
    .update(sessions)
    .set({ revokedAt: new Date(), revocationReason: reason })
    .where(eq(sessions.tokenHash, hashOpaqueToken(token)));
}

export async function revokeAllUserSessions(userId: string, reason: string): Promise<void> {
  await getDatabase()
    .update(sessions)
    .set({ revokedAt: new Date(), revocationReason: reason })
    .where(eq(sessions.userId, userId));
}
