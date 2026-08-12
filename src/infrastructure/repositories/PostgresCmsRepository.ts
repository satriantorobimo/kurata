import "server-only";

import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, like, ne, or, sql, type SQL } from "drizzle-orm";

import { getDatabase } from "../database/client";
import {
  blogArticles,
  blogRelatedArticles,
  blogSections,
  contentSections,
  forms,
  passwordCredentials,
  properties,
  propertyImages,
  sales,
  siteStatistics,
  userProfiles,
  userVerifications,
  users,
} from "../database/schema";

type Database = ReturnType<typeof getDatabase>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export type KurataRole = "user" | "broker" | "admin" | "super_admin";
export type AccountStatus = "active" | "suspended" | "archived";
export type ReviewStatus = "pending" | "under_review" | "changes_requested" | "rejected" | "published" | "draft";
export type VerificationStatus = "not_started" | "submitted" | "under_review" | "approved" | "changes_requested" | "rejected";

export interface CmsDashboardData {
  properties: { total: number; published: number; pendingReview: number };
  blog: { total: number; published: number; featured: number };
  forms: { total: number; pending: number; brokerApplications: number };
  users: { total: number; active: number; brokers: number };
  sections: { total: number; published: number };
  statistics: { total: number; published: number };
}

export interface CmsProperty {
  id: string;
  title: string;
  city: string;
  province: string;
  priceAmount: number;
  areaSqm: number;
  certificate: string;
  badge: string | null;
  imageUrl: string;
  isFavorited: boolean;
  isPublished: boolean;
  reviewStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPropertyDetail extends CmsProperty {
  description: string | null;
  dimensions: string | null;
  zoning: string | null;
  roadAccess: string | null;
  legalStatus: string | null;
  address: string | null;
  facilities: string[] | null;
  listedAt: string | null;
  listedBy: string | null;
  contactLabel: string | null;
  listedByName: string | null;
  salesId: string | null;
  salesName: string | null;
}

export interface CmsPropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  position: number;
}

export interface CmsPropertyInput {
  id: string;
  title: string;
  city: string;
  province: string;
  priceAmount: number;
  areaSqm: number;
  certificate: string;
  badge: string | null;
  imageUrl: string;
  description: string | null;
  dimensions: string | null;
  zoning: string | null;
  roadAccess: string | null;
  legalStatus: string | null;
  address: string | null;
  facilities: string[] | null;
  listedAt: string | null;
  contactLabel: string | null;
  listedBy: string | null;
  salesId: string | null;
  reviewStatus?: string;
  isPublished?: boolean;
}

export interface CmsBlogListItem {
  slug: string;
  title: string;
  category: string;
  author: string;
  readingMinutes: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
}

export interface CmsBlogDetail extends CmsBlogListItem {
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  sections: { position: number; heading: string; paragraphs: string[]; points: string[] | null; callout: string | null }[];
  relatedSlugs: string[];
}

export interface CmsBlogInput {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readingMinutes: number;
  coverImageUrl: string;
  coverImageAlt: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date;
  sections: { heading: string; paragraphs: string[]; points: string[] | null; callout: string | null }[];
  relatedSlugs: string[];
}

