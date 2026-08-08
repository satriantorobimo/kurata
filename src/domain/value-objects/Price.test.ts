import { describe, expect, it } from "vitest";

import { Price } from "./Price";

describe("Price", () => {
  it("rejects negative amounts", () => {
    expect(() => Price.fromRupiah(-1)).toThrow("Price cannot be negative");
  });

  it("formats plain amounts without a unit suffix", () => {
    expect(Price.fromRupiah(850_000).toDisplayString()).toBe("Rp 850.000");
  });

  it("formats millions as Juta", () => {
    expect(Price.fromRupiah(850_000_000).toDisplayString()).toBe("Rp 850 Juta");
    expect(Price.fromRupiah(1_500_000).toDisplayString()).toBe("Rp 1,5 Juta");
  });

  it("formats billions as Miliar", () => {
    expect(Price.fromRupiah(2_000_000_000).toDisplayString()).toBe("Rp 2 Miliar");
    expect(Price.fromRupiah(2_500_000_000).toDisplayString()).toBe("Rp 2500 Juta");
  });

  it("formats trillions as Triliun", () => {
    expect(Price.fromRupiah(5_200_000_000_000).toDisplayString()).toBe("Rp 5,2 Triliun");
  });

  it("returns the numeric amount", () => {
    expect(Price.fromRupiah(850_000_000).toNumber()).toBe(850_000_000);
  });
});
