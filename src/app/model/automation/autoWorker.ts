import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Worker } from "../units/worker";
import { Game } from "../game";
import { ZERO } from "../CONSTANTS";

const RESOURCE_GAP = 1;
const DEFAULT_MAX_FACTORY = 100;
const DEFAULT_MAX_BUY = 1;

export class AutoWorker extends AbstractAutobuyer {
  maxWhenFactory = DEFAULT_MAX_FACTORY;
  maxBuy = DEFAULT_MAX_BUY;
  constructor(public worker: Worker) {
    super();
    this.id = "_" + worker.id;
    worker.autoBuyer = this;
    if (this.worker.id === "e") this.priority = 5e3;
  }
  automate(): boolean {
    if (!this.worker.unlocked) return false;
    if (this.worker.operativity < 100) return false;
    if (this.maxBuy < 1) return false;
    if (this.worker.quantity.gte(this.worker.limit)) return false;
    if (
      Game.getGame().resourceManager.replicator.quantity.gt(1) &&
      this.worker.manualBought.gte(this.maxWhenFactory)
    ) {
      return false;
    }
    this.worker.reloadMaxBuy();
    if (!this.worker.buyPrice.canBuy) return false;

    let max = Decimal.MAX_VALUE;
    for (let i = 0, n = this.worker.production.length; i < n; i++) {
      if (this.worker.production[i].ratio.lt(0)) {
        if (this.worker.production[i].product.isEnding) {
          max = ZERO;
          break;
        } else {
          const canUse =
            this.worker.production[i].product.id !== "E"
              ? this.worker.production[i].product.perSec.minus(RESOURCE_GAP)
              : this.worker.production[i].product.perSec;

          max = max.min(
            canUse
              .div(this.worker.production[i].prodPerSecFull.times(-1))
              .floor()
          );
        }
      }
    }
    if (max.gte(1)) {
      return this.worker.buy(
        this.worker.buyPrice.maxBuy.min(this.maxBuy).min(max).floor()
      );
    } else return false;
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    if (this.maxWhenFactory !== DEFAULT_MAX_FACTORY) {
      ret.mf = this.maxWhenFactory;
    }
    if (this.maxWhenFactory !== DEFAULT_MAX_BUY) ret.ma = this.maxBuy;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("mf" in save && typeof save.mf === "number") {
        this.maxWhenFactory = save.mf;
      }
      if ("ma" in save && typeof save.ma === "number") this.maxBuy = save.ma;
      return true;
    }
  }
  //#endregion
}