export interface CmsContentSection {
  id: string;
  section: string;
  content: unknown;
  position: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface CmsStatistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  displayOrder: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface CmsForm {
  id: string;
  formType: string;
  fullName: string;
  email: string;
  phone: string | null;
  payload: Record<string, unknown>;
  acceptedTerms: boolean;
  reviewStatus: string;
  reviewerNotes: string | null;
  createdAt: string;
}

export interface CmsUserListItem {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  status: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface CmsUserDetail extends CmsUserListItem {
  lastSignedInAt: string | null;
  verificationStatus: string | null;
  city: string | null;
  address: string | null;
  marketingConsent: boolean | null;
  propertyCount: number;
}

export interface CmsBrokerOption {
  id: string;
  fullName: string;
  email: string;
}

export interface CmsUserInput {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: KurataRole;
  status: AccountStatus;
  passwordHash: string;
  marketingConsent: boolean;
}

export interface CmsSalesListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface CmsSalesDetail extends CmsSalesListItem {
  updatedAt: string;
}

export interface CmsSalesInput {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string | null;
}

export interface CmsSalesOption {
  id: string;
  name: string;
  email: string;
}

function toDateTime(date: Date): string {
  return new Date(date).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function toDateString(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

/** Read and write data access for the CMS area of Kurata. */
export class PostgresCmsRepository {
  // ---------------------------------------------------------------- Dashboard
  async getDashboardData(): Promise<CmsDashboardData> {
    const database = getDatabase();

    const [propertyRows, blogRows, formRows, userRows, sectionRows, statisticRows] = await Promise.all([
      Promise.all([
        database.select({ value: count() }).from(properties),
        database.select({ value: count() }).from(properties).where(eq(properties.isPublished, true)),
        database.select({ value: count() }).from(properties).where(sql`${properties.reviewStatus} in ('pending', 'under_review')`),
      ]),
      Promise.all([
        database.select({ value: count() }).from(blogArticles),
        database.select({ value: count() }).from(blogArticles).where(eq(blogArticles.isPublished, true)),
        database.select({ value: count() }).from(blogArticles).where(eq(blogArticles.isFeatured, true)),
      ]),
      Promise.all([
        database.select({ value: count() }).from(forms),
        database.select({ value: count() }).from(forms).where(eq(forms.reviewStatus, "pending")),
        database.select({ value: count() }).from(forms).where(eq(forms.formType, "broker_application")),
      ]),
      Promise.all([
        database.select({ value: count() }).from(users),
        database.select({ value: count() }).from(users).where(eq(users.status, "active")),
        database.select({ value: count() }).from(users).where(eq(users.role, "broker")),
      ]),
      Promise.all([
        database.select({ value: count() }).from(contentSections),
        database.select({ value: count() }).from(contentSections).where(eq(contentSections.isPublished, true)),
      ]),
      Promise.all([
        database.select({ value: count() }).from(siteStatistics),
        database.select({ value: count() }).from(siteStatistics).where(eq(siteStatistics.isPublished, true)),
      ]),
    ]);

    return {
      properties: {
        total: propertyRows[0][0]?.value ?? 0,
        published: propertyRows[1][0]?.value ?? 0,
        pendingReview: propertyRows[2][0]?.value ?? 0,
      },
      blog: {
        total: blogRows[0][0]?.value ?? 0,
        published: blogRows[1][0]?.value ?? 0,
        featured: blogRows[2][0]?.value ?? 0,
      },
      forms: {
        total: formRows[0][0]?.value ?? 0,
        pending: formRows[1][0]?.value ?? 0,
        brokerApplications: formRows[2][0]?.value ?? 0,
      },
      users: {
        total: userRows[0][0]?.value ?? 0,
        active: userRows[1][0]?.value ?? 0,
        brokers: userRows[2][0]?.value ?? 0,
      },
      sections: {
        total: sectionRows[0][0]?.value ?? 0,
        published: sectionRows[1][0]?.value ?? 0,
      },
      statistics: {
        total: statisticRows[0][0]?.value ?? 0,
        published: statisticRows[1][0]?.value ?? 0,
      },
    };
  }

  // ------------------------------------------------------------ Properties
  async listProperties(keyword = "", status = ""): Promise<CmsProperty[]> {
    const database = getDatabase();
    const conditions = [
      keyword ? or(like(properties.title, `%${keyword}%`), like(properties.city, `%${keyword}%`), like(properties.province, `%${keyword}%`)) : undefined,
      status === "published" ? eq(properties.isPublished, true) : undefined,
      status !== "" && status !== "published" ? eq(properties.reviewStatus, status) : undefined,
    ].filter(Boolean) as SQL[];

    const rows = await database
      .select()
      .from(properties)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(properties.updatedAt))
      .limit(200);

    return rows.map(mapProperty);
  }

  async getPropertyById(id: string): Promise<CmsPropertyDetail | null> {
    const database = getDatabase();
    const row = await database
      .select({
        property: properties,
        listedByName: users.fullName,
        salesName: sales.name,
      })
      .from(properties)
      .leftJoin(users, eq(properties.listedBy, users.id))
      .leftJoin(sales, eq(properties.salesId, sales.id))
      .where(eq(properties.id, id));

    if (!row[0]) return null;

    return {
      ...mapProperty(row[0].property),
      description: row[0].property.description,
      dimensions: row[0].property.dimensions,
      zoning: row[0].property.zoning,
      roadAccess: row[0].property.roadAccess,
      legalStatus: row[0].property.legalStatus,
      address: row[0].property.address,
      facilities: row[0].property.facilities,
      listedAt: row[0].property.listedAt,
      listedBy: row[0].property.listedBy,
      contactLabel: row[0].property.contactLabel,
      listedByName: row[0].listedByName ?? null,
      salesId: row[0].property.salesId ?? null,
      salesName: row[0].salesName ?? null,
    };
  }

  async createProperty(input: CmsPropertyInput): Promise<CmsProperty> {
    const database = getDatabase();
    const now = new Date();
    const [created] = await database
      .insert(properties)
      .values({
        id: input.id,
        title: input.title,
        city: input.city,
        province: input.province,
        priceAmount: input.priceAmount,
        areaSqm: input.areaSqm,
        certificate: input.certificate,
        badge: input.badge,
        imageUrl: input.imageUrl,
        isFavorited: false,
        description: input.description,
        dimensions: input.dimensions,
        zoning: input.zoning,
        roadAccess: input.roadAccess,
        legalStatus: input.legalStatus,
        address: input.address,
        facilities: input.facilities,
        listedAt: input.listedAt,
        contactLabel: input.contactLabel,
        isPublished: input.isPublished ?? false,
        reviewStatus: input.reviewStatus ?? "draft",
        listedBy: input.listedBy,
        salesId: input.salesId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return mapProperty(created);
  }

  async updateProperty(id: string, input: Omit<CmsPropertyInput, "id">): Promise<void> {
    await getDatabase()
      .update(properties)
      .set({
        title: input.title,
        city: input.city,
        province: input.province,
        priceAmount: input.priceAmount,
        areaSqm: input.areaSqm,
        certificate: input.certificate,
        badge: input.badge,
        imageUrl: input.imageUrl,
        description: input.description,
        dimensions: input.dimensions,
        zoning: input.zoning,
        roadAccess: input.roadAccess,
        legalStatus: input.legalStatus,
        address: input.address,
        facilities: input.facilities,
        listedAt: input.listedAt,
        contactLabel: input.contactLabel,
        listedBy: input.listedBy,
        salesId: input.salesId,
        isPublished: input.isPublished ?? false,
        reviewStatus: input.reviewStatus ?? "draft",
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id));
  }

  async deleteProperty(id: string): Promise<void> {
    await getDatabase().delete(properties).where(eq(properties.id, id));
  }

  async updatePropertyStatus(id: string, reviewStatus: string, isPublished: boolean): Promise<void> {
    await getDatabase()
      .update(properties)
      .set({ reviewStatus, isPublished, updatedAt: new Date() })
      .where(eq(properties.id, id));
  }

  async listPropertyImages(propertyId: string): Promise<CmsPropertyImage[]> {
    const rows = await getDatabase()
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(asc(propertyImages.position));

    return rows.map((row) => ({ id: row.id, propertyId: row.propertyId, imageUrl: row.imageUrl, position: row.position }));
  }

  async addPropertyImage(propertyId: string, imageUrl: string): Promise<void> {
    const database = getDatabase();
    const [row] = await database
      .select({ position: sql<number>`coalesce(max(${propertyImages.position}), 0) + 1` })
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId));

    await database.insert(propertyImages).values({
      propertyId,
      imageUrl,
      position: row?.position ?? 1,
    });
  }

  async updatePropertyImage(id: string, position: number): Promise<void> {
    await getDatabase().update(propertyImages).set({ position }).where(eq(propertyImages.id, id));
  }

  async deletePropertyImage(id: string): Promise<void> {
    await getDatabase().delete(propertyImages).where(eq(propertyImages.id, id));
  }

  async listBrokerOptions(): Promise<CmsBrokerOption[]> {
    const rows = await getDatabase()
      .select({ id: users.id, fullName: users.fullName, email: users.email })
      .from(users)
      .where(sql`${users.role} in ('broker', 'admin', 'super_admin')`)
      .orderBy(asc(users.fullName));

    return rows;
  }

  // ------------------------------------------------------------------ Blog
  async listBlogArticles(keyword = "", category = ""): Promise<CmsBlogListItem[]> {
    const conditions = [keyword ? like(blogArticles.title, `%${keyword}%`) : undefined, category ? eq(blogArticles.category, category) : undefined].filter(Boolean) as SQL[];

    const rows = await getDatabase()
      .select()
      .from(blogArticles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(blogArticles.publishedAt));

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
      author: row.author,
      readingMinutes: row.readingMinutes,
      isFeatured: row.isFeatured,
      isPublished: row.isPublished,
      publishedAt: toDateString(row.publishedAt),
    }));
  }

