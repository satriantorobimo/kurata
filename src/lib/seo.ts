import type { Metadata } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const siteUrl = new URL(rawSiteUrl);
export const siteName = "Kurata";

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
