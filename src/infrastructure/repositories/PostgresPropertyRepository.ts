import "server-only";

import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql, type SQL } from "drizzle-orm";

import { Area } from "../../domain/value-objects/Area";
import { Location } from "../../domain/value-objects/Location";
import { Price } from "../../domain/value-objects/Price";
import { Property, type PropertyBadge, type CertificateType } from "../../domain/entities/Property";
import type { PropertyDetail } from "../../domain/entities/PropertyDetail";
import type {
  IPropertyRepository,
  PropertySearchCriteria,
  PropertySearchResult,
} from "../../domain/repositories/IPropertyRepository";
import { getDatabase } from "../database/client";
import { properties, propertyImages, sales, userProfiles, users } from "../database/schema";

const VALID_CERTIFICATES = ["SHM", "HGB", "HGU", "HP"] as const;
const VALID_BADGES = ["exclusive", "broker"] as const;

function isCertificate(value: string): value is CertificateType {
  return (VALID_CERTIFICATES as readonly string[]).includes(value);
}

function isBadge(value: string | null): value is PropertyBadge {
  return value === null || (VALID_BADGES as readonly string[]).includes(value);
}

function mapRow(row: typeof properties.$inferSelect): Property {
  if (!isCertificate(row.certificate)) {
    throw new Error(`Invalid certificate for property ${row.id}: ${row.certificate}`);
  }
  if (!isBadge(row.badge)) {
    throw new Error(`Invalid badge for property ${row.id}: ${row.badge}`);
  }

  return Property.create({
    id: row.id,
    title: row.title,
    location: Location.of(row.city, row.province),
    price: Price.fromRupiah(row.priceAmount),
    area: Area.fromSquareMeters(row.areaSqm),
    certificate: row.certificate,
    badge: row.badge,
    imageUrl: row.imageUrl,
    isFavorited: row.isFavorited,
  });
}

