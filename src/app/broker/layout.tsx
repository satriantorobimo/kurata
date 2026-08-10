import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { privateRobots } from "@/lib/seo";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export const metadata: Metadata = { robots: privateRobots };

export default async function BrokerLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");
  if (auth.role !== "broker" && auth.role !== "admin" && auth.role !== "super_admin") redirect("/");

  return children;
}
