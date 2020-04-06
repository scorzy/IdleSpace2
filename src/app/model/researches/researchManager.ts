import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import { Technology } from "./technology";
import { TECHNOLOGIES } from "../data/technologyData";
import { ZERO } from "../CONSTANTS";
import { IResearchData } from "../data/iResearchData";

const SHIP_BASE_PRICE = 1e3;
const SHIP_PRICE_MULTI = 2;
const SHIP_RESEARCH_NAV_CAP_MULTI = 5;
const SPACE_STATION_MULTI = 2;

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
  researchPerSec = ZERO;
  navalCapTech: Technology;
  roboticsTech: Technology;
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
    this.navalCapTech = this.technologies.find((t) => t.id === "n");
    this.navalCapTech.onCompleted = () => {
      Game.getGame().updateNavalCapacity = true;
    };
    this.roboticsTech = this.technologies.find(
      (t) => t.id === TECHNOLOGIES.Robotics.id
    );
    this.roboticsTech.onCompleted = () => {
      Game.getGame().updateMods = true;
    };
    //  Researches
    this.researches = RESEARCHES.map((resData) => new Research(resData, this));
  }
  makeShipsResearches() {
    const shipyard = Game.getGame().shipyardManager;
    for (let i = 1, n = shipyard.shipTypes.length; i < n; i++) {
      const resData: IResearchData = {
        id: "s" + i,
        max: 1,
        name: shipyard.shipTypes[i].name,
        description: "Unlock " + shipyard.shipTypes[i].name,
        price: Decimal.pow(SHIP_PRICE_MULTI, i).times(SHIP_BASE_PRICE),
        type: [TECHNOLOGIES.MilitaryEngineering]
      };
      resData.navalCapacity =
        shipyard.shipTypes[i].navalCapacity * SHIP_RESEARCH_NAV_CAP_MULTI;
      if (i + 1 < n) {
        resData.researchToUnlock = ["s" + (i + 1)];
      }
      this.researches.push(new Research(resData, this));
    }
  }
  makeSpaceStationResearches() {
    const first = this.researches.find((r) => r.id === "s4");
    const second = this.researches.find((r) => r.id === "s5");
    first.resData.researchToUnlock.push("i0");
    const spaceStations = Game.getGame().resourceManager.spaceStations;
    for (let i = 0, n = spaceStations.length; i < n; i++) {
      // Space station
      const resData: IResearchData = {
        id: "i" + i,
        max: 1,
        name: spaceStations[i].name,
        description: "Unlock " + spaceStations[i].name,
        price: Decimal.pow(SPACE_STATION_MULTI, i).times(second.initialPrice),
        type: [TECHNOLOGIES.CivilEngineering],
        unitsToUnlock: [spaceStations[i].id]
      };
      if (i + 1 < n) {
        resData.researchToUnlock = ["i" + (i + 1)];
      } else {
        resData.researchToUnlock = [];
      }

      // Upgrade
      const resDataUp: IResearchData = {
        id: "u" + i,
        name: "Upgraded " + spaceStations[i].name,
        description: "+100% habitable space from " + spaceStations[i].name,
        price: Decimal.pow(SPACE_STATION_MULTI, i)
          .times(second.initialPrice)
          .times(10),
        type: [TECHNOLOGIES.CivilEngineering],
        stationToUp: [
          {
            stationId: spaceStations[i].id,
            habSpace: spaceStations[i].habSpace
          }
        ]
      };
      resData.researchToUnlock.push(resDataUp.id);
      this.researches.push(new Research(resDataUp, this));
      this.researches.push(new Research(resData, this));
    }
  }
  setRelations() {
    const rs = Game.getGame().resourceManager;
    this.researches.forEach((res) => {
      const resData = res.resData;
      if ("researchToUnlock" in resData) {
        res.researchToUnlock = resData.researchToUnlock.map((unlId) =>
          this.researches.find((resToUnl) => resToUnl.id === unlId)
        );
      }
      if ("unitsToUnlock" in resData) {
        res.unitsToUnlock = resData.unitsToUnlock.map((unlId) =>
          Game.getGame().resourceManager.units.find((unit) => unit.id === unlId)
        );
      }
      if ("researchBonus" in resData) {
        resData.researchBonus.forEach((resBonusData) => {
          resBonusData.type.bonus.bonuses.push(
            new Bonus(res, new Decimal(resBonusData.bonus))
          );
        });
      }
      if ("battleMulti" in resData) {
        resData.battleMulti.forEach((multi) => {
          const material = rs.units.find((u) => u.id === multi.materialId);
          if (material) {
            material.battleGainMulti.bonuses.push(
              new Bonus(res, new Decimal(multi.multi))
            );
          }
        });
      }
    });
    this.toDo = [this.researches[0]];
    this.done = [];
    this.backlog = [];

    this.researches[0].setLevels();
  }
  unlock(res: Research): boolean {
    if (this.toDo.findIndex((r) => r.id === res.id) > -1) return false;
    if (this.done.findIndex((r) => r.id === res.id) > -1) return false;
    if (this.backlog.findIndex((r) => r.id === res.id) > -1) return false;

    this.toDo.push(res);
    return true;
  }
  reloadTechList() {
    this.unlockedTechnologies = this.technologies.filter((t) => t.unlocked);
  }
  addProgress(prog: Decimal): Decimal {
    if (this.unlockedTechnologies.length < 1) {
      this.researchPerSec = Game.getGame().resourceManager.science.perSec;
      return super.addProgress(prog);
    }

    const resPercent =
      this.researchPriority /
      (this.researchPriority + this.technologiesPriority);
    const resProg = prog.times(resPercent);
    this.researchPerSec = Game.getGame().resourceManager.science.perSec.times(
      resPercent
    );

    const notAdded = super.addProgress(resProg);
    if (this.technologiesPriority <= 0) return notAdded;

    const techProg = prog.minus(resProg).plus(notAdded);
    let sum = 0;
    for (let i = 0, n = this.unlockedTechnologies.length; i < n; i++) {
      sum += this.unlockedTechnologies[i].priority;
    }
    this.unlockedTechnologies.forEach((tech) => {
      tech.addProgress(techProg.times(tech.priority / sum));
    });
    return ZERO;
  }

  //#region Save and Load
  getSave(): any {
    return {
      d: this.done.map((r) => r.getSave()),
      t: this.toDo.map((r) => r.getSave()),
      b: this.backlog.map((r) => r.getSave()),
      e: this.unlockedTechnologies.map((t) => t.getSave()),
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
      const res = this.researches.find((r) => r.id === resData.i);
      res.load(resData);
      this.toDo.push(res);
    }
    for (const resData of data.d) {
      const res = this.researches.find((r) => r.id === resData.i);
      res.load(resData);
      this.done.push(res);
    }
    for (const resData of data.b) {
      const res = this.researches.find((r) => r.id === resData.i);
      res.load(resData);
      this.backlog.push(res);
    }
    if ("e" in data) {
      for (const techData of data.e) {
        const tech = this.technologies.find((r) => r.id === techData.i);
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
    this.done.forEach((res) => {
      res.onCompleted(true);
    });
    this.reloadTechList();
  }
  //#endregion
}
