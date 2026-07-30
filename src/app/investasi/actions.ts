"use server";

import { type InvestmentInquiryField, type InvestmentInquiryFormState, type InvestmentInquiryInput } from "@/application/dto/InvestmentInquiryDTO";
import { INVESTMENT_HORIZONS, INVESTMENT_OBJECTIVES, INVESTMENT_PROPERTY_PREFERENCES, type InvestmentHorizon, type InvestmentObjective, type InvestmentPropertyPreference } from "@/domain/entities/InvestmentInquiry";
import { SubmitInvestmentInquiry } from "@/application/use-cases/SubmitInvestmentInquiry";
import { container } from "@/infrastructure/di/container";

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isAllowed<T extends readonly string[]>(value: string, values: T): value is T[number] {
  return values.includes(value);
}

export async function submitInvestmentInquiry(_previousState: InvestmentInquiryFormState, formData: FormData): Promise<InvestmentInquiryFormState> {
  if (valueOf(formData, "website")) return { status: "error", message: "Permintaan tidak dapat diproses." };

  const fullName = valueOf(formData, "fullName");
  const email = valueOf(formData, "email").toLowerCase();
  const phone = valueOf(formData, "phone");
  const area = valueOf(formData, "area");
  const budget = valueOf(formData, "budget");
  const objective = valueOf(formData, "objective");
  const horizon = valueOf(formData, "horizon");
  const propertyPreference = valueOf(formData, "propertyPreference");
  const notes = valueOf(formData, "notes");
  const fieldErrors: Partial<Record<InvestmentInquiryField, string>> = {};

  if (fullName.length < 2 || fullName.length > 120) fieldErrors.fullName = "Masukkan nama lengkap antara 2–120 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) fieldErrors.email = "Masukkan alamat email yang valid.";
  if (phone.replace(/\D/g, "").length < 9 || phone.replace(/\D/g, "").length > 16) fieldErrors.phone = "Masukkan nomor WhatsApp/telepon yang valid.";
  if (area.length < 2 || area.length > 160) fieldErrors.area = "Masukkan area investasi yang diminati.";
  if (budget.length < 2 || budget.length > 100) fieldErrors.budget = "Masukkan kisaran anggaran investasi.";
  if (!isAllowed(objective, INVESTMENT_OBJECTIVES)) fieldErrors.objective = "Pilih tujuan investasi Anda.";
  if (!isAllowed(horizon, INVESTMENT_HORIZONS)) fieldErrors.horizon = "Pilih jangka waktu investasi Anda.";
  if (!isAllowed(propertyPreference, INVESTMENT_PROPERTY_PREFERENCES)) fieldErrors.propertyPreference = "Pilih preferensi properti Anda.";
  if (notes.length > 1000) fieldErrors.notes = "Catatan tidak boleh lebih dari 1.000 karakter.";
  if (formData.get("acceptedTerms") !== "on") fieldErrors.acceptedTerms = "Anda perlu menyetujui pemrosesan data untuk konsultasi ini.";

  if (Object.keys(fieldErrors).length > 0) return { status: "error", message: "Periksa kembali data yang ditandai.", fieldErrors };

  const input: InvestmentInquiryInput = { fullName, email, phone, area, budget, objective: objective as InvestmentObjective, horizon: horizon as InvestmentHorizon, propertyPreference: propertyPreference as InvestmentPropertyPreference, notes: notes || undefined, acceptedTerms: true };
  const result = await new SubmitInvestmentInquiry(container.investmentInquiryRepo).execute(input);
  return { status: "success", message: "Permintaan konsultasi investasi Anda sudah diterima untuk ditinjau.", reference: result.id };
}
