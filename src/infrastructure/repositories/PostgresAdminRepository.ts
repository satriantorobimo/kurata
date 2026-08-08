import "server-only";

import { desc, eq } from "drizzle-orm";

import { getDatabase } from "../database/client";
import { blogArticles, forms, properties, users, userVerifications } from "../database/schema";

export interface AdminReviewUser {
  id: string;
  entityId: string;
  name: string;
  email: string;
  subtitle: string;
  submittedAt: string;
  status: string;
  details: string[];
}

export interface AdminReviewBroker {
  id: string;
  entityId: string;
  name: string;
  email: string;
  subtitle: string;
  submittedAt: string;
  status: string;
  details: string[];
}

export interface AdminReviewAsset {
  id: string;
  entityId: string;
  name: string;
  subtitle: string;
  submittedAt: string;
  status: string;
  details: string[];
}

export interface AdminReviewContent {
  id: string;
  entityId: string;
  name: string;
  subtitle: string;
  submittedAt: string;
  status: string;
  details: string[];
}

export interface AdminReviewData {
  users: AdminReviewUser[];
  brokers: AdminReviewBroker[];
  assets: AdminReviewAsset[];
  content: AdminReviewContent[];
}

function toLocalDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Real admin review queues derived from persisted tables. */
export class PostgresAdminRepository {
  async getReviewData(): Promise<AdminReviewData> {
    const database = getDatabase();

    const [userRows, brokerRows, assetRows, contentRows] = await Promise.all([
      database
        .select({
          id: users.id,
          name: users.fullName,
          email: users.email,
          role: users.role,
          verificationStatus: userVerifications.status,
          submittedAt: userVerifications.submittedAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .leftJoin(userVerifications, eq(userVerifications.userId, users.id))
        .orderBy(desc(users.createdAt))
        .limit(50),
      database
        .select()
        .from(forms)
        .where(eq(forms.formType, "broker_application"))
        .orderBy(desc(forms.createdAt))
        .limit(50),
      database
        .select()
        .from(properties)
        .orderBy(desc(properties.createdAt))
        .limit(50),
      database
        .select()
        .from(blogArticles)
        .orderBy(desc(blogArticles.publishedAt))
        .limit(50),
    ]);

    const usersCollection: AdminReviewUser[] = userRows.map((row) => ({
      id: row.id.slice(0, 8).toUpperCase(),
      entityId: row.id,
      name: row.name,
      email: row.email,
      subtitle: row.role === "broker" ? "Akun mitra Kurata" : "Pemohon verifikasi akun",
      submittedAt: row.submittedAt ? toLocalDate(row.submittedAt) : toLocalDate(row.createdAt),
      status: mapVerificationStatus(row.verificationStatus),
      details: ["Email terdaftar", `Peran: ${row.role}`, `Bergabung: ${toLocalDate(row.createdAt)}`],
    }));

    const brokersCollection: AdminReviewBroker[] = brokerRows.map((row) => {
      const payload = (row.payload ?? {}) as Record<string, unknown>;
      const specializations = Array.isArray(payload.specializations) ? (payload.specializations as string[]).join(", ") : "";
      return {
        id: row.id,
        entityId: row.id,
        name: row.fullName,
        email: row.email,
        subtitle: typeof payload.brokerType === "string" ? `Pengajuan mitra · ${payload.brokerType}` : "Pengajuan mitra Kurata",
        submittedAt: toLocalDate(row.createdAt),
        status: row.reviewStatus ?? "pending",
        details: [
          `Area: ${typeof payload.operatingAreas === "string" ? payload.operatingAreas : "-"}`,
          `Pengalaman: ${typeof payload.experienceLevel === "string" ? payload.experienceLevel.replaceAll("-", " ") : "-"}`,
          specializations ? `Spesialisasi: ${specializations}` : "Spesialisasi: belum diisi",
        ],
      };
    });

    const assetsCollection: AdminReviewAsset[] = assetRows.map((row) => ({
      id: row.id.toUpperCase(),
      entityId: row.id,
      name: row.title,
      subtitle: `Listing aset · ${row.badge ?? "umum"}`,
      submittedAt: toLocalDate(row.createdAt),
      status: row.isPublished ? "published" : (row.reviewStatus ?? "draft"),
      details: [`Luas: ${row.areaSqm} m²`, `Sertifikat: ${row.certificate}`, `Harga: Rp ${row.priceAmount.toLocaleString("id-ID")}`],
    }));

    const contentCollection: AdminReviewContent[] = contentRows.map((row) => ({
      id: row.slug.slice(0, 8).toUpperCase(),
      entityId: row.slug,
      name: row.title,
      subtitle: "Blog · Konten Kurata",
      submittedAt: toLocalDate(row.publishedAt),
      status: row.isPublished ? "published" : "draft",
      details: [`Kategori: ${row.category}`, `Penulis: ${row.author}`, `Dibaca ± ${row.readingMinutes} menit`],
    }));

    return {
      users: usersCollection,
      brokers: brokersCollection,
      assets: assetsCollection,
      content: contentCollection,
    };
  }
}

function mapVerificationStatus(status: string | null): string {
  switch (status) {
    case "approved":
      return "verified";
    case "under_review":
      return "under_review";
    case "changes_requested":
      return "changes_requested";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
}
