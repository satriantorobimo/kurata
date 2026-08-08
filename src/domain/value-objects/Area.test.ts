import { describe, expect, it } from "vitest";

import { Area } from "./Area";

describe("Area", () => {
  it("rejects non-positive values", () => {
    expect(() => Area.fromSquareMeters(0)).toThrow("Area must be positive");
    expect(() => Area.fromSquareMeters(-10)).toThrow("Area must be positive");
  });

  it("formats square meters in Indonesian locale", () => {
    expect(Area.fromSquareMeters(2500).toDisplayString()).toBe("2.500 m²");
  });

  it("returns the numeric value", () => {
    expect(Area.fromSquareMeters(2500).toNumber()).toBe(2500);
  });
});
