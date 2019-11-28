import { BonusStack } from "../bonus/bonusStack";

export interface IJobType {
  id: number;
  name: string;
  icon: string;
  color: string;
  bonus?: BonusStack;
}
export const RESEARCH_TYPES: { readonly [index: string]: IJobType } = {
  Engineering: {
    id: 0,
    name: "Engineering",
    icon: "setting",
    color: "#FA8C16"
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
  type?: IJobType[];
  researchBonus?: { type: IJobType; bonus: DecimalSource }[];
}
