import { IStatisticRepository } from "../../domain/repositories/IStatisticRepository";
import { Statistic } from "../../domain/entities/Statistic";
import { mockStatistics } from "../data/mock-statistics";

/**
 * Mock implementation of IStatisticRepository.
 */
export class MockStatisticRepository implements IStatisticRepository {
  async getAll(): Promise<Statistic[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...mockStatistics];
  }
}
