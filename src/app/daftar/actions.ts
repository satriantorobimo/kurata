"use server";

import type { AuthFormState } from "@/application/dto/AuthFormDTO";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const acceptedTerms = formData.get("acceptedTerms") === "on";
  const website = String(formData.get("website") ?? "");

  if (website) return { status: "success", message: "Permintaan diterima." };

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (fullName.length < 2 || fullName.length > 100) fieldErrors.fullName = "Nama lengkap harus terdiri dari 2–100 karakter.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Masukkan alamat email yang valid.";
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 16) fieldErrors.phone = "Masukkan nomor WhatsApp yang valid.";
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) fieldErrors.password = "Gunakan minimal 8 karakter dengan huruf dan angka.";
  if (confirmPassword !== password) fieldErrors.confirmPassword = "Konfirmasi password tidak sama.";
  if (!acceptedTerms) fieldErrors.acceptedTerms = "Anda perlu menyetujui ketentuan pendaftaran.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali data pendaftaran Anda.", fieldErrors };
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    status: "success",
    message: "Data berhasil divalidasi dalam mode demo. Belum ada akun atau password yang disimpan.",
  };
}
