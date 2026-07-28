import { IBrokerApplicationRepository } from "../../domain/repositories/IBrokerApplicationRepository";
import { BrokerApplicationInput } from "../dto/BrokerApplicationDTO";

export class SubmitBrokerApplication {
  constructor(private readonly brokerApplicationRepository: IBrokerApplicationRepository) {}

  async execute(input: BrokerApplicationInput): Promise<{ reference: string }> {
    const application = await this.brokerApplicationRepository.submit({
      ...input,
      id: `BRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt: new Date(),
    });

    return { reference: application.id };
  }
}
