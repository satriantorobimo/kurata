import { IPropertyRepository } from "../../domain/repositories/IPropertyRepository";
import { PropertyDTO } from "../dto/PropertyDTO";
import { mapPropertyToDTO } from "../mappers/PropertyMapper";

/**
 * Use case: Retrieve recommended properties for the home page.
 */
export class GetRecommendedProperties {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(): Promise<PropertyDTO[]> {
    const properties = await this.propertyRepository.getRecommended();
    return properties.map(mapPropertyToDTO);
  }
}
