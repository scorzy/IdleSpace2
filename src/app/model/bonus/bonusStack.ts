import { Bonus } from "./bonus";
import { ONE } from "../CONSTANTS";

export class BonusStack {
  public bonuses = new Array<Bonus>();
  public totalBonus = ONE;
  public totalBonusUi = ONE;

  reloadBonus() {
    this.totalBonus = ONE;
    this.bonuses.forEach(bon => {
      this.totalBonus = this.totalBonus.plus(bon.getBonus());
    });
  }
  reloadBonusUi() {
    const newBonus = this.totalBonus.minus(1).times(100);
    if (!newBonus.eq(this.totalBonusUi)) this.totalBonusUi = newBonus;
  }
}
