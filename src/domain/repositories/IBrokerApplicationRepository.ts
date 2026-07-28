import { BrokerApplication, BrokerApplicationProps } from "../entities/BrokerApplication";

export interface IBrokerApplicationRepository {
  submit(application: BrokerApplicationProps): Promise<BrokerApplication>;
}
