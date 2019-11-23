import { Bonus } from "./bonus";
import { ONE } from "../CONSTANTS";

export class BonusStack {
  public bonuses = new Array<Bonus>();
  public totalBonus = ONE;
  reloadBonus() {
    this.totalBonus = ONE;
    this.bonuses.forEach(bon => {
      this.totalBonus = this.totalBonus.plus(bon.getBonus());
    });
  }
}
