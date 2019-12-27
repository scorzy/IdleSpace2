import { ZERO, ONE } from "../CONSTANTS";
import { IJobType } from "../data/iResearchData";

export interface MyIcon {
  icon: string;
  color: string;
}
export abstract class Job {
  progress = ZERO;
  total: Decimal;
  max: number;
  level = 0;
  initialPrice: Decimal;
  growRate = 1.1;
  description = "";
  name = "";
  progressPercent = 0;
  timeToEnd?: number;
  totalBonus = ONE;
  totalBonusUi = ZERO;
  types: IJobType[] = [];

  /**
   * Adds progress
   * @param progress to add
   * @returns rest
   */
  addProgress(pro: DecimalSource): Decimal {
    const toAdd = this.totalBonus.times(pro);
    this.progress = this.progress.plus(toAdd);
    let ret: Decimal;
    if (this.progress.gte(this.total)) {
      // Completed !
      ret = this.progress.minus(this.total);
      ret = ret.div(this.totalBonus);
      this.progress = ZERO;
      this.onCompleted();
      this.level++;
      this.level = Math.min(this.level, this.max);
      this.reload();
    } else {
      ret = ZERO;
    }
    return ret;
  }
  getRemaining(): Decimal {
    return this.total
      .minus(this.progress)
      .div(this.totalBonus)
      .max(0);
  }
  onCompleted() {}
  reload() {
    if (this.max > 1 || !this.total) {
      this.total = this.initialPrice.times(
        Decimal.pow(this.growRate, this.level)
      );
    }
  }
  reloadUi() {
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
  }
  getIcons(): MyIcon[] {
    return [];
  }
  reloadTotalBonus() {
    const newBonus = this.types
      .map(t => t.bonus.totalBonus)
      .reduce((p, c) => p.times(c), ONE);
    if (!newBonus.eq(this.total)) this.totalBonus = newBonus;
  }
}
