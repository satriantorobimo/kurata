import {
  IPropertyRepository,
  PropertySearchCriteria,
  PropertySearchResult,
} from "../../domain/repositories/IPropertyRepository";
import { Property } from "../../domain/entities/Property";
import { PropertyDetail } from "../../domain/entities/PropertyDetail";
import { mockProperties } from "../data/mock-properties";
import { createMockPropertyDetail } from "../data/mock-property-details";

/**
 * Mock implementation of IPropertyRepository.
 * Returns hardcoded data — swap for real API client later.
 */
export class MockPropertyRepository implements IPropertyRepository {
  async getRecommended(): Promise<Property[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...mockProperties];
  }

  async getById(id: string): Promise<PropertyDetail | null> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const property = mockProperties.find((item) => item.id === id);
    return property ? createMockPropertyDetail(property) : null;
  }

  async getRelated(id: string, limit: number): Promise<Property[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const property = mockProperties.find((item) => item.id === id);
    if (!property) return [];

    return mockProperties
      .filter((item) => item.id !== id)
      .sort((a, b) => {
        const scoreA = Number(a.location.province === property.location.province) + Number(a.badge === property.badge);
        const scoreB = Number(b.location.province === property.location.province) + Number(b.badge === property.badge);
        return scoreB - scoreA;
      })
      .slice(0, Math.max(0, limit));
  }

  async getAllIds(): Promise<string[]> {
    return mockProperties.map((property) => property.id);
  }

  async search(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResult> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const query = criteria.query?.trim().toLocaleLowerCase("id-ID") ?? "";
    const page = Math.max(1, criteria.page ?? 1);
    const perPage = Math.min(12, Math.max(1, criteria.perPage ?? 6));

    const filtered = mockProperties.filter((property) => {
      const matchesQuery =
        !query ||
        property.title.toLocaleLowerCase("id-ID").includes(query) ||
        property.location.toDisplayString().toLocaleLowerCase("id-ID").includes(query);

      const matchesCertificates =
        !criteria.certificates?.length ||
        criteria.certificates.includes(property.certificate);
      const matchesBadges =
        !criteria.badges?.length ||
        (property.badge !== null && criteria.badges.includes(property.badge));
      const price = property.price.toNumber();
      const area = property.area.toNumber();
      const matchesPrice =
        (criteria.minPrice === undefined || price >= criteria.minPrice) &&
        (criteria.maxPrice === undefined || price <= criteria.maxPrice);
      const matchesArea =
        (criteria.minArea === undefined || area >= criteria.minArea) &&
        (criteria.maxArea === undefined || area <= criteria.maxArea);

      return (
        matchesQuery &&
        matchesCertificates &&
        matchesBadges &&
        matchesPrice &&
        matchesArea
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (criteria.sort) {
        case "price-asc":
          return a.price.toNumber() - b.price.toNumber();
        case "price-desc":
          return b.price.toNumber() - a.price.toNumber();
        case "area-asc":
          return a.area.toNumber() - b.area.toNumber();
        case "area-desc":
          return b.area.toNumber() - a.area.toNumber();
        default:
          return 0;
      }
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * perPage;

    return {
      properties: sorted.slice(start, start + perPage),
      total,
      page: safePage,
      perPage,
    };
  }
}
