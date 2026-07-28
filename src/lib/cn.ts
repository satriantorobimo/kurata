/**
 * Utility for merging className strings with Tailwind.
 * Simple version — no external dependency needed.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
