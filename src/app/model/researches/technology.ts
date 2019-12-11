import { IBase } from "../iBase";
import { IUnlockable } from "../iUnlocable";
import { ZERO } from "../CONSTANTS";
import { Bonus } from "../bonus/bonus";
import { BonusStack } from "../bonus/bonusStack";
import { ITechnologyData } from "../data/technologyData";
import assign from "lodash-es/assign";

const RESEARCH_BONUS = new Decimal(1.1);

export class Technology implements IBase, IUnlockable, ITechnologyData {
  id = "";
  name = "";
  quantity = ZERO;
  icon: string;
  progress = ZERO;
  price = ZERO;
  unlocked = false;
  color: string;
  bonus?: BonusStack;
  ratio: number;

  constructor(data: ITechnologyData) {
    assign(this, data);

    this.bonus = new BonusStack();
    this.bonus.bonuses.push(new Bonus(this, RESEARCH_BONUS));
  }

  addProgress(progress: Decimal) {
    if (progress.lte(0)) return;

    this.progress = this.progress.plus(progress);
    const toBuy = Decimal.affordGeometricSeries(
      this.progress,
      this.price,
      this.ratio,
      this.quantity
    );
    if (toBuy.gt(0)) {
      this.progress = this.progress.minus(
        Decimal.sumGeometricSeries(toBuy, this.price, this.ratio, this.quantity)
      );
      this.quantity = this.quantity.plus(toBuy);
    }
  }

  unlock(): boolean {
    if (this.unlocked) return false;

    this.unlocked = true;
    return true;
  }
}
