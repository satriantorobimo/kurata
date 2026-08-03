import type { Metadata } from "next";
import { AuthShell } from "@/presentation/components/auth/AuthShell";
import { RegisterForm } from "@/presentation/components/auth/RegisterForm";
import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Daftar | Kurata",
  description: "Buat akun Kurata untuk memulai kebutuhan pertanahan Anda.",
  robots: privateRobots,
};

export default function RegisterPage() {
  return <AuthShell eyebrow="Buat akun baru" title="Mulai Bersama Kurata" description="Daftar untuk menyimpan pilihan properti dan mengelola kebutuhan tanah Anda dengan lebih mudah."><RegisterForm /></AuthShell>;
}
