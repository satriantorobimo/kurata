import "server-only";

import { cookies } from "next/headers";

import type { CreatedSession } from "./session-service";

const isProduction = process.env.NODE_ENV === "production";
const SESSION_COOKIE_NAME = isProduction ? "__Host-kurata_session" : "kurata_session";

export async function setSessionCookie(session: CreatedSession): Promise<void> {
  const maxAge = Math.max(0, Math.floor((session.idleExpiresAt.getTime() - Date.now()) / 1000));

  (await cookies()).set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
