import { IBase } from "../iBase";
import { TEN, ZERO, ONE, PRESTIGE_POINT_QUANTITY } from "../CONSTANTS";
import { Game } from "../game";

export class PrestigePoint implements IBase {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  colorClass?: string;
  price = TEN;
  maxBuy = ZERO;
  max = Decimal.MAX_VALUE;
  realQuantity = ZERO;
  requiredPoint: PrestigePoint;
  requiredQuantity = PRESTIGE_POINT_QUANTITY;
  dependantPoints: PrestigePoint[];
  unLocked = true;
  reload() {
    const pm = Game.getGame().prestigeManager;
    this.maxBuy = pm.experience.div(this.price).floor();
    this.maxBuy = Decimal.min(this.maxBuy, this.max.minus(this.realQuantity));
  }
  buy(quantity: Decimal = ONE): boolean {
    if (!this.unLocked) return false;

    const pm = Game.getGame().prestigeManager;
    const price = this.price.times(quantity);
    if (pm.experience.lt(price)) return false;
    if (this.realQuantity.plus(quantity).gt(this.max)) return false;
    this.realQuantity = this.realQuantity.plus(quantity);
    pm.experience = pm.experience.minus(price);
    if (this.dependantPoints) {
      this.dependantPoints.forEach((point) => point.checkLock());
    }
    Game.getGame().prestigeManager.reloadSpentPoints();
    return true;
  }
  get quantity(): Decimal {
    return this.realQuantity.times(
      Game.getGame().prestigeManager.prestigeMultiplier
    );
  }
  checkLock(): boolean {
    if (!this.requiredPoint) this.unLocked = true;
    else {
      this.unLocked = this.requiredPoint.realQuantity.gte(
        this.requiredQuantity
      );
    }
    return this.unLocked;
  }
  //#region
  getSave() {
    return { i: this.id, r: this.realQuantity };
  }
  load(data: any) {
    if (!("i" in data && data.i === this.id)) return false;
    if ("r" in data) this.realQuantity = new Decimal(data.r);
  }
  //#endregion
}
