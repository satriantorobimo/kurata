import type { Metadata } from "next";

import { AuthShell } from "@/presentation/components/auth/AuthShell";
import { SetPasswordForm } from "@/presentation/components/auth/SetPasswordForm";
import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Buat Password | Kurata",
  robots: privateRobots,
};

export default async function SetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <AuthShell eyebrow="Akun Mitra Kurata" title="Buat Password" description="Buat password untuk mengakses dashboard Mitra Kurata."><SetPasswordForm token={token} /></AuthShell>;
}
