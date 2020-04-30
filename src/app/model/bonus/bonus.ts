import { IBase } from "../iBase";
import { ONE } from "../CONSTANTS";

export class Bonus {
  constructor(
    public unit: IBase,
    public multiplier: Decimal,
    public secondMultiplier: DecimalSource = 1
  ) {}
  getBonus(): Decimal {
    return this.unit.quantity
      .times(this.multiplier)
      .times(this.secondMultiplier)
      .plus(ONE);
  }
  getAdditiveBonus(): Decimal {
    return this.unit.quantity
      .times(this.multiplier)
      .times(this.secondMultiplier);
  }
}
