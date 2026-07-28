import {
  IPropertyRepository,
  PropertySearchCriteria,
} from "../../domain/repositories/IPropertyRepository";
import { PropertySearchResultDTO } from "../dto/PropertySearchResultDTO";
import { mapPropertyToDTO } from "../mappers/PropertyMapper";

/**
 * Use case: Search properties by query and optional filters.
 */
export class SearchProperties {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(
    criteria: PropertySearchCriteria,
  ): Promise<PropertySearchResultDTO> {
    const result = await this.propertyRepository.search(criteria);
    const totalPages = Math.max(1, Math.ceil(result.total / result.perPage));

    return {
      properties: result.properties.map(mapPropertyToDTO),
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages,
    };
  }
}
