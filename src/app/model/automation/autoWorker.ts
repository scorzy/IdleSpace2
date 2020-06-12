import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Worker } from "../units/worker";
import { Game } from "../game";
import { ONE } from "../CONSTANTS";

export class AutoWorker extends AbstractAutobuyer {
  maxWhenFactory = 100;
  constructor(public worker: Worker) {
    super();
    this.id = "_" + worker.id;
    worker.autoBuyer = this;
  }
  automate(): boolean {
    if (this.worker.quantity.gte(this.worker.limit)) return false;
    if (
      Game.getGame().resourceManager.replicator.quantity.gt(1) &&
      this.worker.manualBought.gte(this.maxWhenFactory)
    )
      return false;
    this.worker.reloadMaxBuy();
    if (!this.worker.buyPrice.canBuy) return false;

    return this.worker.buy(ONE);
  }
  //#region Save and Load
  getSave(): any {
    let ret = super.getSave();
    ret.mf = this.maxWhenFactory;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("mf" in save) this.maxWhenFactory = save.mf;
      return true;
    }
  }
  //#endregion
}
