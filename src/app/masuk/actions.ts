"use server";

import type { AuthFormState } from "@/application/dto/AuthFormDTO";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const website = String(formData.get("website") ?? "");

  if (website) return { status: "success", message: "Permintaan diterima." };

  const fieldErrors: AuthFormState["fieldErrors"] = {};
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Masukkan alamat email yang valid.";
  if (password.length < 8) fieldErrors.password = "Password minimal 8 karakter.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali data yang Anda masukkan.", fieldErrors };
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    status: "success",
    message: "Form masuk berhasil divalidasi dalam mode demo. Sambungkan penyedia autentikasi untuk membuat sesi pengguna.",
  };
}
