import { IBase } from "../iBase";
import { ONE, PRESTIGE_CARD_ICON, ZERO } from "../CONSTANTS";
import { ICardData } from "../data/prestigeCard";
import { Game } from "../game";

export class PrestigeCard implements IBase {
  id: string;
  name: string;
  description: string;
  icon?: string;
  colorClass?: string;
  active = false;
  cardRequired = 1;
  typeIcon = PRESTIGE_CARD_ICON;
  requirement: PrestigeCard;
  selected = false;
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
