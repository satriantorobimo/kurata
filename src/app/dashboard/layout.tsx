import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { privateRobots } from "@/lib/seo";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export const metadata: Metadata = { robots: privateRobots };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  return children;
}
