import { BonusStack } from "../bonus/bonusStack";

export interface IJobType {
  id: string;
  name: string;
  icon: string;
  color: string;
  bonus?: BonusStack;
}

export interface IResearchData {
  id: string;
  name: string;
  description: string;
  max?: number;
  price: DecimalSource;
  growRate?: number;
  unitsToUnlock?: string[];
  researchToUnlock?: string[];
  type?: IJobType[];
  researchBonus?: { type: IJobType; bonus: DecimalSource }[];
}
