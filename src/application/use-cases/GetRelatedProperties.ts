import { IPropertyRepository } from "../../domain/repositories/IPropertyRepository";
import { PropertyDTO } from "../dto/PropertyDTO";
import { mapPropertyToDTO } from "../mappers/PropertyMapper";
import type { LandType } from "../../domain/repositories/IPropertyRepository";

export class GetRelatedProperties {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(id: string, limit = 3, landType: LandType = "common"): Promise<PropertyDTO[]> {
    const properties = await this.propertyRepository.getRelated(id, limit, landType);
    return properties.map(mapPropertyToDTO);
  }
}
