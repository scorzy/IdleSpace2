import { ZERO } from "../CONSTANTS";
import { IJobType } from "../data/iResearchData";

export interface MyIcon {
  icon: string;
  color: string;
}
export abstract class Job {
  progress = ZERO;
  total: Decimal;
  max = 1;
  level = 0;
  initialPrice: Decimal;
  growRate = 1.1;
  description: string;
  name: string;
  progressPercent = 0;
  timeToEnd?: number;
  get totalBonus(): Decimal {
    return this.type.bonus.totalBonus;
  }
  totalBonusUi = ZERO;
  type: IJobType;
  canDelete = false;

  /**
   * Adds progress
   * @param progress to add
   * @returns rest
   */
  addProgress(pro: DecimalSource): Decimal {
    const toAdd = this.totalBonus.times(pro);
    this.progress = this.progress.plus(toAdd);
    let ret: Decimal;
    if (this.progress.gte(this.total) || this.total.lte(0)) {
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
    return this.total.minus(this.progress).div(this.totalBonus).ceil().max(0);
  }
  onCompleted() {}
  reload() {
    if (this.max > 1 || !this.total) {
      this.total = this.initialPrice.times(
        Decimal.pow(this.growRate, this.level)
      );
    }
    if (this.max <= 1) {
      this.total = this.initialPrice;
    }
  }
  reloadUi() {
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
    const newTotalBonUi = this.totalBonus.minus(1).times(100);
    if (!newTotalBonUi.eq(this.totalBonusUi)) {
      this.totalBonusUi = newTotalBonUi;
    }
  }
  reloadTotalBonus() {}
  abstract getSave(): any;
  delete() {}
}