/** Land listings from PostgreSQL, persisted in the content schema. */
export class PostgresPropertyRepository implements IPropertyRepository {
  async getRecommended(): Promise<Property[]> {
    const rows = await getDatabase()
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.isPublished, true),
          eq(properties.reviewStatus, "published"),
        ),
      )
      .orderBy(desc(properties.createdAt))
      .limit(12);

    return rows.map(mapRow);
  }

  async getById(id: string): Promise<PropertyDetail | null> {
    const database = getDatabase();
    const [row, imageRows] = await Promise.all([
      database.select().from(properties).where(eq(properties.id, id)),
      database
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, id))
        .orderBy(asc(propertyImages.position)),
    ]);

    const property = row[0];
    if (!property || !property.isPublished || property.reviewStatus !== "published") return null;

    let brokerName: string | null = null;
    let brokerCity: string | null = null;
    let brokerPhone: string | null = null;
    let brokerAvatarKey: string | null = null;

    if (property.listedBy) {
      const [broker] = await database
        .select({
          fullName: users.fullName,
          phone: users.phone,
        })
        .from(users)
        .where(eq(users.id, property.listedBy));

      if (broker) {
        brokerName = broker.fullName;
        brokerPhone = broker.phone ?? null;

        const [profile] = await database
          .select({
            city: userProfiles.city,
            avatarKey: userProfiles.avatarObjectKey,
          })
          .from(userProfiles)
          .where(eq(userProfiles.userId, property.listedBy));

        if (profile) {
          brokerCity = profile.city ?? null;
          brokerAvatarKey = profile.avatarKey ?? null;
        }
      }
    }

    let salesName: string | null = null;
    let salesPhone: string | null = null;
    let salesAvatarUrl: string | null = null;

    if (property.salesId) {
      const [salesRow] = await database
        .select({
          name: sales.name,
          phone: sales.phone,
          avatarUrl: sales.avatarUrl,
        })
        .from(sales)
        .where(eq(sales.id, property.salesId));

      if (salesRow) {
        salesName = salesRow.name;
        salesPhone = salesRow.phone;
        salesAvatarUrl = salesRow.avatarUrl ?? null;
      }
    }

    return {
      property: mapRow(property),
      description: property.description ?? "",
      imageUrls: imageRows.map((image) => image.imageUrl),
      dimensions: property.dimensions ?? "",
      zoning: property.zoning ?? "",
      roadAccess: property.roadAccess ?? "",
      legalStatus: property.legalStatus ?? "",
      address: property.address ?? "",
      facilities: property.facilities ?? [],
      listedAt: property.listedAt ?? "",
      contactLabel: property.contactLabel ?? "",
      brokerName,
      brokerCity,
      brokerPhone,
      brokerAvatarKey,
      salesName,
      salesPhone,
      salesAvatarUrl,
    };
  }

  async getRelated(id: string, limit: number): Promise<Property[]> {
    const database = getDatabase();
    const [row] = await database.select().from(properties).where(eq(properties.id, id));
    if (!row) return [];

    const relatedRows = await database
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.isPublished, true),
          eq(properties.reviewStatus, "published"),
          sql`${properties.id} != ${id}`,
          sql`(${properties.province} = ${row.province} OR ${properties.badge} IS NOT DISTINCT FROM ${row.badge})`,
        ),
      )
      .orderBy(sql`CASE WHEN ${properties.province} = ${row.province} AND ${properties.badge} IS NOT DISTINCT FROM ${row.badge} THEN 2 WHEN ${properties.province} = ${row.province} THEN 1 WHEN ${properties.badge} IS NOT DISTINCT FROM ${row.badge} THEN 1 ELSE 0 END DESC`)
      .limit(Math.max(0, limit));

    return relatedRows.map(mapRow);
  }

  async getAllIds(): Promise<string[]> {
    const rows = await getDatabase()
      .select({ id: properties.id })
      .from(properties)
      .where(
        and(
          eq(properties.isPublished, true),
          eq(properties.reviewStatus, "published"),
        ),
      );

    return rows.map((row) => row.id);
  }

  async search(criteria: PropertySearchCriteria): Promise<PropertySearchResult> {
    const database = getDatabase();
    const query = criteria.query?.trim().toLocaleLowerCase("id-ID") ?? "";
    const page = Math.max(1, criteria.page ?? 1);
    const perPage = Math.min(12, Math.max(1, criteria.perPage ?? 6));

    const conditions: SQL[] = [
      eq(properties.isPublished, true),
      eq(properties.reviewStatus, "published"),
    ];

    if (query) {
      const searchCondition = or(
        ilike(properties.title, `%${query}%`),
        ilike(properties.city, `%${query}%`),
        ilike(properties.province, `%${query}%`),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    if (criteria.certificates?.length) {
      conditions.push(inArray(properties.certificate, criteria.certificates));
    }
    if (criteria.badges?.length) {
      conditions.push(inArray(properties.badge, criteria.badges));
    }
    if (criteria.minPrice !== undefined) {
      conditions.push(gte(properties.priceAmount, criteria.minPrice));
    }
    if (criteria.maxPrice !== undefined) {
      conditions.push(lte(properties.priceAmount, criteria.maxPrice));
    }
    if (criteria.minArea !== undefined) {
      conditions.push(gte(properties.areaSqm, criteria.minArea));
    }
    if (criteria.maxArea !== undefined) {
      conditions.push(lte(properties.areaSqm, criteria.maxArea));
    }

    const where = and(...conditions);

    const orderBy = (() => {
      switch (criteria.sort) {
        case "price-asc":
          return asc(properties.priceAmount);
        case "price-desc":
          return desc(properties.priceAmount);
        case "area-asc":
          return asc(properties.areaSqm);
        case "area-desc":
          return desc(properties.areaSqm);
        default:
          return desc(properties.createdAt);
      }
    })();

    const [rows, totalRows] = await Promise.all([
      database
        .select()
        .from(properties)
        .where(where)
        .orderBy(orderBy)
        .limit(perPage)
        .offset((page - 1) * perPage),
      database
        .select({ count: sql<number>`count(*)` })
        .from(properties)
        .where(where),
    ]);

    const total = Number(totalRows[0]?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);

    const salesMap = new Map<string, { name: string; phone: string; avatarUrl: string | null }>();
    const propertiesWithSales = rows.filter((r) => r.salesId);
    if (propertiesWithSales.length > 0) {
      const salesIds = [...new Set(propertiesWithSales.map((r) => r.salesId!).filter(Boolean))];
      const salesRows = await database
        .select({ id: sales.id, name: sales.name, phone: sales.phone, avatarUrl: sales.avatarUrl })
        .from(sales)
        .where(inArray(sales.id, salesIds));

      const salesById = new Map(salesRows.map((s) => [s.id, { name: s.name, phone: s.phone, avatarUrl: s.avatarUrl ?? null }]));

      for (const row of propertiesWithSales) {
        const salesInfo = salesById.get(row.salesId!);
        if (salesInfo) salesMap.set(row.id, salesInfo);
      }
    }

    return {
      properties: rows.map(mapRow),
      total,
      page: safePage,
      perPage,
      salesMap,
    };
  }
}
