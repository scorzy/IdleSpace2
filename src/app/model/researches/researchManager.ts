import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";

export class ResearchManager extends JobManager {
  researches: Research[];
  toDo: Research[];
  done: Research[];
  backlog: Research[];

  constructor() {
    super();
    this.makeResearches();
  }

  makeResearches() {
    this.researches = RESEARCHES.map(resData => new Research(resData));
    this.researches.forEach(res => {
      const resData = RESEARCHES.find(r => r.id === res.id);
      if ("researchToUnlock" in resData) {
        res.researchToUnlock = resData.researchToUnlock.map(unlId =>
          this.researches.find(resToUnl => resToUnl.id === unlId)
        );
      }
    });
    this.toDo = [this.researches[0]];
    this.done = [];
    this.backlog = [];
  }

  unlock(res: Research): boolean {
    if (this.toDo.findIndex(r => r.id === res.id)) return false;

    this.toDo.push(res);
    return true;
  }

  getSave(): any {
    return {
      d: this.done.map(r => r.getSave()),
      t: this.done.map(r => r.getSave()),
      b: this.done.map(r => r.getSave())
    };
  }
  load(data: any) {
    for (const resData of data.t) {
      const res = this.researches.find(r => r.id === resData.i);
      res.load(resData);
      this.toDo.push(res);
    }
    for (const resData of data.d) {
      const res = this.researches.find(r => r.id === resData.i);
      res.load(resData);
      this.done.push(res);
    }
    for (const resData of data.b) {
      const res = this.researches.find(r => r.id === resData.i);
      res.load(resData);
      this.backlog.push(res);
    }
  }
}
