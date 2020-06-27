import { ZERO, ONE } from "../CONSTANTS";
import { IJobType } from "../data/iResearchData";
import { BonusStack } from "../bonus/bonusStack";
import { Game } from "../game";
import { ShipType } from "../shipyard/ShipType";
import { Bonus } from "../bonus/bonus";

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
  totalBonus: Decimal = ONE;
  bonuses: BonusStack;
  totalBonusUi = ZERO;
  type: IJobType;
  canDelete = false;

  /**
   * Adds progress
   * @param progress to add
   * @returns rest
   */
  addProgress(pro: DecimalSource, noBonus = false): Decimal {
    const toAdd = noBonus ? pro : this.totalBonus.times(pro);
    const prev = this.progress;
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
      ret = this.progress.minus(prev).minus(toAdd).max(0);
    }
    return ret;
  }
  getRemaining(): Decimal {
    return this.total.minus(this.progress).div(this.totalBonus).ceil().max(1);
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
  reloadTotalBonus() {
    this.totalBonus = this.type.bonus.totalBonus;
    if (this.bonuses) {
      this.bonuses.reloadBonus();
      this.totalBonus = this.totalBonus.times(this.bonuses.totalBonus);
    }
  }
  abstract getSave(): any;
  delete() {}
  addShipBonus(shipType: ShipType) {
    Game.getGame().researchManager.researches.forEach((res) => {
      if (res.shipProductionBonus) {
        res.shipProductionBonus.forEach((bon) => {
          if (bon.shipType === shipType) {
            if (!this.bonuses) this.bonuses = new BonusStack();
            this.bonuses.bonuses.push(new Bonus(res, new Decimal(bon.multi)));
          }
        });
      }
      if (res.shipProductionBonusAll) {
        if (!this.bonuses) this.bonuses = new BonusStack();
        this.bonuses.bonuses.push(
          new Bonus(res, new Decimal(res.shipProductionBonusAll))
        );
      }
    });
  }
}
