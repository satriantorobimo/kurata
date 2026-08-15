import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { getDatabase } from "@/infrastructure/database/client";
import { passwordResetTokens } from "@/infrastructure/database/schema";
import { createOpaqueToken, hashOpaqueToken } from "./secure-token";

const TOKEN_EXPIRY_HOURS = 24;

export async function createPasswordSetupToken(userId: string): Promise<string> {
  const database = getDatabase();
  const now = new Date();

  await database
    .update(passwordResetTokens)
    .set({ consumedAt: now })
    .where(and(eq(passwordResetTokens.userId, userId), isNull(passwordResetTokens.consumedAt)));

  const token = createOpaqueToken();
  await database.insert(passwordResetTokens).values({
    userId,
    tokenHash: hashOpaqueToken(token),
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
    createdAt: now,
  });

  return token;
}
