import { Bonus } from "./bonus";
import { ONE } from "../CONSTANTS";

export class BonusStack {
  public bonuses = new Array<Bonus>();
  public totalBonus = ONE;
  public totalBonusUi = ONE;

  reloadBonus() {
    this.totalBonus = ONE;
    for (let i = 0, n = this.bonuses.length; i < n; i++) {
      this.totalBonus = this.totalBonus.plus(this.bonuses[i].getBonus());
    }
  }
  reloadBonusUi() {
    const newBonus = this.totalBonus.minus(1).times(100);
    if (!newBonus.eq(this.totalBonusUi)) this.totalBonusUi = newBonus;
  }
}
