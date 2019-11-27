import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";
import { Game } from "../game";
import { BonusStack } from "../bonus/bonusStack";
import { RESEARCH_TYPES, IResearchType } from "../data/iResearchData";
import { Bonus } from "../bonus/bonus";

export class ResearchManager extends JobManager {
  researches: Research[];
  toDo: Research[];
  done: Research[];
  backlog: Research[];
  typesList: IResearchType[];

  constructor() {
    super();
    this.typesList = [];

    for (const key in RESEARCH_TYPES) {
      if (key) {
        const resType = RESEARCH_TYPES[key];
        if (resType) {
          this.typesList.push(resType);
          resType.bonus = new BonusStack();
        }
      }
    }
    this.makeResearches();
  }

  makeResearches() {
    for (const key in RESEARCH_TYPES) {
      if (key) {
        const resType = RESEARCH_TYPES[key];
        if (resType) resType.bonus = new BonusStack();
      }
    }

    this.researches = RESEARCHES.map(resData => new Research(resData));
    this.researches.forEach(res => {
      const resData = RESEARCHES.find(r => r.id === res.id);
      if ("researchToUnlock" in resData) {
        res.researchToUnlock = resData.researchToUnlock.map(unlId =>
          this.researches.find(resToUnl => resToUnl.id === unlId)
        );
      }
      if ("unitsToUnlock" in resData) {
        res.unitsToUnlock = resData.unitsToUnlock.map(unlId =>
          Game.getGame().resouceManager.units.find(unit => unit.id === unlId)
        );
      }
      if ("researchBonus" in resData) {
        resData.researchBonus.forEach(resBonusData => {
          resBonusData.type.bonus.bonuses.push(
            new Bonus(res, new Decimal(resBonusData.bonus))
          );
        });
      }
    });
    this.toDo = [this.researches[0]];
    this.done = [];
    this.backlog = [];
  }

  unlock(res: Research): boolean {
    if (this.toDo.findIndex(r => r.id === res.id) > -1) return false;
    if (this.done.findIndex(r => r.id === res.id) > -1) return false;
    if (this.backlog.findIndex(r => r.id === res.id) > -1) return false;

    this.toDo.push(res);
    return true;
  }

  //#region Save and Load
  getSave(): any {
    return {
      d: this.done.map(r => r.getSave()),
      t: this.toDo.map(r => r.getSave()),
      b: this.backlog.map(r => r.getSave())
    };
  }
  load(data: any) {
    this.toDo = [];
    this.done = [];
    this.backlog = [];

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
  //#endregion
}
