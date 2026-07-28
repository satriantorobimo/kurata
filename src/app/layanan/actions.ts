"use server";

import {
  INQUIRY_ROLES,
  PREFERRED_CONTACT_METHODS,
  SERVICE_TYPES,
  type InquiryRole,
  type PreferredContactMethod,
  type ServiceType,
} from "@/domain/entities/ServiceInquiry";
import type {
  ServiceInquiryField,
  ServiceInquiryFormState,
  ServiceInquiryInput,
} from "@/application/dto/ServiceInquiryDTO";
import { SubmitServiceInquiry } from "@/application/use-cases/SubmitServiceInquiry";
import { container } from "@/infrastructure/di/container";

function valueOf(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isAllowed<T extends readonly string[]>(value: string, values: T): value is T[number] {
  return values.includes(value);
}

export async function submitServiceInquiry(
  _previousState: ServiceInquiryFormState,
  formData: FormData,
): Promise<ServiceInquiryFormState> {
  if (valueOf(formData, "website")) {
    return { status: "error", message: "Permintaan tidak dapat diproses." };
  }

  const fullName = valueOf(formData, "fullName");
  const email = valueOf(formData, "email").toLowerCase();
  const phone = valueOf(formData, "phone");
  const role = valueOf(formData, "role");
  const service = valueOf(formData, "service");
  const area = valueOf(formData, "area");
  const description = valueOf(formData, "description");
  const preferredContact = valueOf(formData, "preferredContact");
  const budget = valueOf(formData, "budget");
  const listingUrl = valueOf(formData, "listingUrl");
  const fieldErrors: Partial<Record<ServiceInquiryField, string>> = {};

  if (fullName.length < 2 || fullName.length > 120) fieldErrors.fullName = "Masukkan nama lengkap antara 2–120 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) fieldErrors.email = "Masukkan alamat email yang valid.";
  if (phone.replace(/\D/g, "").length < 9 || phone.replace(/\D/g, "").length > 16) fieldErrors.phone = "Masukkan nomor WhatsApp/telepon yang valid.";
  if (!isAllowed(role, INQUIRY_ROLES)) fieldErrors.role = "Pilih peran Anda.";
  if (!isAllowed(service, SERVICE_TYPES)) fieldErrors.service = "Pilih layanan yang dibutuhkan.";
  if (area.length < 2 || area.length > 160) fieldErrors.area = "Masukkan lokasi atau area yang relevan.";
  if (description.length < 20 || description.length > 1500) fieldErrors.description = "Jelaskan kebutuhan Anda dalam 20–1.500 karakter.";
  if (!isAllowed(preferredContact, PREFERRED_CONTACT_METHODS)) fieldErrors.preferredContact = "Pilih metode kontak yang diinginkan.";
  if (listingUrl) {
    try {
      const url = new URL(listingUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      fieldErrors.listingUrl = "Masukkan tautan listing yang valid.";
    }
  }
  if (formData.get("acceptedTerms") !== "on") fieldErrors.acceptedTerms = "Anda perlu menyetujui pemrosesan data untuk konsultasi ini.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Periksa kembali data yang ditandai.", fieldErrors };
  }

  const input: ServiceInquiryInput = {
    fullName,
    email,
    phone,
    role: role as InquiryRole,
    service: service as ServiceType,
    area,
    description,
    preferredContact: preferredContact as PreferredContactMethod,
    budget: budget || undefined,
    listingUrl: listingUrl || undefined,
    acceptedTerms: true,
  };

  const { reference } = await new SubmitServiceInquiry(container.serviceInquiryRepo).execute(input);
  return {
    status: "success",
    message: "Permintaan konsultasi Anda sudah diterima untuk ditinjau.",
    reference,
  };
}
