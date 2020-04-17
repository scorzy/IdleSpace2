import { Job } from "./job";
import { ZERO } from "../CONSTANTS";

export abstract class JobManager {
  toDo: Job[];
  done: Job[];
  sort = false;

  addProgress(prog: Decimal): Decimal {
    let toAdd = prog;
    while (toAdd.gt(0) && this.toDo.length > 0) {
      // console.log(this.toDo[0].name + " " + this.toDo[0].level);
      const prevLevel = this.toDo[0].level;
      toAdd = this.toDo[0].addProgress(toAdd);
      if (
        this.toDo[0].level > prevLevel ||
        this.toDo[0].level >= this.toDo[0].max
      ) {
        this.onJobComplete();
      }
    }
    return toAdd;
  }

  /**
   *
   * Complete the first job
   */
  onJobComplete() {
    const job = this.toDo[0];
    this.toDo.shift();
    if (job.max > job.level) {
      this.toDo.push(job);
    } else if (this.done) {
      this.done.push(job);
    }
    if (this.sort) this.sortJobs();
  }
  sortJobs() {}

  getWorkNeeded(): Decimal {
    let work = ZERO;
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      work = work.plus(this.toDo[i].getRemaining());
    }
    return work;
  }
}
