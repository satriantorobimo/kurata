"use server";

import { headers } from "next/headers";

import type { SupportRequestField, SupportRequestFormState, SupportRequestInput } from "@/application/dto/SupportRequestDTO";
import { SUPPORT_CATEGORIES, SUPPORT_CONTACT_METHODS, type SupportCategory, type SupportContactMethod } from "@/domain/entities/SupportRequest";
import { SubmitSupportRequest } from "@/application/use-cases/SubmitSupportRequest";
import { container } from "@/infrastructure/di/container";
import { rateLimit } from "@/lib/rate-limit";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? h.get("x-real-ip")
    ?? "127.0.0.1";
}

function valueOf(formData: FormData, key: string) { const value = formData.get(key); return typeof value === "string" ? value.trim() : ""; }
function isAllowed<T extends readonly string[]>(value: string, values: T): value is T[number] { return values.includes(value); }

export async function submitSupportRequest(_previousState: SupportRequestFormState, formData: FormData): Promise<SupportRequestFormState> {
  const ip = await clientIp();
  const rl = rateLimit(`submit:bantuan:${ip}`, 3);
  if (!rl.allowed) return { status: "error", message: "Terlalu banyak permintaan. Silakan coba lagi nanti." };

  if (valueOf(formData, "website")) return { status: "error", message: "Permintaan tidak dapat diproses." };
  const fullName = valueOf(formData, "fullName");
  const email = valueOf(formData, "email").toLowerCase();
  const phone = valueOf(formData, "phone");
  const category = valueOf(formData, "category");
  const subject = valueOf(formData, "subject");
  const message = valueOf(formData, "message");
  const preferredContact = valueOf(formData, "preferredContact");
  const fieldErrors: Partial<Record<SupportRequestField, string>> = {};
  if (fullName.length < 2 || fullName.length > 120) fieldErrors.fullName = "Masukkan nama lengkap antara 2–120 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) fieldErrors.email = "Masukkan alamat email yang valid.";
  if (phone && (phone.replace(/\D/g, "").length < 9 || phone.replace(/\D/g, "").length > 16)) fieldErrors.phone = "Masukkan nomor WhatsApp/telepon yang valid.";
  if (!isAllowed(category, SUPPORT_CATEGORIES)) fieldErrors.category = "Pilih kategori bantuan.";
  if (subject.length < 5 || subject.length > 160) fieldErrors.subject = "Masukkan subjek antara 5–160 karakter.";
  if (message.length < 20 || message.length > 1500) fieldErrors.message = "Jelaskan kebutuhan Anda dalam 20–1.500 karakter.";
  if (!isAllowed(preferredContact, SUPPORT_CONTACT_METHODS)) fieldErrors.preferredContact = "Pilih metode kontak yang diinginkan.";
  if (formData.get("acceptedTerms") !== "on") fieldErrors.acceptedTerms = "Anda perlu menyetujui pemrosesan data untuk bantuan ini.";
  if (Object.keys(fieldErrors).length > 0) return { status: "error", message: "Periksa kembali data yang ditandai.", fieldErrors };
  const input: SupportRequestInput = { fullName, email, phone: phone || undefined, category: category as SupportCategory, subject, message, preferredContact: preferredContact as SupportContactMethod, acceptedTerms: true };
  const result = await new SubmitSupportRequest(container.supportRequestRepo).execute(input);
  return { status: "success", message: "Permintaan bantuan Anda sudah diterima untuk ditinjau.", reference: result.id };
}
