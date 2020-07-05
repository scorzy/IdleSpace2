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
      levelToSearch = em.maxLevel;
      if (em.currentEnemy && em.currentEnemy.level === levelToSearch) {
        levelToSearch++;
      }

      let levels = em.toDo
        .map((sj) => sj.enemyLevel)
        .concat(em.enemies.map((e) => e.level));

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
    levelToSearch = Math.max(Math.min(this.maxLevel, levelToSearch), 0);
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