  async getBlogBySlug(slug: string): Promise<CmsBlogDetail | null> {
    const database = getDatabase();
    const [article] = await database.select().from(blogArticles).where(eq(blogArticles.slug, slug));
    if (!article) return null;

    const [sectionRows, relatedRows] = await Promise.all([
      database.select().from(blogSections).where(eq(blogSections.articleSlug, slug)).orderBy(asc(blogSections.position)),
      database.select().from(blogRelatedArticles).where(eq(blogRelatedArticles.articleSlug, slug)).orderBy(asc(blogRelatedArticles.position)),
    ]);

    return {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      readingMinutes: article.readingMinutes,
      coverImageUrl: article.coverImageUrl,
      coverImageAlt: article.coverImageAlt,
      isFeatured: article.isFeatured,
      isPublished: article.isPublished,
      publishedAt: toDateString(article.publishedAt),
      sections: sectionRows.map((row) => ({ position: row.position, heading: row.heading, paragraphs: row.paragraphs, points: row.points ?? null, callout: row.callout ?? null })),
      relatedSlugs: relatedRows.map((row) => row.relatedSlug),
    };
  }

  async blogSlugExists(slug: string, exceptSlug?: string): Promise<boolean> {
    const conditions = [eq(blogArticles.slug, slug), exceptSlug ? ne(blogArticles.slug, exceptSlug) : undefined].filter(Boolean);
    const [row] = await getDatabase().select({ value: count() }).from(blogArticles).where(and(...conditions));
    return (row?.value ?? 0) > 0;
  }

