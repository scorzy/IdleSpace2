import { Bonus } from "./bonus";
import { ONE, ZERO } from "../CONSTANTS";

export class BonusStack {
  public bonuses = new Array<Bonus>();
  public totalBonus = ONE;
  public totalBonusUi = ONE;
  public totalAdditiveBonus = ZERO;

  reloadBonus() {
    this.totalBonus = ONE;
    for (let i = 0, n = this.bonuses.length; i < n; i++) {
      this.totalBonus = this.totalBonus.times(this.bonuses[i].getBonus());
    }
  }
  reloadBonusUi() {
    const newBonus = this.totalBonus.minus(1).times(100);
    if (!newBonus.eq(this.totalBonusUi)) { this.totalBonusUi = newBonus; }
  }
  reloadAdditiveBonus() {
    this.totalAdditiveBonus = ZERO;
    for (let i = 0, n = this.bonuses.length; i < n; i++) {
      this.totalAdditiveBonus = this.totalAdditiveBonus.plus(
        this.bonuses[i].getAdditiveBonus()
      );
    }
  }
}
