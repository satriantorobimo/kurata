import { Property } from "../../domain/entities/Property";
import { PropertyDTO } from "../dto/PropertyDTO";

/**
 * Maps a domain Property entity to a presentational PropertyDTO.
 */
export function mapPropertyToDTO(property: Property): PropertyDTO {
  return {
    id: property.id,
    title: property.title,
    location: property.location.toDisplayString(),
    locationShort: property.location.toShortString(),
    price: property.price.toDisplayString(),
    priceValue: property.price.toNumber(),
    area: property.area.toDisplayString(),
    areaValue: property.area.toNumber(),
    certificate: property.certificate,
    badge: property.badge,
    badgeLabel: property.badgeLabel,
    imageUrl: property.imageUrl,
    isFavorited: property.isFavorited,
  };
}
