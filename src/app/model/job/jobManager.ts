import { Job } from "./job";

export abstract class JobManager {
  toDo: Job[];
  done: Job[];

  addProgress(prog: Decimal): Decimal {
    let toAdd = prog;
    while (toAdd.gt(0) && this.toDo.length > 0) {
      const prevLevel = this.toDo[0].level;
      toAdd = this.toDo[0].addProgress(toAdd);
      if (this.toDo[0].level > prevLevel) {
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
  }
}
