import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";

import type { VerificationInput } from "@/application/dto/VerificationFormDTO";
import { getDatabase } from "../database/client";
import { forms, properties, userFavorites, userVerifications, users } from "../database/schema";

export type { VerificationStatus } from "@/infrastructure/repositories/PostgresCmsRepository";

export interface WorkspaceFavorite {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
}

export interface WorkspaceInquiry {
  id: string;
  title: string;
  broker: string;
  status: string;
  updatedAt: string;
}

export interface UserWorkspaceData {
  name: string;
  verification: string;
  favoriteProperties: WorkspaceFavorite[];
  inquiries: WorkspaceInquiry[];
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface BrokerWorkspaceData {
  name: string;
  verification: string;
  assets: {
    id: string;
    title: string;
    location: string;
    price: string;
    status: string;
    updatedAt: string;
    issue: string | null;
  }[];
}

function formatPrice(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp${(amount / 1_000_000_000).toFixed(2).replace(/\.00$/, "").replace(/0$/, "")} M`;
  if (amount >= 1_000_000) return `Rp${(amount / 1_000_000).toFixed(0)} jt`;
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function toLocalDateTime(date: Date): string {
  const value = new Date(date);
  const now = new Date();
  const isToday = value.toDateString() === now.toDateString();
  if (isToday) return `Hari ini, ${value.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (value.toDateString() === yesterday.toDateString()) return `Kemarin, ${value.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  return value.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Real user/broker workspace data derived from persisted tables. */
export class PostgresWorkspaceRepository {
  async getUserWorkspace(userId: string, email: string): Promise<UserWorkspaceData> {
    const database = getDatabase();

    const [userRows, inquiryRows] = await Promise.all([
      database.select().from(users).where(eq(users.id, userId)).limit(1),
      database.select().from(forms).where(eq(forms.email, email)).orderBy(desc(forms.createdAt)).limit(20),
    ]);

    const user = userRows[0];
    const favoriteProperties = await this.getFavoriteProperties(userId);

    return {
      name: user?.fullName ?? "Pengguna Kurata",
      verification: user?.emailVerifiedAt ? "approved" : "not_started",
      favoriteProperties,
      inquiries: inquiryRows.map((row) => ({
        id: row.id,
        title: typeof row.payload.subject === "string" ? row.payload.subject : "Permintaan Kurata",
        broker: "Kurata Advisory",
        status: "Menunggu dihubungi",
        updatedAt: toLocalDateTime(row.createdAt),
      })),
    };
  }

  async getFavoriteProperties(userId: string): Promise<WorkspaceFavorite[]> {
    const database = getDatabase();
    const rows = await database
      .select({
        id: properties.id,
        title: properties.title,
        city: properties.city,
        province: properties.province,
        priceAmount: properties.priceAmount,
        imageUrl: properties.imageUrl,
      })
      .from(userFavorites)
      .innerJoin(properties, eq(userFavorites.propertyId, properties.id))
      .where(and(eq(userFavorites.userId, userId), eq(properties.isPublished, true)))
      .orderBy(desc(userFavorites.createdAt))
      .limit(50);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      location: `${row.city}, ${row.province}`,
      price: formatPrice(row.priceAmount),
      imageUrl: row.imageUrl,
    }));
  }

  async isFavorited(userId: string, propertyId: string): Promise<boolean> {
    const database = getDatabase();
    const [row] = await database
      .select()
      .from(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.propertyId, propertyId)))
      .limit(1);
    return Boolean(row);
  }

  async addFavorite(userId: string, propertyId: string): Promise<void> {
    const database = getDatabase();
    await database
      .insert(userFavorites)
      .values({ userId, propertyId })
      .onConflictDoNothing();
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const database = getDatabase();
    await database
      .delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.propertyId, propertyId)));
  }

  async getBrokerWorkspace(userId: string): Promise<BrokerWorkspaceData> {
    const database = getDatabase();

    const [userRows, verificationRows, assetRows] = await Promise.all([
      database.select().from(users).where(eq(users.id, userId)).limit(1),
      database.select().from(userVerifications).where(eq(userVerifications.userId, userId)).limit(1),
      database
        .select()
        .from(properties)
        .where(eq(properties.listedBy, userId))
        .orderBy(desc(properties.createdAt))
        .limit(50),
    ]);

    const user = userRows[0];

    return {
      name: user?.fullName ?? "Mitra Kurata",
      verification: verificationRows[0]?.status ?? "not_started",
      assets: assetRows.map((row) => ({
        id: row.id.toUpperCase(),
        title: row.title,
        location: `${row.city}, ${row.province}`,
        price: formatPrice(row.priceAmount),
        status: row.isPublished ? "published" : (row.reviewStatus ?? "draft"),
        updatedAt: toLocalDateTime(row.updatedAt),
        issue: null,
      })),
    };
  }

  async getUserProfile(userId: string): Promise<UserProfileData> {
    const database = getDatabase();
    const [user] = await database.select().from(users).where(eq(users.id, userId)).limit(1);

    return {
      name: user?.fullName ?? "Pengguna Kurata",
      email: user?.email ?? "",
      phone: user?.phone ?? null,
      role: user?.role ?? "user",
    };
  }

  async submitVerification(input: VerificationInput): Promise<{ status: string }> {
    const database = getDatabase();
    const now = new Date();

    await database
      .update(userVerifications)
      .set({
        status: "submitted",
        payload: {
          nik: input.nik,
          fullName: input.fullName,
          birthPlace: input.birthPlace,
          birthDate: input.birthDate,
          address: input.address,
        },
        submittedAt: now,
        version: sql`${userVerifications.version} + 1`,
        updatedAt: now,
      })
      .where(eq(userVerifications.userId, input.userId));

    return { status: "submitted" };
  }
}
