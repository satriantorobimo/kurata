import type { SupportRequest, SupportRequestProps } from "../entities/SupportRequest";

export interface ISupportRequestRepository {
  submit(request: SupportRequestProps): Promise<SupportRequest>;
}
