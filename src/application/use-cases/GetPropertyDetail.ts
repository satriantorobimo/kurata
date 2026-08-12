import { IPropertyRepository } from "../../domain/repositories/IPropertyRepository";
import { PropertyDetailDTO } from "../dto/PropertyDetailDTO";
import { mapPropertyToDTO } from "../mappers/PropertyMapper";

export class GetPropertyDetail {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(id: string): Promise<PropertyDetailDTO | null> {
    const detail = await this.propertyRepository.getById(id);
    if (!detail) return null;

    return {
      ...mapPropertyToDTO(detail.property),
      description: detail.description,
      imageUrls: detail.imageUrls,
      dimensions: detail.dimensions,
      zoning: detail.zoning,
      roadAccess: detail.roadAccess,
      legalStatus: detail.legalStatus,
      address: detail.address,
      facilities: detail.facilities,
      listedAt: detail.listedAt,
      contactLabel: detail.contactLabel,
      brokerName: detail.brokerName,
      brokerCity: detail.brokerCity,
      brokerPhone: detail.brokerPhone,
      brokerAvatarKey: detail.brokerAvatarKey,
      salesName: detail.salesName,
      salesPhone: detail.salesPhone,
      salesAvatarUrl: detail.salesAvatarUrl,
    };
  }
}
