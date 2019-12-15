import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import { Technology } from "./technology";
import { TECHNOLOGIES } from "../data/technologyData";
import { ZERO } from "../CONSTANTS";

export class ResearchManager extends JobManager {
  researches: Research[];
  toDo: Research[];
  done: Research[];
  backlog: Research[];
  technologies: Technology[];
  unlockedTechnologies: Technology[];
  researchPriority = 50;
  technologiesPriority = 50;
  specialProjectsPriority = 50;

  constructor() {
    super();

    this.makeResearches();
  }

  makeResearches() {
    //  Technologies
    this.technologies = [];
    this.unlockedTechnologies = [];
    for (const key in TECHNOLOGIES) {
      if (key) {
        const tech = TECHNOLOGIES[key];
        if (tech) this.technologies.push(new Technology(tech));
      }
    }

    //  Researches
    this.researches = RESEARCHES.map(resData => new Research(resData, this));
    this.researches.forEach(res => {
      const resData = RESEARCHES.find(r => r.id === res.id);
      if ("researchToUnlock" in resData) {
        res.researchToUnlock = resData.researchToUnlock.map(unlId =>
          this.researches.find(resToUnl => resToUnl.id === unlId)
        );
      }
      if ("unitsToUnlock" in resData) {
        res.unitsToUnlock = resData.unitsToUnlock.map(unlId =>
          Game.getGame().resourceManager.units.find(unit => unit.id === unlId)
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
  reloadTechList() {
    this.unlockedTechnologies = this.technologies.filter(t => t.unlocked);
  }

  addProgress(prog: Decimal): Decimal {
    if (this.unlockedTechnologies.length < 1) {
      return super.addProgress(prog);
    }

    const resProg = prog.times(
      this.researchPriority /
        (this.researchPriority + this.technologiesPriority)
    );

    const notAdded = super.addProgress(resProg);
    if (this.technologiesPriority <= 0) return notAdded;

    const techProg = prog.minus(resProg).plus(notAdded);
    const sum = this.unlockedTechnologies
      .map(t => t.priority)
      .reduce((p, c) => p + c, 0);
    this.unlockedTechnologies.forEach(tech => {
      tech.addProgress(techProg.times(tech.priority / sum));
    });
    return ZERO;
  }

  //#region Save and Load
  getSave(): any {
    return {
      d: this.done.map(r => r.getSave()),
      t: this.toDo.map(r => r.getSave()),
      b: this.backlog.map(r => r.getSave()),
      e: this.unlockedTechnologies.map(t => t.getSave()),
      p: this.technologiesPriority,
      r: this.researchPriority,
      s: this.specialProjectsPriority
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
    if ("e" in data) {
      for (const techData of data.e) {
        const tech = this.technologies.find(r => r.id === techData.i);
        tech.unlocked = true;
        tech.load(techData);
      }
    }
    if ("p" in data) {
      this.technologiesPriority = data.p;
    }
    if ("r" in data) {
      this.researchPriority = data.r;
    }
    if ("s" in data) {
      this.specialProjectsPriority = data.s;
    }
    this.done.forEach(res => {
      res.onCompleted(true);
    });
    this.reloadTechList();
  }
  //#endregion
}
