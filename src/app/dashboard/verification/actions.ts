"use server";

import { revalidatePath } from "next/cache";
import type { VerificationField, VerificationFormState } from "@/application/dto/VerificationFormDTO";
import { SubmitVerification } from "@/application/use-cases/SubmitVerification";
import { container } from "@/infrastructure/di/container";
import { requireAuthenticatedUser } from "@/infrastructure/security/authorization-dal";

export async function submitVerification(
  _previousState: VerificationFormState,
  formData: FormData,
): Promise<VerificationFormState> {
  let auth;
  try {
    auth = await requireAuthenticatedUser();
  } catch {
    return { status: "error", message: "Anda harus masuk terlebih dahulu." };
  }

  const nik = String(formData.get("nik") ?? "").replace(/\D/g, "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const birthPlace = String(formData.get("birthPlace") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const agreement = formData.get("agreement") === "on";

  const fieldErrors: Partial<Record<VerificationField, string>> = {};

  if (nik.length !== 16) {
    fieldErrors.nik = "NIK harus terdiri dari 16 digit angka.";
  }
  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = "Nama lengkap harus terdiri dari 2–120 karakter.";
  }
  if (birthPlace.length < 2 || birthPlace.length > 100) {
    fieldErrors.birthPlace = "Masukkan kota/kabupaten tempat lahir.";
  }
  if (!birthDate) {
    fieldErrors.birthDate = "Pilih tanggal lahir.";
  }
  if (address.length < 5 || address.length > 500) {
    fieldErrors.address = "Masukkan alamat sesuai KTP (5–500 karakter).";
  }
  if (!agreement) {
    fieldErrors.agreement = "Anda perlu menyetujui pernyataan verifikasi.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali data yang ditandai.", fieldErrors };
  }

  try {
    await new SubmitVerification(container.workspaceRepo).execute({
      userId: auth.userId,
      nik,
      fullName,
      birthPlace,
      birthDate,
      address,
    });

    revalidatePath("/dashboard/verification");
    revalidatePath("/dashboard");
    revalidatePath("/broker/verification");
    revalidatePath("/broker/dashboard");

    return {
      status: "success",
      message: "Pengajuan verifikasi berhasil dikirim. Tim Kurata akan meninjau data Anda.",
    };
  } catch {
    return { status: "error", message: "Gagal mengirim verifikasi. Silakan coba lagi." };
  }
}
