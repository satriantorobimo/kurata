import { describe, expect, it } from "vitest";

import { Location } from "./Location";

describe("Location", () => {
  it("combines city and province for display", () => {
    const location = Location.of("Bogor", "Jawa Barat");
    expect(location.toDisplayString()).toBe("Bogor, Jawa Barat");
  });

  it("returns only the city when province is empty", () => {
    const location = Location.of("Canggu", "");
    expect(location.toDisplayString()).toBe("Canggu");
  });

  it("returns the short form as the city", () => {
    expect(Location.of("Bogor", "Jawa Barat").toShortString()).toBe("Bogor");
  });
});
