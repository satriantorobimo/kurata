export interface SalesProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string | null;
}

export class Sales {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly location: string;
  public readonly avatarUrl: string | null;

  private constructor(props: SalesProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.location = props.location;
    this.avatarUrl = props.avatarUrl;
  }

  static create(props: SalesProps): Sales {
    return new Sales(props);
  }
}
