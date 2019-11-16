import { Job } from "./job";

export abstract class JobManager {
  toDo: Job[];
  done: Job[];

  addProgress(prog: Decimal): Decimal {
    let toAdd = prog;
    while (toAdd.gt(0) && this.toDo.length > 0) {
      toAdd = this.toDo[0].addProgress(toAdd);
      if (toAdd.gte(0)) {
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
    } else {
      this.done.push(job);
    }
  }
}
