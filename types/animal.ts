export interface AnimalCandidate {
  common_name_en: string;
  common_name_th: string;
  scientific_name: string;
  animal_class: string;
  habitat: string;
  diet: string;
  confidence_percentage: number;
  conservation_status: string; // IUCN: LC, NT, VU, EN, CR, EW, EX
  lifespan: string;
  size_info: string;
  geographic_range: string;
  fun_fact: string;
}

export interface IdentifyResult {
  is_animal: boolean;
  candidates: AnimalCandidate[];
}

/** Backward-compat alias */
export type AnimalDetails = IdentifyResult;
