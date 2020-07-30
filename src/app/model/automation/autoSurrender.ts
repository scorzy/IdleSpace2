import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";

export class AutoSurrender extends AbstractAutobuyer {
  losingStreak = 5;
  id = "sr";
  constructor() {
    super();
  }
  automate(): boolean {
    const game = Game.getGame();
    if (!game.enemyManager.currentEnemy) return false;
    if (game.enemyManager.lostRow < this.losingStreak) return false;
    game.enemyManager.surrender();
    return true;
  }

  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.ls = this.losingStreak;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("ls" in save) this.losingStreak = save.ls;
      return true;
    }
  }
  //#endregion
}
