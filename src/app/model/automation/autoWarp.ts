import { Game } from "../game";
import { AbstractAutobuyer } from "./abstractAutoBuyer";

export class AutoWarp extends AbstractAutobuyer {
  skipFleetJob = false;
  skipSearchJob = false;
  maxWarp = 5;
  constructor() {
    super();
    this.id = "aw";
    this.interval = 0.001;
  }
  public get on() {
    return this.skipFleetJob || this.skipSearchJob;
  }
  public set on(value) {
    //  Do nothing
  }

  automate(): boolean {
    if (!Game.getGame().prestigeManager.autoWarp.active) return false;
    if (!this.skipFleetJob && !this.skipSearchJob) return false;
    let toSkip = 0;

    if (this.skipFleetJob) {
      const workPerSec = Game.getGame().resourceManager.shipyardWork.perSec;
      if (workPerSec.gt(0.01)) {
        const workNeeded = Game.getGame().shipyardManager.getWorkNeeded();
        const toSkipW = workNeeded.div(workPerSec).toNumber();
        if (toSkipW < this.maxWarp * 60) toSkip = toSkipW;
      }
    }
    if (this.skipSearchJob) {
      const searchPerSec = Game.getGame().resourceManager.search.perSec;
      if (searchPerSec.gt(0.01)) {
        const workNeeded = Game.getGame().enemyManager.getWorkNeeded();
        const toSkipS = workNeeded.div(searchPerSec).toNumber();
        if (toSkipS > toSkip && toSkipS < this.maxWarp * 60) toSkip = toSkipS;
      }
    }

    toSkip -= Game.getGame().timeToWarp;
    toSkip = Math.ceil(toSkip);
    toSkip = Math.min(toSkip, Game.getGame().darkMatter.toNumber());
    if (Game.getGame().prestigeManager.moreWarp.active) {
      toSkip /= 2;
    }
    if (toSkip < 0.1) return false;
    return Game.getGame().warp(toSkip);
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.sk = this.skipFleetJob;
    ret.ss = this.skipSearchJob;
    ret.mw = this.maxWarp;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("sk" in save) this.skipFleetJob = save.sk;
      if ("ss" in save) this.skipSearchJob = save.ss;
      if ("mw" in save) this.maxWarp = save.mw;
      return true;
    }
  }
  //#endregion
}
