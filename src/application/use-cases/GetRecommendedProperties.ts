import { IPropertyRepository } from "../../domain/repositories/IPropertyRepository";
import { PropertyDTO } from "../dto/PropertyDTO";
import { mapPropertyToDTO } from "../mappers/PropertyMapper";

export interface RecommendedResult {
  properties: PropertyDTO[];
  salesMap: Map<string, { name: string; phone: string; avatarUrl: string | null }>;
}

export class GetRecommendedProperties {
  constructor(private readonly propertyRepository: IPropertyRepository & { getSalesForProperties(propertyIds: string[]): Promise<Map<string, { name: string; phone: string; avatarUrl: string | null }>> }) {}

  async execute(): Promise<RecommendedResult> {
    const properties = await this.propertyRepository.getRecommended();
    const dtos = properties.map(mapPropertyToDTO);
    const salesMap = await this.propertyRepository.getSalesForProperties(properties.map((p) => p.id));
    return { properties: dtos, salesMap };
  }
}
