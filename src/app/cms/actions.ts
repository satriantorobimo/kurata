"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { hashPassword } from "@/infrastructure/auth/password-hasher";
import { requireRole } from "@/infrastructure/security/authorization-dal";
import { container } from "@/infrastructure/di/container";
import { logAudit } from "@/infrastructure/audit/log";
import type {
  AccountStatus,
  CmsBlogInput,
  CmsPropertyInput,
  CmsUserInput,
  KurataRole,
  ReviewStatus,
  VerificationStatus,
} from "@/infrastructure/repositories/PostgresCmsRepository";

export interface CmsActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REVIEW_STATUSES: ReviewStatus[] = ["pending", "under_review", "changes_requested", "rejected", "published", "draft"];
const VERIFICATION_STATUSES: VerificationStatus[] = ["not_started", "submitted", "under_review", "approved", "changes_requested", "rejected"];
const ROLES: KurataRole[] = ["user", "broker", "admin", "super_admin"];
const ACCOUNT_STATUSES: AccountStatus[] = ["active", "suspended", "archived"];

async function requireSuperAdmin() {
  return requireRole("super_admin");
}

function fail(message: string): CmsActionResult {
  return { ok: false, message };
}

// --------------------------------------------------------------- Properties
export async function createPropertyAction(input: Omit<CmsPropertyInput, "id">): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    const errors = validatePropertyInput(input);
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali data aset.", fieldErrors: errors };

    const id = randomUUID();
    await container.cmsRepo.createProperty({ ...input, id });
    revalidatePath("/cms/properties");
    logAudit({ actorUserId: actor.userId, eventType: "property.create", entityType: "property", entityId: id });
    return { ok: true, message: "Aset berhasil dibuat." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function updatePropertyAction(id: string, input: Omit<CmsPropertyInput, "id">): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    const errors = validatePropertyInput(input);
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali data aset.", fieldErrors: errors };

    await container.cmsRepo.updateProperty(id, input);
    revalidatePath("/cms/properties");
    revalidatePath("/cms/properties/[id]", "page");
    logAudit({ actorUserId: actor.userId, eventType: "property.update", entityType: "property", entityId: id });
    return { ok: true, message: "Aset berhasil diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function deletePropertyAction(id: string): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();
    await container.cmsRepo.deleteProperty(id);
    revalidatePath("/cms/properties");
    logAudit({ actorUserId: actor.userId, eventType: "property.delete", entityType: "property", entityId: id });
    return { ok: true, message: "Aset berhasil dihapus." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function setPropertyReviewStatusAction(propertyId: string, status: string): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();
    if (!isReviewStatus(status)) return fail("Status tidak valid.");

    const published = status === "published";
    await container.cmsRepo.updatePropertyStatus(propertyId, status, published);
    revalidatePath("/cms/properties");
    logAudit({ actorUserId: actor.userId, eventType: "property.review", entityType: "property", entityId: propertyId, metadata: JSON.stringify({ status }) });
    return { ok: true, message: "Status aset diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function addPropertyImageAction(propertyId: string, imageUrl: string): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    const url = imageUrl.trim();
    if (!/^(\/|https?:\/\/).+/.test(url) || url.length > 2048) return { ok: false, message: "URL gambar tidak valid." };

    await container.cmsRepo.addPropertyImage(propertyId, url);
    revalidatePath("/cms/properties/[id]", "page");
    return { ok: true, message: "Gambar berhasil ditambahkan." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function deletePropertyImageAction(imageId: string): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    await container.cmsRepo.deletePropertyImage(imageId);
    revalidatePath("/cms/properties/[id]", "page");
    return { ok: true, message: "Gambar berhasil dihapus." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

// --------------------------------------------------------------------- Blog
export async function createBlogAction(input: CmsBlogInput): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    const errors = validateBlogInput(input);
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali artikel.", fieldErrors: errors };

    if (await container.cmsRepo.blogSlugExists(input.slug)) return { ok: false, fieldErrors: { slug: "Slug sudah digunakan. Pilih slug lain." } };

    await container.cmsRepo.createBlog(input);
    revalidatePath("/cms/blog");
    logAudit({ actorUserId: actor.userId, eventType: "blog.create", entityType: "blog", entityId: input.slug });
    return { ok: true, message: "Artikel berhasil dibuat." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function updateBlogAction(slug: string, input: CmsBlogInput): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    const errors = validateBlogInput(input);
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali artikel.", fieldErrors: errors };

    if (slug !== input.slug && (await container.cmsRepo.blogSlugExists(input.slug, slug))) return { ok: false, fieldErrors: { slug: "Slug sudah digunakan. Gunakan slug lain." } };

    if (slug !== input.slug) {
      throw new Error("Mengubah slug artikel belum didukung.");
    }

    await container.cmsRepo.updateBlog(slug, input);
    revalidatePath("/cms/blog");
    revalidatePath("/cms/blog/[slug]", "page");
    logAudit({ actorUserId: actor.userId, eventType: "blog.update", entityType: "blog", entityId: slug });
    return { ok: true, message: "Artikel berhasil diperbarui." };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Mengubah slug")) return { ok: false, message: error.message };
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function deleteBlogAction(slug: string): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();
    await container.cmsRepo.deleteBlog(slug);
    revalidatePath("/cms/blog");
    logAudit({ actorUserId: actor.userId, eventType: "blog.delete", entityType: "blog", entityId: slug });
    return { ok: true, message: "Artikel berhasil dihapus." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

// ---------------------------------------------------------- Content sections
export async function createContentSectionAction(input: { id?: string; section: string; content: unknown; position: number; isPublished: boolean }): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    if (!input.section.trim() || input.section.length > 80) return { ok: false, fieldErrors: { section: "Nama segmen 1–80 karakter." } };
    if (input.content === null || input.content === undefined) return { ok: false, fieldErrors: { content: "Isi segmen tidak boleh kosong." } };

    await container.cmsRepo.createContentSection({ ...input, id: input.id || randomUUID() });
    revalidatePath("/cms/sections");
    return { ok: true, message: "Segmen konten berhasil dibuat." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function updateContentSectionAction(id: string, input: { section: string; content: unknown; position: number; isPublished: boolean }): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    if (!input.section.trim()) return { ok: false, fieldErrors: { section: "Identitas segmen tidak boleh kosong." } };
    if (input.content === null || input.content === undefined) return { ok: false, fieldErrors: { content: "Isi konten tidak boleh kosong." } };

    await container.cmsRepo.updateContentSection(id, input);
    revalidatePath("/cms/sections");
    return { ok: true, message: "Segmen konten berhasil diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function deleteContentSectionAction(id: string): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    await container.cmsRepo.deleteContentSection(id);
    revalidatePath("/cms/sections");
    return { ok: true, message: "Segmen konten berhasil dihapus." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

// --------------------------------------------------------------- Statistics
export async function createStatisticAction(input: { id: string; label: string; value: string; icon: string; displayOrder: number; isPublished: boolean }): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    const errors = validateStatisticInput(input);
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali statistik.", fieldErrors: errors };

    await container.cmsRepo.createStatistic({ ...input, id: input.id || randomUUID() });
    revalidatePath("/cms/statistics");
    return { ok: true, message: "Statistik berhasil dibuat." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function updateStatisticAction(id: string, input: { label: string; value: string; icon: string; displayOrder: number; isPublished: boolean }): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    const errors = validateStatisticInput(input);
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali statistik.", fieldErrors: errors };

    await container.cmsRepo.updateStatistic(id, input);
    revalidatePath("/cms/statistics");
    return { ok: true, message: "Statistik berhasil diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function deleteStatisticAction(id: string): Promise<CmsActionResult> {
  try {
    await requireSuperAdmin();
    await container.cmsRepo.deleteStatistic(id);
    revalidatePath("/cms/statistics");
    return { ok: true, message: "Statistik berhasil dihapus." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

// --------------------------------------------------------------------- Forms
export async function updateFormSubmissionAction(id: string, input: { fullName: string; email: string; phone: string | null; payload: Record<string, unknown>; acceptedTerms: boolean; reviewStatus: string; reviewerNotes: string | null }): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    const errors: Record<string, string> = {};
    if (input.fullName.trim().length < 2) errors.fullName = "Nama minimal 2 karakter.";
    if (!EMAIL_PATTERN.test(input.email)) errors.email = "Masukkan email yang valid.";
    if (input.phone && (input.phone.length < 9 || input.phone.length > 16)) errors.phone = "Nomor telepon tidak valid.";
    if (!isReviewStatus(input.reviewStatus)) errors.reviewStatus = "Status tidak valid.";
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali pengajuan.", fieldErrors: errors };

    const existing = await container.cmsRepo.getFormById(id);
    if (!existing) return { ok: false, message: "Pengajuan tidak ditemukan." };

    const wasApproved = existing.formType === "broker_application" && existing.reviewStatus !== "published" && input.reviewStatus === "published";

    await container.cmsRepo.updateForm(id, input);

    if (wasApproved) {
      await container.cmsRepo.promoteBrokerFromApplication(id, existing.email, existing.fullName, existing.phone);
    }

    revalidatePath("/cms/forms");
    logAudit({ actorUserId: actor.userId, eventType: "form.update", entityType: "form", entityId: id, metadata: JSON.stringify({ reviewStatus: input.reviewStatus, brokerPromoted: wasApproved }) });
    return { ok: true, message: wasApproved ? "Pengajuan mitra disetujui dan akun broker telah dibuat." : "Pengajuan berhasil diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

// --------------------------------------------------------------------- Users
export async function createUserAction(input: Omit<CmsUserInput, "id" | "passwordHash"> & { password: string }): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    const isAdminRole = input.role === "admin" || input.role === "super_admin";
    const minPasswordLength = isAdminRole ? 14 : 8;
    const hasLetter = /[A-Za-z]/.test(input.password);
    const hasDigit = /\d/.test(input.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(input.password);

    const errors: Record<string, string> = {};
    if (input.fullName.trim().length < 2) errors.fullName = "Nama minimal 2 karakter.";
    if (!EMAIL_PATTERN.test(input.email)) errors.email = "Format email tidak valid.";
    if (input.password.length < minPasswordLength) errors.password = `Password minimal ${minPasswordLength} karakter.`;
    if (!hasLetter || !hasDigit) errors.password = "Password harus mengandung huruf dan angka.";
    if (isAdminRole && !hasSpecial) errors.password = "Password admin harus mengandung minimal satu karakter khusus (!@#$% dll).";
    if (!ROLES.includes(input.role)) errors.role = "Peran tidak valid.";
    if (!ACCOUNT_STATUSES.includes(input.status)) errors.status = "Status tidak valid.";
    if (Object.keys(errors).length > 0) return { ok: false, message: "Periksa kembali data pengguna.", fieldErrors: errors };

    if (await container.cmsRepo.emailExists(input.email)) return { ok: false, fieldErrors: { email: "Email sudah terdaftar." } };

    const passwordHash = await hashPassword(input.password);
    const id = randomUUID();
    await container.cmsRepo.createUser({ id, email: input.email, fullName: input.fullName, phone: input.phone, role: input.role, status: input.status, passwordHash, marketingConsent: input.marketingConsent });

    revalidatePath("/cms/users");
    logAudit({ actorUserId: actor.userId, eventType: "user.create", entityType: "user", entityId: id, metadata: JSON.stringify({ role: input.role }) });
    return { ok: true, message: "Pengguna berhasil dibuat." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function updateUserAction(id: string, input: { fullName: string; phone: string | null; role: KurataRole; status: AccountStatus }): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();

    if (id === actor.userId && (input.role !== "super_admin" || input.status !== "active")) {
      return { ok: false, message: "Anda tidak dapat menurunkan peran atau menonaktifkan akun Anda sendiri." };
    }

    const target = await container.cmsRepo.getUserById(id);
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };

    if (target.role === "super_admin" && id !== actor.userId && input.role !== "super_admin" && (await container.cmsRepo.countSuperAdmins()) <= 1) {
      return { ok: false, message: "Tidak dapat menurunkan super admin terakhir." };
    }

    await container.cmsRepo.updateUser(id, { fullName: input.fullName, phone: input.phone, role: input.role, status: input.status });
    revalidatePath("/cms/users");
    logAudit({ actorUserId: actor.userId, eventType: "user.update", entityType: "user", entityId: id, metadata: JSON.stringify({ role: input.role, status: input.status }) });
    return { ok: true, message: "Pengguna berhasil diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function deleteUserAction(id: string): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();
    if (id === actor.userId) return { ok: false, message: "Tidak dapat menghapus akun Anda sendiri." };

    const target = await container.cmsRepo.getUserById(id);
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };
    if (target.role === "super_admin" && (await container.cmsRepo.countSuperAdmins()) <= 1) return { ok: false, message: "Tidak dapat menghapus super admin terakhir." };

    await container.cmsRepo.deleteUser(id);
    revalidatePath("/cms/users");
    logAudit({ actorUserId: actor.userId, eventType: "user.delete", entityType: "user", entityId: id });
    return { ok: true, message: "Pengguna berhasil dihapus." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

export async function updateUserVerificationAction(userId: string, input: { status: VerificationStatus; notes: string | null }): Promise<CmsActionResult> {
  try {
    const actor = await requireSuperAdmin();
    if (!VERIFICATION_STATUSES.includes(input.status)) return { ok: false, fieldErrors: { status: "Status tidak valid." } };

    await container.cmsRepo.updateUserVerification(userId, { status: input.status, notes: input.notes?.trim() || null, reviewerId: actor.userId });
    revalidatePath("/cms/users");
    logAudit({ actorUserId: actor.userId, eventType: "user.verification", entityType: "user", entityId: userId, metadata: JSON.stringify({ status: input.status }) });
    return { ok: true, message: "Status verifikasi diperbarui." };
  } catch {
    return { ok: false, message: "Operasi gagal. Coba lagi." };
  }
}

// ---------------------------------------------------------------- Validators
function validatePropertyInput(input: Omit<CmsPropertyInput, "id">) {
  const errors: Record<string, string> = {};
  if (!input.title.trim() || input.title.trim().length < 4) errors.title = "Judul minimal 4 karakter.";
  if (!input.city.trim()) errors.city = "Kota wajib diisi.";
  if (!input.province.trim()) errors.province = "Provinsi wajib diisi.";
  if (!Number.isFinite(input.priceAmount) || input.priceAmount <= 0) errors.priceAmount = "Harga wajib diisi angka positif.";
  if (!Number.isInteger(input.areaSqm) || input.areaSqm <= 0) errors.areaSqm = "Luas wajib diisi angka bulat positif.";
  if (!["SHM", "HGB", "HGU", "HP"].includes(input.certificate)) errors.certificate = "Jenis sertifikat tidak valid.";
  if (!input.imageUrl.trim()) errors.imageUrl = "URL gambar utama wajib diisi.";
  if (input.badge !== null && input.badge !== undefined && !["exclusive", "broker"].includes(input.badge)) errors.badge = "Badge tidak valid.";
  return errors;
}

function validateBlogInput(input: CmsBlogInput) {
  const errors: Record<string, string> = {};
  if (!input.title.trim() || input.title.trim().length < 4) errors.title = "Judul minimal 4 karakter.";
  if (!input.excerpt.trim()) errors.excerpt = "Ringkasan wajib diisi.";
  if (!input.category.trim()) errors.category = "Kategori wajib diisi.";
  if (!input.coverImageUrl.trim()) errors.coverImageUrl = "URL sampul wajib diisi.";
  if (input.readingMinutes < 1) errors.readingMinutes = "Durasi baca minimal 1 menit.";
  if (!input.slug.trim()) errors.slug = "Slug wajib diisi.";
  return errors;
}

function validateStatisticInput(input: { label: string; value: string; icon: string; displayOrder: number }) {
  const errors: Record<string, string> = {};
  if (!input.label.trim()) errors.label = "Label wajib diisi.";
  if (!input.value.trim()) errors.value = "Nilai wajib diisi.";
  if (!Number.isInteger(input.displayOrder)) errors.displayOrder = "Urutan tampil harus berupa angka.";
  return errors;
}

function isReviewStatus(status: string): status is ReviewStatus {
  return REVIEW_STATUSES.includes(status as ReviewStatus);
}