  async createBlog(input: CmsBlogInput): Promise<void> {
    const database = getDatabase();
    await database.transaction(async (trx) => {
      await trx.insert(blogArticles).values({
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        category: input.category,
        author: input.author,
        readingMinutes: input.readingMinutes,
        coverImageUrl: input.coverImageUrl,
        coverImageAlt: input.coverImageAlt,
        isFeatured: input.isFeatured,
        isPublished: input.isPublished,
        publishedAt: input.publishedAt,
        updatedAt: new Date(),
      });
      await insertBlogSections(trx, input.slug, input.sections);
      await insertBlogRelated(trx, input.slug, input.relatedSlugs);
    });
  }

  async updateBlog(slug: string, input: CmsBlogInput): Promise<void> {
    const database = getDatabase();
    await database.transaction(async (trx) => {
      await trx
        .update(blogArticles)
        .set({
          title: input.title,
          excerpt: input.excerpt,
          category: input.category,
          author: input.author,
          readingMinutes: input.readingMinutes,
          coverImageUrl: input.coverImageUrl,
          coverImageAlt: input.coverImageAlt,
          isFeatured: input.isFeatured,
          isPublished: input.isPublished,
          updatedAt: new Date(),
        })
        .where(eq(blogArticles.slug, slug));

      await trx.delete(blogSections).where(eq(blogSections.articleSlug, slug));
      await trx.delete(blogRelatedArticles).where(eq(blogRelatedArticles.articleSlug, slug));
      await insertBlogSections(trx, slug, input.sections);
      await insertBlogRelated(trx, slug, input.relatedSlugs);
    });
  }

