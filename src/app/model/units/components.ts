import { Unit } from "./unit";
import { ZERO } from "../CONSTANTS";
import { Game } from "../game";

export class Components extends Unit {
  private _uiLimit = ZERO;

  public get uiLimit() {
    return this._uiLimit;
  }

  reloadLimit() {
    this.limit = this.buildingLimit.quantity
      .plus(1)
      .times(this.buildingLimitQuantity);
    this._uiLimit = new Decimal(this.limit);
    const unlockedWorkers = Game.getGame().resourceManager.unlockedWorkers;
    for (let i = 0, n = unlockedWorkers.length; i < n; i++) {
      this.limit = this.limit.plus(unlockedWorkers[i].needComponents);
    }
    this.quantity = this.quantity.min(this.limit);
    return true;
  }
}
