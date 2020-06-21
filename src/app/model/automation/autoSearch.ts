import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";
import { MAX_SEARCH_JOB } from "../CONSTANTS";
import { SearchJob } from "../enemy/searchJob";

export class AutoSearch extends AbstractAutobuyer {
  maxLevel = 0;
  automate(): boolean {
    const em = Game.getGame().enemyManager;
    if (em.toDo.length >= MAX_SEARCH_JOB) return false;

    let levelToSearch = this.maxLevel;
    if (levelToSearch > em.maxLevel) {
      if (em.currentEnemy) {
        levelToSearch = Math.min(this.maxLevel, em.currentEnemy.level + 1);
      }

      let levels = em.toDo.map((sj) => sj.enemyLevel);
      if (em.currentEnemy) levels.push(em.currentEnemy.level);
      if (levels.length > 0) {
        levels = levels.sort((a, b) => a - b);
        levelToSearch = levels[0];
        for (let i = 1, n = levels.length; i < n; i++) {
          if (levels[i] - 1 > levelToSearch) {
            break;
          }
          levelToSearch = levels[i];
        }
      }
      levelToSearch++;
    }
    levelToSearch = Math.min(this.maxLevel, levelToSearch);
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
