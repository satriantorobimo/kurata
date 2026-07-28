/**
 * Location value object — represents a geographic location in Indonesia.
 * Immutable.
 */
export class Location {
  private constructor(
    public readonly city: string,
    public readonly province: string,
  ) {}

  static of(city: string, province: string): Location {
    return new Location(city, province);
  }

  toDisplayString(): string {
    if (this.province) {
      return `${this.city}, ${this.province}`;
    }
    return this.city;
  }

  toShortString(): string {
    return this.city;
  }
}
