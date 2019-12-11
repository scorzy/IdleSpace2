import { IJobType } from "./iResearchData";
import { BonusStack } from "../bonus/bonusStack";

export abstract class ITechnologyData implements IJobType {
  id: string;
  name: string;
  icon: string;
  color: string;
  bonus?: BonusStack;
  price: Decimal;
  ratio: number;
}

export const TECHNOLOGIES: { readonly [index: string]: ITechnologyData } = {
  Engineering: {
    id: "0",
    name: "Engineering",
    icon: "setting",
    color: "#FA8C16",
    price: new Decimal(1e3),
    ratio: 10
  }
};
