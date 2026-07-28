import { Statistic } from "../entities/Statistic";

/**
 * Repository interface for statistics data.
 */
export interface IStatisticRepository {
  getAll(): Promise<Statistic[]>;
}
