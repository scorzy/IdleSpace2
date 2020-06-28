import { IBase } from "../iBase";
import { TEN, ZERO, ONE } from "../CONSTANTS";
import { Game } from "../game";

export class PrestigePoint implements IBase {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  colorClass?: string;
  price = TEN;
  maxBuy = ZERO;
  private realQuantity = ZERO;
  reload() {
    const pm = Game.getGame().prestigeManager;
    this.maxBuy = pm.experience.div(this.price).floor();
  }
  buy(quantity: Decimal = ONE): boolean {
    const pm = Game.getGame().prestigeManager;
    const price = this.price.times(quantity);
    if (pm.experience.lt(price)) return false;
    this.realQuantity = this.realQuantity.plus(quantity);
    pm.experience = pm.experience.minus(price);
    return true;
  }
  get quantity(): Decimal {
    return this.realQuantity.times(
      Game.getGame().prestigeManager.prestigeMultiplier
    );
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
