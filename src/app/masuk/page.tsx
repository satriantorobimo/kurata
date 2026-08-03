import type { Metadata } from "next";
import { AuthShell } from "@/presentation/components/auth/AuthShell";
import { LoginForm } from "@/presentation/components/auth/LoginForm";
import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Masuk | Kurata",
  description: "Masuk ke akun Kurata untuk mengelola kebutuhan pertanahan Anda.",
  robots: privateRobots,
};

export default function LoginPage() {
  return <AuthShell eyebrow="Selamat datang kembali" title="Masuk ke Akun Kurata" description="Lanjutkan pencarian dan kelola kebutuhan pertanahan Anda dalam satu tempat."><LoginForm /></AuthShell>;
}
