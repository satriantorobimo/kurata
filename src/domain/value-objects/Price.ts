/**
 * Price value object — represents a monetary amount in Indonesian Rupiah (IDR).
 * Immutable. Provides formatting for display.
 */
export class Price {
  private constructor(private readonly amountInRupiah: number) {}

  static fromRupiah(amount: number): Price {
    if (amount < 0) {
      throw new Error("Price cannot be negative");
    }
    return new Price(amount);
  }

  /**
   * Format for display in Indonesian locale.
   * e.g. 850_000_000 → "Rp 850 Juta"
   *      2_000_000_000 → "Rp 2 Miliar"
   *      5_200_000_000_000 → "Rp 5,2 Triliun"
   */
  toDisplayString(): string {
    if (this.amountInRupiah >= 1_000_000_000_000) {
      const trillions = this.amountInRupiah / 1_000_000_000_000;
      return `Rp ${this.formatNumber(trillions)} Triliun`;
    }
    if (this.amountInRupiah >= 1_000_000_000) {
      const billions = this.amountInRupiah / 1_000_000_000;
      if (billions >= 1 && Number.isInteger(billions)) {
        return `Rp ${billions} Miliar`;
      }
      const millions = this.amountInRupiah / 1_000_000;
      return `Rp ${this.formatNumber(millions)} Juta`;
    }
    if (this.amountInRupiah >= 1_000_000) {
      const millions = this.amountInRupiah / 1_000_000;
      return `Rp ${this.formatNumber(millions)} Juta`;
    }
    return `Rp ${this.amountInRupiah.toLocaleString("id-ID")}`;
  }

  toNumber(): number {
    return this.amountInRupiah;
  }

  private formatNumber(n: number): string {
    // Indonesian decimal separator is a comma; strip trailing zeros.
    const formatted = n.toFixed(1).replace(/\.0$/, "");
    return formatted.replace(".", ",");
  }
}
