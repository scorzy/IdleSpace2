import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";
import { MAX_SEARCH_JOB } from "../CONSTANTS";

export class AutoSearch extends AbstractAutobuyer {
  maxLevel = 0;
  id = "as";
  automate(): boolean {
    const em = Game.getGame().enemyManager;
    if (em.toDo.length + em.enemies.length >= MAX_SEARCH_JOB) return false;

    let levelToSearch = this.maxLevel;
    if (levelToSearch > em.maxLevel) {
      let levels = em.toDo
        .map((sj) => sj.enemyLevel)
        .concat(em.enemies.map((e) => e.level));
      levels = levels || [];
      levels.push(em.maxLevel - 1);
      if (em.currentEnemy) {
        levels.push(em.currentEnemy.level);
      }

      if (levels.length > 0) {
        levels = levels.sort((a, b) => a - b);
        levelToSearch = levels[0];
        for (let i = 1, n = levels.length; i < n; i++) {
          if (levels[i] - 1 > levels[i - 1] || levels[i] >= this.maxLevel) {
            console.log(levels[i] + "  " + levels[i - 1]);
            break;
          }
          levelToSearch = levels[i];
        }
        levelToSearch++;
      }
    }
    levelToSearch = Math.min(Math.max(levelToSearch, 0), this.maxLevel);
    em.search(levelToSearch);
    em.sortJobs();

    return true;
  }

  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.ml = this.maxLevel;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("ml" in save) this.maxLevel = save.ml;
      return true;
    }
  }
  //#endregion
}
