import { IBase } from "../iBase";
import { ONE, ZERO } from "../CONSTANTS";
import { ICardData } from "../data/prestigeCard";

export class PrestigeCard implements IBase {
  id: string;
  name: string;
  description: string;
  icon?: string;
  colorClass?: string;
  active = false;
  cardRequired = 1;
  constructor(data: ICardData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon = data?.icon;
    this.cardRequired = data?.cardRequired ?? 1;
  }
  get quantity(): Decimal {
    if (this.active) return ONE;
    else return ZERO;
  }
}
