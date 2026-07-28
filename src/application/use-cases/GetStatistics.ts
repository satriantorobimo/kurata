import { IStatisticRepository } from "../../domain/repositories/IStatisticRepository";
import { StatisticDTO } from "../dto/StatisticDTO";

/**
 * Use case: Retrieve platform statistics for the stats bar.
 */
export class GetStatistics {
  constructor(private readonly statisticRepository: IStatisticRepository) {}

  async execute(): Promise<StatisticDTO[]> {
    const stats = await this.statisticRepository.getAll();
    return stats.map((s) => ({
      id: s.id,
      label: s.label,
      value: s.value,
      icon: s.icon,
    }));
  }
}
