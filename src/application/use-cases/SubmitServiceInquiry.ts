import { IServiceInquiryRepository } from "../../domain/repositories/IServiceInquiryRepository";
import { ServiceInquiryInput } from "../dto/ServiceInquiryDTO";

export class SubmitServiceInquiry {
  constructor(private readonly serviceInquiryRepository: IServiceInquiryRepository) {}

  async execute(input: ServiceInquiryInput): Promise<{ reference: string }> {
    const inquiry = await this.serviceInquiryRepository.submit({
      ...input,
      id: `SRV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt: new Date(),
    });
    return { reference: inquiry.id };
  }
}
