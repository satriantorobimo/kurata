/**
 * PropertyDTO — flattened data transfer object for presentation layer.
 * Contains pre-formatted strings ready for display.
 */
export interface PropertyDTO {
  id: string;
  title: string;
  location: string;
  locationShort: string;
  price: string;
  priceValue: number;
  area: string;
  areaValue: number;
  certificate: string;
  badge: "exclusive" | "broker" | null;
  badgeLabel: string;
  imageUrl: string;
  isFavorited: boolean;
}
