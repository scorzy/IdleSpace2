import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";

export class AutoPrestige extends AbstractAutobuyer {
  id = "aaPre";
  name = "Auto Prestige";
  description = "Prestige automatically.";
  maxLevel = 1e4;
  maxTime = 0;
  constructor() {
    super();
    this.interval = 60 * 1000;
  }
  automate(): boolean {
    const game = Game.getGame();
    if (!game.prestigeManager.autoPrestigeCard.active) return false;
    if (
      game.enemyManager.maxLevel > this.maxLevel ||
      (Date.now() - game.lastPrestigeTime) / 1000 > this.maxTime
    ) {
      game.prestige();
    }
    return true;
  }
  //#region Save and Load
  getSave(): any {
    const ret: any = super.getSave();
    ret.mx = this.maxLevel;
    ret.mt = this.maxTime;
    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("mt" in save && typeof save.mt === "number") this.maxTime = save.mt;
    if ("mx" in save && typeof save.mx === "number") this.maxLevel = save.mx;
    this.interval = 60 * 1000;
    return true;
  }
  //#endregion
}
