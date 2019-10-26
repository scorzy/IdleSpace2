export interface IResearchData {
  id: string;
  name: string;
  description: string;
  max?: DecimalSource;
  price: DecimalSource;
  growRate?: number;
  types?: string[];
  unitsToUnlock?: string[];
  researchToUnlock?: string[];
}