  async deleteBlog(slug: string): Promise<void> {
    await getDatabase().delete(blogArticles).where(eq(blogArticles.slug, slug));
  }

  // ---------------------------------------------------------- Content sections
  async listContentSections(): Promise<CmsContentSection[]> {
    const rows = await getDatabase()
      .select()
      .from(contentSections)
      .orderBy(asc(contentSections.section), asc(contentSections.position));

    return rows.map((row) => ({ id: row.id, section: row.section, content: row.content, position: row.position, isPublished: row.isPublished, updatedAt: toDateTime(row.updatedAt) }));
  }

  async getContentSection(id: string): Promise<CmsContentSection | null> {
    const [row] = await getDatabase().select().from(contentSections).where(eq(contentSections.id, id));
    if (!row) return null;

    return { id: row.id, section: row.section, content: row.content, position: row.position, isPublished: row.isPublished, updatedAt: toDateTime(row.updatedAt) };
  }

  async createContentSection(input: { id: string; section: string; content: unknown; position: number; isPublished: boolean }): Promise<void> {
    await getDatabase().insert(contentSections).values({ id: input.id, section: input.section, content: input.content, position: input.position, isPublished: input.isPublished, updatedAt: new Date() });
  }

  async updateContentSection(id: string, input: { section: string; content: unknown; position: number; isPublished: boolean }): Promise<void> {
    await getDatabase()
      .update(contentSections)
      .set({ section: input.section, content: input.content, position: input.position, isPublished: input.isPublished, updatedAt: new Date() })
      .where(eq(contentSections.id, id));
  }

  async deleteContentSection(id: string): Promise<void> {
    await getDatabase().delete(contentSections).where(eq(contentSections.id, id));
  }

  // ---------------------------------------------------------------- Statistics
  async listStatistics(): Promise<CmsStatistic[]> {
    const rows = await getDatabase().select().from(siteStatistics).orderBy(asc(siteStatistics.displayOrder));

    return rows.map((row) => ({ id: row.id, label: row.label, value: row.value, icon: row.icon, displayOrder: row.displayOrder, isPublished: row.isPublished, updatedAt: toDateTime(row.updatedAt) }));
  }

  async getStatistic(id: string): Promise<CmsStatistic | null> {
    const [row] = await getDatabase().select().from(siteStatistics).where(eq(siteStatistics.id, id));
    if (!row) return null;

    return { id: row.id, label: row.label, value: row.value, icon: row.icon, displayOrder: row.displayOrder, isPublished: row.isPublished, updatedAt: toDateTime(row.updatedAt) };
  }

  async createStatistic(input: { id: string; label: string; value: string; icon: string; displayOrder: number; isPublished: boolean }): Promise<void> {
    await getDatabase().insert(siteStatistics).values({ id: input.id, label: input.label, value: input.value, icon: input.icon, displayOrder: input.displayOrder, isPublished: input.isPublished, updatedAt: new Date() });
  }

