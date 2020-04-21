import { IBase } from "../iBase";
import { IUnlockable } from "../iUnlocable";
import { ZERO, ONE } from "../CONSTANTS";
import { Bonus } from "../bonus/bonus";
import { BonusStack } from "../bonus/bonusStack";
import { ITechnologyData } from "../data/technologyData";
import assign from "lodash-es/assign";
import { Game } from "../game";
import { OptionsService } from "src/app/options.service";

const RESEARCH_BONUS = new Decimal(0.05);

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
  ratio = 2;
  progressPercent = 0;
  priority = 50;
  total = ZERO;
  darkColor: string;
  lightColor: string;

  constructor(data: ITechnologyData) {
    assign(this, data);
    this.bonus = new BonusStack();
    this.bonus.bonuses.push(new Bonus(this, RESEARCH_BONUS));
  }
  addProgress(progress: Decimal) {
    if (progress.lte(0)) {
      return;
    }

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
      this.onCompleted();
    }
  }
  onCompleted() {}
  unlock(): boolean {
    if (this.unlocked) {
      return false;
    }

    this.unlocked = true;
    this.quantity = ONE;
    Game.getGame().researchManager.reloadTechList();
    return true;
  }
  reloadUi() {
    const newTotal = Decimal.pow(this.ratio, this.quantity).times(this.price);
    if (!this.total.eq(newTotal)) {
      this.total = newTotal;
    }
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
  }
  setTheme() {
    this.color = OptionsService.isDark ? this.darkColor : this.lightColor;
  }
  //#region
  getSave(): any {
    return {
      i: this.id,
      q: this.quantity,
      p: this.progress,
      r: this.priority
    };
  }
  load(data: any): boolean {
    if (!("i" in data) || this.id !== data.i) {
      return false;
    }
    if ("q" in data) {
      this.quantity = new Decimal(data.q);
    }
    if ("p" in data) {
      this.progress = new Decimal(data.p);
    }
    if ("r" in data) {
      this.priority = data.r;
    }
    return true;
  }
  //#endregion
}
