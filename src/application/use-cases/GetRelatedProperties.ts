import { IPropertyRepository } from "../../domain/repositories/IPropertyRepository";
import { PropertyDTO } from "../dto/PropertyDTO";
import { mapPropertyToDTO } from "../mappers/PropertyMapper";

export class GetRelatedProperties {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(id: string, limit = 3): Promise<PropertyDTO[]> {
    const properties = await this.propertyRepository.getRelated(id, limit);
    return properties.map(mapPropertyToDTO);
  }
}
