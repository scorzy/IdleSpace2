import { Enemy } from "./enemy";
import { JobManager } from "../job/jobManager";
import { SearchJob } from "./searchJob";
import { FLEET_NUMBER } from "../CONSTANTS";

export class EnemyManager extends JobManager {
  enemies = new Array<Enemy>();
  toDo = new Array<SearchJob>();
  currentEnemy: Enemy;
  fleetsInBattle: Array<boolean>;

  constructor() {
    super();
    this.fleetsInBattle = new Array(FLEET_NUMBER);
  }

  search(level: number) {
    const job = new SearchJob();
    job.enemyLevel = level;
    job.reload();
    this.toDo.push(job);
  }
  generateEnemy(searchJob: SearchJob) {
    const enemy = new Enemy();
    enemy.generate(searchJob);
    this.enemies.push(enemy);
  }
  postUpdate() {
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reload();
    }
  }
  attackEnemy(enemy: Enemy) {
    if (this.currentEnemy) return false;
    this.currentEnemy = enemy;
    const index = this.enemies.indexOf(this.currentEnemy);
    if (index > 0) this.enemies.splice(index, 1);
  }
  attackCell(fleetNum: number) {
    if (this.fleetsInBattle[fleetNum]) return false;
    const toAttack = this.currentEnemy.cells.find(c => !c.done && !c.inBattle);
    if (toAttack) {
      toAttack.inBattle = true;
      this.fleetsInBattle[fleetNum] = true;
    }
  }

  //#region Save and Load
  getSave(): any {
    return {
      e: this.enemies.map(en => en.getSave()),
      t: this.toDo.map(t => t.getSave()),
      c: this.currentEnemy.getSave()
    };
  }
  load(data: any) {
    if ("e" in data) {
      this.enemies = data.e.map(enemyData => {
        const enemy = new Enemy();
        enemy.load(enemyData);
        return enemy;
      });
    }
    if ("t" in data) {
      this.toDo = data.t.map(jobData => {
        const job = new SearchJob();
        job.load(jobData);
        return job;
      });
    }
    if ("c" in data) {
      this.currentEnemy = new Enemy();
      this.currentEnemy.load(data.c);
    }
  }
  //#endregion
}
