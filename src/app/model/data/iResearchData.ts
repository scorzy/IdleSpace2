import { BonusStack } from "../bonus/bonusStack";

export interface IResearchType {
  id: number;
  name: string;
  icon: string;
  bonus?: BonusStack;
}
export const RESEARCH_TYPES: { readonly [index: string]: IResearchType } = {
  Engineering: {
    id: 0,
    name: "Engineering",
    icon: ""
  }
};

export interface IResearchData {
  id: string;
  name: string;
  description: string;
  max?: number;
  price: DecimalSource;
  growRate?: number;
  unitsToUnlock?: string[];
  researchToUnlock?: string[];
  type?: IResearchType[];
  researchBonus?: { type: IResearchType; bonus: DecimalSource }[];
}
