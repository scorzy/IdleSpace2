import { IBase } from "../iBase";
import { ONE } from "../CONSTANTS";

export class Bonus {
  constructor(public unit: IBase, public multiplier: Decimal) {}
  getBonus(): Decimal {
    return this.unit.quantity.times(this.multiplier).plus(ONE);
  }
  getAdditiveBonus(): Decimal {
    return this.unit.quantity.times(this.multiplier);
  }
}
