export interface AnimalCandidate {
  common_name_en: string;
  common_name_th: string;
  scientific_name: string;
  animal_class: string;
  habitat_en: string;
  habitat_th: string;
  diet_en: string;
  diet_th: string;
  confidence_percentage: number;
  conservation_status: string; // IUCN: LC, NT, VU, EN, CR, EW, EX
  conservation_details_en: string;
  conservation_details_th: string;
  lifespan_en: string;
  lifespan_th: string;
  geographic_range_en: string;
  geographic_range_th: string;
  physical_characteristics_en: string;
  physical_characteristics_th: string;
  behavior_en: string;
  behavior_th: string;
  ecological_role_en: string;
  ecological_role_th: string;
  fun_fact_en: string;
  fun_fact_th: string;
}

export interface IdentifyResult {
  is_animal: boolean;
  candidates: AnimalCandidate[];
}

/** Backward-compat alias */
export type AnimalDetails = IdentifyResult;
