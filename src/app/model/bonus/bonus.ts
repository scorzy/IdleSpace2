import { IBase } from "../iBase";

export class Bonus {
  public constructor(public unit: IBase, public multiplier: Decimal) {}
  getBonus(): Decimal {
    return this.unit.quantity.times(this.multiplier);
  }
}
