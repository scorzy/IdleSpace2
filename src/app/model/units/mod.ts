import { IModData } from "../data/iModData";
import { ZERO, ONE } from "../CONSTANTS";

export class Mod {
  name: string;
  quantity = ZERO;
  max: Decimal;
  min: Decimal;
  uiQuantityString = "";
  uiQuantity = ZERO;
  totalBonus = ONE;
  totalBonusTemp = ONE;
  totalBonusAbs = ONE;
  totalBonusTempAbs = ONE;
  bonusValue = 0.1;
  constructor(iModData: IModData) {
    this.name = iModData.name;
    if ("max" in iModData) this.max = new Decimal(iModData.max);
    if ("min" in iModData) this.max = new Decimal(iModData.min);
  }
  reloadBonus() {
    this.totalBonus = Decimal.times(this.bonusValue, this.quantity).plus(1);
    this.totalBonusTemp = Decimal.times(this.bonusValue, this.uiQuantity).plus(
      1
    );
    this.totalBonusAbs = Decimal.times(
      this.bonusValue,
      this.quantity.abs()
    ).plus(1);
    this.totalBonusTempAbs = Decimal.times(
      this.bonusValue,
      this.uiQuantity.abs()
    ).plus(1);
  }
}
