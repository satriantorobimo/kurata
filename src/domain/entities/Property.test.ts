import { describe, expect, it } from "vitest";

import { Property, type PropertyProps } from "./Property";
import { Area } from "../value-objects/Area";
import { Location } from "../value-objects/Location";
import { Price } from "../value-objects/Price";

function sampleProperty(overrides: Partial<PropertyProps> = {}): Property {
  return Property.create({
    id: "prop-001",
    title: "Tanah View Laut - Gunungkidul",
    location: Location.of("Gunungkidul", "D.I. Yogyakarta"),
    price: Price.fromRupiah(850_000_000),
    area: Area.fromSquareMeters(2500),
    certificate: "SHM",
    badge: null,
    imageUrl: "https://example.com/image.jpg",
    isFavorited: false,
    ...overrides,
  });
}

describe("Property", () => {
  it("exposes its fields", () => {
    const property = sampleProperty();
    expect(property.id).toBe("prop-001");
    expect(property.title).toBe("Tanah View Laut - Gunungkidul");
  });

  it("labels the exclusive badge", () => {
    expect(sampleProperty({ badge: "exclusive" }).badgeLabel).toBe("Exclusive Kurata");
  });

  it("labels the broker badge", () => {
    expect(sampleProperty({ badge: "broker" }).badgeLabel).toBe("Mitra Kurata");
  });

  it("has an empty label when no badge is set", () => {
    expect(sampleProperty({ badge: null }).badgeLabel).toBe("");
  });

  it("toggles the favorite flag immutably", () => {
    const property = sampleProperty({ isFavorited: false });
    const toggled = property.toggleFavorite();
    expect(property.isFavorited).toBe(false);
    expect(toggled.isFavorited).toBe(true);
    expect(toggled.id).toBe(property.id);
  });
});
