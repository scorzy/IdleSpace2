export interface IResearchData {
  id: string;
  name: string;
  description: string;
  max?: number;
  price: DecimalSource;
  growRate?: number;
  types?: string[];
  unitsToUnlock?: string[];
  researchToUnlock?: string[];
}
