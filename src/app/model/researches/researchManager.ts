import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";

export class ResearchManager extends JobManager {
  researches: Research[];
  toDo: Research[];
  done: Research[];

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
  }

  unlock(res: Research): boolean {
    if (this.toDo.findIndex(r => r.id === res.id)) return false;

    this.toDo.push(res);
    return true;
  }
}