  async updateStatistic(id: string, input: { label: string; value: string; icon: string; displayOrder: number; isPublished: boolean }): Promise<void> {
    await getDatabase()
      .update(siteStatistics)
      .set({ label: input.label, value: input.value, icon: input.icon, displayOrder: input.displayOrder, isPublished: input.isPublished, updatedAt: new Date() })
      .where(eq(siteStatistics.id, id));
  }

  async deleteStatistic(id: string): Promise<void> {
    await getDatabase().delete(siteStatistics).where(eq(siteStatistics.id, id));
  }

  // ------------------------------------------------------------------ Forms
  async listForms(formType = "", status = "", keyword = ""): Promise<CmsForm[]> {
    const conditions = [
      formType ? eq(forms.formType, formType) : undefined,
      status ? eq(forms.reviewStatus, status) : undefined,
      keyword ? or(like(forms.fullName, `%${keyword}%`), like(forms.email, `%${keyword}%`)) : undefined,
    ].filter(Boolean) as SQL[];

    const rows = await getDatabase()
      .select()
      .from(forms)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(forms.createdAt))
      .limit(300);

    return rows.map((row) => ({ id: row.id, formType: row.formType, fullName: row.fullName, email: row.email, phone: row.phone, payload: row.payload, acceptedTerms: row.acceptedTerms, reviewStatus: row.reviewStatus, reviewerNotes: row.reviewerNotes, createdAt: toDateTime(row.createdAt) }));
  }

  async getFormById(id: string): Promise<CmsForm | null> {
    const [row] = await getDatabase().select().from(forms).where(eq(forms.id, id));
    if (!row) return null;

    return { id: row.id, formType: row.formType, fullName: row.fullName, email: row.email, phone: row.phone, payload: row.payload, acceptedTerms: row.acceptedTerms, reviewStatus: row.reviewStatus, reviewerNotes: row.reviewerNotes, createdAt: toDateTime(row.createdAt) };
  }

  async updateForm(id: string, input: { fullName: string; email: string; phone: string | null; payload: Record<string, unknown>; acceptedTerms: boolean; reviewStatus: string; reviewerNotes: string | null }): Promise<void> {
    await getDatabase()
      .update(forms)
      .set({ fullName: input.fullName, email: input.email, phone: input.phone, payload: input.payload, acceptedTerms: input.acceptedTerms, reviewStatus: input.reviewStatus, reviewerNotes: input.reviewerNotes })
      .where(eq(forms.id, id));
  }

  async promoteBrokerFromApplication(formId: string, email: string, fullName: string, phone: string | null): Promise<string | null> {
    const database = getDatabase();
    const [existingUser] = await database.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (existingUser) {
      await database
        .update(users)
        .set({ role: "broker", updatedAt: new Date() })
        .where(eq(users.id, existingUser.id));

      const [existingVerification] = await database.select().from(userVerifications).where(eq(userVerifications.userId, existingUser.id)).limit(1);
      if (existingVerification) {
        await database
          .update(userVerifications)
          .set({ status: "approved", reviewedAt: new Date(), updatedAt: new Date() })
          .where(eq(userVerifications.userId, existingUser.id));
      } else {
        await database.insert(userVerifications).values({ userId: existingUser.id, status: "approved" });
      }

      return existingUser.id;
    }

    const now = new Date();
    const userId = randomUUID();
    const tempPassword = randomUUID().replace(/-/g, "").slice(0, 16);

    const { hashPassword } = await import("@/infrastructure/auth/password-hasher");

    const passwordHash = await hashPassword(tempPassword);

    await database.transaction(async (trx) => {
      await trx
        .insert(users)
        .values({ id: userId, email: email.toLowerCase(), fullName, phone, role: "broker", status: "active", emailVerifiedAt: now, createdAt: now, updatedAt: now });

      await trx.insert(passwordCredentials).values({ userId, passwordHash, passwordChangedAt: now, mustChangePassword: true, createdAt: now, updatedAt: now });

      await trx.insert(userProfiles).values({ userId });

      await trx.insert(userVerifications).values({ userId, status: "approved" });
    });

    return userId;
  }

  // ------------------------------------------------------------------- Users
  async listUsers(keyword = "", role = "", status = ""): Promise<CmsUserListItem[]> {
    const conditions = [
      keyword ? or(like(users.fullName, `%${keyword}%`), like(users.email, `%${keyword}%`)) : undefined,
      role ? eq(users.role, role as KurataRole) : undefined,
      status ? eq(users.status, status as AccountStatus) : undefined,
    ].filter(Boolean) as SQL[];

    const rows = await getDatabase()
      .select({ id: users.id, email: users.email, fullName: users.fullName, phone: users.phone, role: users.role, status: users.status, emailVerifiedAt: users.emailVerifiedAt, createdAt: users.createdAt })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(300);

    return rows.map((row) => ({ id: row.id, email: row.email, fullName: row.fullName, phone: row.phone, role: row.role, status: row.status, emailVerifiedAt: row.emailVerifiedAt ? toDateTime(row.emailVerifiedAt) : null, createdAt: toDateTime(row.createdAt) }));
  }

  async getUserById(id: string): Promise<CmsUserDetail | null> {
    const database = getDatabase();
    const [user] = await database.select().from(users).where(eq(users.id, id));
    if (!user) return null;

    const [profile] = await database.select().from(userProfiles).where(eq(userProfiles.userId, id));
    const [verification] = await database.select().from(userVerifications).where(eq(userVerifications.userId, id));
    const [countRow] = await database.select({ count: count(properties.id) }).from(properties).where(eq(properties.listedBy, id));

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt ? toDateTime(user.emailVerifiedAt) : null,
      lastSignedInAt: user.lastSignedInAt ? toDateTime(user.lastSignedInAt) : null,
      createdAt: toDateTime(user.createdAt),
      verificationStatus: verification?.status ?? null,
      city: profile?.city ?? null,
      address: profile?.address ?? null,
      marketingConsent: profile?.marketingConsent ?? null,
      propertyCount: countRow?.count ?? 0,
    };
  }

  async createUser(input: CmsUserInput): Promise<void> {
    const database = getDatabase();
    const now = new Date();
    await database.transaction(async (trx) => {
      const [created] = await trx
        .insert(users)
        .values({ id: input.id, email: input.email, fullName: input.fullName, phone: input.phone, role: input.role, status: input.status, emailVerifiedAt: now, createdAt: now, updatedAt: now })
        .returning({ userId: users.id });

      await trx.insert(passwordCredentials).values({ userId: created.userId, passwordHash: input.passwordHash, passwordChangedAt: now, mustChangePassword: false, createdAt: now, updatedAt: now });
      await trx.insert(userProfiles).values({ userId: created.userId, marketingConsent: input.marketingConsent });
      await trx.insert(userVerifications).values({ userId: created.userId, status: "not_started" });
    });
  }

  async updateUser(id: string, input: { fullName: string; phone: string | null; role: KurataRole; status: AccountStatus }): Promise<void> {
    await getDatabase()
      .update(users)
      .set({ fullName: input.fullName, phone: input.phone, role: input.role, status: input.status, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async updateUserVerification(userId: string, input: { status: VerificationStatus; notes: string | null; reviewerId: string }): Promise<void> {
    await getDatabase()
      .update(userVerifications)
      .set({ status: input.status, reviewerNotes: input.notes, reviewedAt: new Date(), reviewerId: input.reviewerId, version: sql`${userVerifications.version} + 1`, updatedAt: new Date() })
      .where(eq(userVerifications.userId, userId));
  }

  async deleteUser(id: string): Promise<void> {
    await getDatabase().delete(users).where(eq(users.id, id));
  }

  async emailExists(email: string, exceptUserId?: string): Promise<boolean> {
    const conditions = [eq(users.email, email.toLowerCase()), exceptUserId ? ne(users.id, exceptUserId) : undefined].filter(Boolean);
    const [row] = await getDatabase().select({ value: count() }).from(users).where(and(...conditions));
    return (row?.value ?? 0) > 0;
  }

  async countSuperAdmins(): Promise<number> {
    const [row] = await getDatabase().select({ value: count() }).from(users).where(eq(users.role, "super_admin"));
    return row?.value ?? 0;
  }

  // ------------------------------------------------------------------- Sales
  async listSales(keyword = ""): Promise<CmsSalesListItem[]> {
    const conditions = [
      keyword ? or(like(sales.name, `%${keyword}%`), like(sales.email, `%${keyword}%`), like(sales.location, `%${keyword}%`)) : undefined,
    ].filter(Boolean) as SQL[];

    const rows = await getDatabase()
      .select()
      .from(sales)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(sales.createdAt))
      .limit(300);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      avatarUrl: row.avatarUrl ?? null,
      createdAt: toDateTime(row.createdAt),
    }));
  }

  async getSalesById(id: string): Promise<CmsSalesDetail | null> {
    const [row] = await getDatabase().select().from(sales).where(eq(sales.id, id));
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      avatarUrl: row.avatarUrl ?? null,
      createdAt: toDateTime(row.createdAt),
      updatedAt: toDateTime(row.updatedAt),
    };
  }

  async createSales(input: CmsSalesInput): Promise<void> {
    const now = new Date();
    await getDatabase().insert(sales).values({
      id: input.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      location: input.location,
      avatarUrl: input.avatarUrl,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateSales(id: string, input: Omit<CmsSalesInput, "id">): Promise<void> {
    await getDatabase()
      .update(sales)
      .set({
        name: input.name,
        email: input.email,
        phone: input.phone,
        location: input.location,
        avatarUrl: input.avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(sales.id, id));
  }

  async deleteSales(id: string): Promise<void> {
    await getDatabase().delete(sales).where(eq(sales.id, id));
  }

  async listSalesOptions(): Promise<CmsSalesOption[]> {
    const rows = await getDatabase()
      .select({ id: sales.id, name: sales.name, email: sales.email })
      .from(sales)
      .orderBy(asc(sales.name));

    return rows;
  }

  async salesEmailExists(email: string, exceptId?: string): Promise<boolean> {
    const conditions = [eq(sales.email, email.toLowerCase()), exceptId ? ne(sales.id, exceptId) : undefined].filter(Boolean);
    const [row] = await getDatabase().select({ value: count() }).from(sales).where(and(...conditions));
    return (row?.value ?? 0) > 0;
  }
}

function mapProperty(row: typeof properties.$inferSelect): CmsProperty {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    province: row.province,
    priceAmount: row.priceAmount,
    areaSqm: row.areaSqm,
    certificate: row.certificate,
    badge: row.badge,
    imageUrl: row.imageUrl,
    isFavorited: row.isFavorited,
    isPublished: row.isPublished,
    reviewStatus: row.reviewStatus,
    createdAt: toDateTime(row.createdAt),
    updatedAt: toDateTime(row.updatedAt),
  };
}

async function insertBlogSections(trx: Transaction, articleSlug: string, sections: CmsBlogInput["sections"]): Promise<void> {
  if (sections.length === 0) return;
  await trx.insert(blogSections).values(
    sections.map((section, index) => ({ articleSlug, position: index + 1, heading: section.heading, paragraphs: section.paragraphs, points: section.points ?? null, callout: section.callout })),
  );
}

async function insertBlogRelated(trx: Transaction, articleSlug: string, relatedSlugs: string[]): Promise<void> {
  if (relatedSlugs.length === 0) return;
  await trx.insert(blogRelatedArticles).values(relatedSlugs.map((relatedSlug, index) => ({ articleSlug, relatedSlug, position: index + 1 })));
}