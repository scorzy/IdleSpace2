import { IBase } from "../iBase";
import { ONE, ZERO, EXP_STORAGE } from "../CONSTANTS";

export class Bonus {
  storage = false;
  constructor(
    public unit: IBase,
    public multiplier: Decimal,
    public secondMultiplier: IBase = null,
    public addUnit: IBase = null,
    public addMultiplier: Decimal = null
  ) {}
  getBonus(): Decimal {
    let ret = this.unit.quantity.times(this.multiplier);
    if (this.secondMultiplier) ret = ret.times(this.secondMultiplier.quantity);
    if (ret.gt(0) && this.addUnit && this.addMultiplier) {
      ret = ret.plus(this.addUnit.quantity.times(this.addMultiplier));
    }
    return ret.plus(ONE);
  }
  getAdditiveBonus(): Decimal {
    if (this.secondMultiplier && this.secondMultiplier.quantity.eq(0)) {
      return ZERO;
    }
    let ret = this.unit.quantity.times(this.multiplier);
    if (this.storage)
      ret = ret.times(Decimal.pow(EXP_STORAGE, this.unit.quantity));
    if (this.secondMultiplier) ret = ret.times(this.secondMultiplier.quantity);
    return ret;
  }
}
