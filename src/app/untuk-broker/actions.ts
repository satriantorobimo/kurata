"use server";

import { headers } from "next/headers";

import {
  BROKER_EXPERIENCE_LEVELS,
  BROKER_SPECIALIZATIONS,
  BROKER_TYPES,
  type BrokerExperienceLevel,
  type BrokerSpecialization,
  type BrokerType,
} from "@/domain/entities/BrokerApplication";
import type {
  BrokerApplicationField,
  BrokerApplicationFormState,
  BrokerApplicationInput,
} from "@/application/dto/BrokerApplicationDTO";
import { SubmitBrokerApplication } from "@/application/use-cases/SubmitBrokerApplication";
import { container } from "@/infrastructure/di/container";
import { rateLimit } from "@/lib/rate-limit";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? h.get("x-real-ip")
    ?? "127.0.0.1";
}

function fieldValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isInList<T extends readonly string[]>(value: string, values: T): value is T[number] {
  return values.includes(value);
}

function invalidState(
  fieldErrors: Partial<Record<BrokerApplicationField, string>>,
): BrokerApplicationFormState {
  return {
    status: "error",
    message: "Periksa kembali data yang ditandai.",
    fieldErrors,
  };
}

export async function submitBrokerApplication(
  _previousState: BrokerApplicationFormState,
  formData: FormData,
): Promise<BrokerApplicationFormState> {
  const ip = await clientIp();
  const rl = rateLimit(`submit:broker:${ip}`, 3);
  if (!rl.allowed) {
    return { status: "error", message: "Terlalu banyak permintaan. Silakan coba lagi nanti." };
  }
  if (fieldValue(formData, "website")) {
    return { status: "error", message: "Permintaan tidak dapat diproses." };
  }

  const fullName = fieldValue(formData, "fullName");
  const email = fieldValue(formData, "email").toLowerCase();
  const phone = fieldValue(formData, "phone");
  const city = fieldValue(formData, "city");
  const operatingAreas = fieldValue(formData, "operatingAreas");
  const experienceLevel = fieldValue(formData, "experienceLevel");
  const brokerType = fieldValue(formData, "brokerType");
  const companyName = fieldValue(formData, "companyName");
  const portfolioUrl = fieldValue(formData, "portfolioUrl");
  const message = fieldValue(formData, "message");
  const specialties = formData
    .getAll("specializations")
    .filter((value): value is string => typeof value === "string")
    .filter((value): value is BrokerSpecialization =>
      isInList(value, BROKER_SPECIALIZATIONS),
    );

  const fieldErrors: Partial<Record<BrokerApplicationField, string>> = {};
  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = "Masukkan nama lengkap antara 2–120 karakter.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    fieldErrors.email = "Masukkan alamat email yang valid.";
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 16) {
    fieldErrors.phone = "Masukkan nomor WhatsApp/telepon yang valid.";
  }
  if (city.length < 2 || city.length > 100) {
    fieldErrors.city = "Masukkan kota atau domisili Anda.";
  }
  if (operatingAreas.length < 2 || operatingAreas.length > 200) {
    fieldErrors.operatingAreas = "Jelaskan area operasional Anda.";
  }
  if (!isInList(experienceLevel, BROKER_EXPERIENCE_LEVELS)) {
    fieldErrors.experienceLevel = "Pilih tingkat pengalaman Anda.";
  }
  if (!isInList(brokerType, BROKER_TYPES)) {
    fieldErrors.brokerType = "Pilih jenis broker Anda.";
  }
  if (specialties.length === 0) {
    fieldErrors.specializations = "Pilih minimal satu spesialisasi.";
  }
  if (portfolioUrl) {
    try {
      const url = new URL(portfolioUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      fieldErrors.portfolioUrl = "Masukkan tautan portofolio yang valid.";
    }
  }
  if (formData.get("acceptedTerms") !== "on") {
    fieldErrors.acceptedTerms = "Anda perlu menyetujui ketentuan pendaftaran.";
  }

  if (Object.keys(fieldErrors).length > 0) return invalidState(fieldErrors);

  const input: BrokerApplicationInput = {
    fullName,
    email,
    phone,
    city,
    operatingAreas,
    experienceLevel: experienceLevel as BrokerExperienceLevel,
    brokerType: brokerType as BrokerType,
    specializations: specialties,
    companyName: companyName || undefined,
    portfolioUrl: portfolioUrl || undefined,
    message: message || undefined,
    acceptedTerms: true,
  };

  const { reference } = await new SubmitBrokerApplication(
    container.brokerApplicationRepo,
  ).execute(input);

  return {
    status: "success",
    message: "Pendaftaran Anda sudah diterima untuk ditinjau.",
    reference,
  };
}
