import { Enemy } from "./enemy";
import { JobManager } from "../job/jobManager";
import { SearchJob } from "./searchJob";

export class EnemyManager extends JobManager {
  enemies = new Array<Enemy>();
  toDo = new Array<SearchJob>();

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

  //#region Save and Load
  getSave(): any {
    return {
      e: this.enemies.map(en => en.getSave()),
      t: this.toDo.map(t => t.getSave())
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
  }
  //#endregion
}
