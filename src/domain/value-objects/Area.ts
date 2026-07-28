/**
 * Area value object — represents land area in square meters (m²).
 * Immutable.
 */
export class Area {
  private constructor(private readonly squareMeters: number) {}

  static fromSquareMeters(value: number): Area {
    if (value <= 0) {
      throw new Error("Area must be positive");
    }
    return new Area(value);
  }

  toDisplayString(): string {
    return `${this.squareMeters.toLocaleString("id-ID")} m²`;
  }

  toNumber(): number {
    return this.squareMeters;
  }
}
