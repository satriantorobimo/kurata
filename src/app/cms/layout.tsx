import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CmsShell } from "@/presentation/components/cms/CmsShell";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";
import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CMS Kurata",
  robots: privateRobots,
};

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");
  if (auth.role !== "admin" && auth.role !== "super_admin") redirect("/");

  return <CmsShell role={auth.role} email={auth.email}>{children}</CmsShell>;
}