/**
 * Statistic entity — represents a key metric displayed in the stats bar.
 */
export interface StatisticProps {
  id: string;
  label: string;
  value: string;
  icon: string; // lucide-react icon name
}

export class Statistic {
  public readonly id: string;
  public readonly label: string;
  public readonly value: string;
  public readonly icon: string;

  private constructor(props: StatisticProps) {
    this.id = props.id;
    this.label = props.label;
    this.value = props.value;
    this.icon = props.icon;
  }

  static create(props: StatisticProps): Statistic {
    return new Statistic(props);
  }
}
