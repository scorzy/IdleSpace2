import { JobManager } from "../job/jobManager";
import { SpaceStationJob } from "./spaceStationJob";
import { Game } from "../game";

export class SpaceStationManager extends JobManager {
  toDo = new Array<SpaceStationJob>();
  done = new Array<SpaceStationJob>();

  constructor() {
    super();
  }
  postUpdate() {
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reload();
    }
  }
  getSave() {
    return {
      t: this.toDo.map(s => s.getSave())
    };
  }
  load(data: any) {
    if (!("t" in data)) return false;
    const rs = Game.getGame().resourceManager;
    data.t.forEach(jobData => {
      const unit = rs.units.find(s => s.id === data.i);
      if (unit) {
        const job = new SpaceStationJob(unit);
        job.load(jobData);
        this.toDo.push(job);
      }
    });
  }
}
