import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";

export class AutoPrestige extends AbstractAutobuyer {
  id = "aaPre";
  name = "Auto Prestige";
  description = "Prestige automatically.";
  minLevel = 0;
  automate(): boolean {
    if (!Game.getGame().prestigeManager.autoPrestigeCard.active) return false;
    if (Game.getGame().enemyManager.maxLevel <= this.minLevel) return false;
    Game.getGame().prestige();
    return true;
  }
  //#region Save and Load
  getSave(): any {
    const ret: any = super.getSave();
    if (this.minLevel > 0) ret.ml = this.minLevel;
    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("ml" in save) this.minLevel = save.ml;
    return true;
  }
  //#endregion
}
