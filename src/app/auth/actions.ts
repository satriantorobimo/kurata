"use server";

import { redirect } from "next/navigation";

import { clearSessionCookie, getSessionCookie } from "@/infrastructure/auth/session-cookie";
import { revokeSession } from "@/infrastructure/auth/session-service";

export async function logout(): Promise<void> {
  const token = await getSessionCookie();
  if (token) await revokeSession(token, "user_logout");

  await clearSessionCookie();
  redirect("/");
}
