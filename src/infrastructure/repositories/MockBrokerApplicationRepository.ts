import { BrokerApplication, BrokerApplicationProps } from "../../domain/entities/BrokerApplication";
import { IBrokerApplicationRepository } from "../../domain/repositories/IBrokerApplicationRepository";

/**
 * Development-only submission store. Replace with a database or CRM-backed
 * implementation before accepting production broker applications.
 */
export class MockBrokerApplicationRepository implements IBrokerApplicationRepository {
  private readonly applications: BrokerApplication[] = [];

  async submit(application: BrokerApplicationProps): Promise<BrokerApplication> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const created = BrokerApplication.create(application);
    this.applications.push(created);
    return created;
  }
}
