import { Price } from "../value-objects/Price";
import { Area } from "../value-objects/Area";
import { Location } from "../value-objects/Location";

export type PropertyBadge = "exclusive" | "broker" | null;

export type CertificateType = "SHM" | "HGB" | "HGU" | "HP";

export interface PropertyProps {
  id: string;
  title: string;
  location: Location;
  price: Price;
  area: Area;
  certificate: CertificateType;
  badge: PropertyBadge;
  imageUrl: string;
  isFavorited: boolean;
}

/**
 * Property entity — core domain model for a land listing.
 */
export class Property {
  public readonly id: string;
  public readonly title: string;
  public readonly location: Location;
  public readonly price: Price;
  public readonly area: Area;
  public readonly certificate: CertificateType;
  public readonly badge: PropertyBadge;
  public readonly imageUrl: string;
  public readonly isFavorited: boolean;

  private constructor(props: PropertyProps) {
    this.id = props.id;
    this.title = props.title;
    this.location = props.location;
    this.price = props.price;
    this.area = props.area;
    this.certificate = props.certificate;
    this.badge = props.badge;
    this.imageUrl = props.imageUrl;
    this.isFavorited = props.isFavorited;
  }

  static create(props: PropertyProps): Property {
    return new Property(props);
  }

  toggleFavorite(): Property {
    return new Property({ ...this, isFavorited: !this.isFavorited });
  }

  get badgeLabel(): string {
    switch (this.badge) {
      case "exclusive":
        return "Exclusive Kurata";
      case "broker":
        return "Broker Partner";
      default:
        return "";
    }
  }
}
