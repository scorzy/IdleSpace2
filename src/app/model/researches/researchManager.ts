import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import { Technology } from "./technology";
import { TECHNOLOGIES } from "../data/technologyData";
import {
  ZERO,
  RESEARCH_TECH_EFF,
  OPTIMIZE_RES_BONUS,
  RESEARCH_ROBOTICS_MULTI,
  RESEARCH_TECH_MOD_MULTI,
  PROPULSION_SPEED_MULTI
} from "../CONSTANTS";
import { IResearchData } from "../data/iResearchData";
import { BonusStack } from "../bonus/bonusStack";

const SHIP_RESEARCH_NAV_CAP_MULTI = 5;

export class ResearchManager extends JobManager {
  researches: Research[];
  toDo: Research[];
  done: Research[];
  backlog: Research[];
  technologies: Technology[];
  unlockedTechnologies: Technology[];
  researchPriority = 50;
  researchPerSec = ZERO;
  techPerSec = ZERO;
  drag = false;
  sort = true;
  //#region Technologies
  civilEngTech: Technology;
  militaryEngTech: Technology;
  searchTech: Technology;
  navalCapTech: Technology;
  roboticsTech: Technology;
  //#endregion
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
        if (tech) {
          this.technologies.push(new Technology(tech));
        }
      }
    }
    this.civilEngTech = this.technologies.find((t) => t.id === "i");
    this.militaryEngTech = this.technologies.find((t) => t.id === "e");
    this.searchTech = this.technologies.find((t) => t.id === "r");
    this.navalCapTech = this.technologies.find((t) => t.id === "n");
    this.navalCapTech.onCompleted = () => {
      Game.getGame().updateNavalCapacity = true;
    };
    this.roboticsTech = this.technologies.find(
      (t) => t.id === TECHNOLOGIES.Robotics.id
    );
    //  Researches
    this.researches = RESEARCHES.map((resData) => new Research(resData, this));
    for (let i = 0; i < 9; i++) {
      const resData: IResearchData = {
        id: "n" + i,
        max: 1,
        name: "Naval Logistics" + i,
        description: "Increase Naval Capacity",
        type: TECHNOLOGIES.Naval,
        navalCapacity: 30 * Math.pow(2, i)
      };
      if (i + 1 < 9) {
        resData.researchToUnlock = ["n" + (i + 1)];
      }
      if (i === 1) {
        resData.researchToUnlock.push("b");
      }
      this.researches.push(new Research(resData, this));
    }

    const rs = Game.getGame().resourceManager;

    [
      {
        name: "Physics",
        id: "p",
        start: 0,
        tech: TECHNOLOGIES.Physics
      },
      {
        name: "Searching",
        id: "h",
        start: 0,
        tech: TECHNOLOGIES.Search
      },
      {
        name: "Materials",
        id: "M",
        start: 0,
        tech: TECHNOLOGIES.Materials
      },
      {
        name: "Computing",
        id: "c",
        start: 1,
        tech: TECHNOLOGIES.Computing
      },
      { name: "Energy", id: "E", start: 1, tech: TECHNOLOGIES.Energy },
      {
        name: "Robotics",
        id: "x",
        start: 1,
        tech: TECHNOLOGIES.Robotics
      },
      { name: "Mining", id: "N", start: 1, tech: TECHNOLOGIES.Mining },
      {
        name: "Propulsion",
        id: "P",
        start: 1,
        tech: TECHNOLOGIES.Propulsion
      }
    ].forEach((res) => {
      for (let i = res.start; i < 9; i++) {
        const resData: IResearchData = {
          id: res.id + i,
          max: 1,
          name: res.name + i,
          description: res.name,
          type: res.tech
        };
        if (i + 1 < 9) {
          resData.researchToUnlock = [res.id + (i + 1)];
        }
        if (i > 0) {
          const modPlus = RESEARCH_TECH_MOD_MULTI;
          const modRob = RESEARCH_ROBOTICS_MULTI;
          switch (res.id) {
            //  Robotics
            case "x":
              resData.modPoints = rs.workers.map((w) => {
                return { unitId: w.id, multi: modRob };
              });
              resData.buildingPoints = [{ buildingId: "7", quantity: 1 }];
              break;
            //  Research / Physics
            case "p":
              resData.modPoints = [{ unitId: "s", multi: modPlus }];
              resData.effMulti = [{ unitId: "s", multi: RESEARCH_TECH_EFF }];
              resData.buildingPoints = [{ buildingId: "3", quantity: 1 }];
              break;
            //  Searching
            case "h":
              resData.modPoints = [{ unitId: "r", multi: modPlus }];
              resData.effMulti = [{ unitId: "r", multi: RESEARCH_TECH_EFF }];
              resData.buildingPoints = [{ buildingId: "6", quantity: 1 }];
              break;
            //  Materials
            case "M":
              resData.modPoints = [
                { unitId: "a", multi: modPlus },
                { unitId: "w", multi: modPlus }
              ];
              resData.effMulti = [
                { unitId: "a", multi: RESEARCH_TECH_EFF },
                { unitId: "w", multi: RESEARCH_TECH_EFF }
              ];
              resData.buildingPoints = [
                { buildingId: "4", quantity: 1 },
                { buildingId: "5", quantity: 1 }
              ];
              break;
            //  Energy
            case "E":
              resData.modPoints = [{ unitId: "e", multi: modPlus }];
              resData.effMulti = [{ unitId: "e", multi: RESEARCH_TECH_EFF }];
              resData.buildingPoints = [{ buildingId: "2", quantity: 1 }];
              break;
            //  Mining
            case "N":
              resData.modPoints = [{ unitId: "m", multi: modPlus }];
              resData.effMulti = [{ unitId: "m", multi: RESEARCH_TECH_EFF }];
              resData.buildingPoints = [{ buildingId: "1", quantity: 1 }];
              break;
            //  Propulsion
            case "P":
              resData.speedMulti = PROPULSION_SPEED_MULTI;
              break;
          }

          //#region Modules
          //  Propulsion
          if (res.tech === TECHNOLOGIES.Propulsion) {
            if (i === 1) resData.modulesToUnlock = ["o"];
            if (i === 2) resData.modulesToUnlock = ["n"];
            if (i === 3) resData.modulesToUnlock = ["l"];
            // if (i === 4) resData.modulesToUnlock = [""];
            if (i === 5) resData.modulesToUnlock = ["a"];
            if (i === 6) resData.modulesToUnlock = ["c"];
            if (i === 7) resData.modulesToUnlock = ["w"];
            // if (i === 8) resData.modulesToUnlock = [""];
          }
          //  Energy - Generators
          if (res.tech === TECHNOLOGIES.Energy) {
            if (i === 1) resData.modulesToUnlock = ["T"];
            if (i === 2) resData.modulesToUnlock = ["I"];
            if (i === 4) resData.modulesToUnlock = ["F"];
            if (i === 6) resData.modulesToUnlock = ["J"];
          }
          //  Materials
          if (res.tech === TECHNOLOGIES.Materials) {
            if (i === 2) resData.modulesToUnlock = ["E"];
            if (i === 3) resData.modulesToUnlock = ["C", "G"];
            if (i === 4) resData.modulesToUnlock = ["B"];
            if (i === 5) resData.modulesToUnlock = ["b"];
            if (i === 6) resData.modulesToUnlock = ["V"];
            if (i === 7) resData.modulesToUnlock = ["D"];
          }
          //  Physics
          if (res.tech === TECHNOLOGIES.Physics) {
            if (i === 2) resData.modulesToUnlock = ["p"];
            if (i === 3) resData.modulesToUnlock = ["O", "H", "G"];
            if (i === 4) resData.modulesToUnlock = ["g"];
            if (i === 5) resData.modulesToUnlock = ["X"];
            if (i === 6) resData.modulesToUnlock = ["P"];
            if (i === 7) resData.modulesToUnlock = ["j"];
            if (i === 8) resData.modulesToUnlock = ["i", "e"];
          }
          //  Mining
          if (res.tech === TECHNOLOGIES.Mining) {
            if (i === 1) resData.modulesToUnlock = ["m"];
          }
          //  Robotics
          if (res.tech === TECHNOLOGIES.Robotics) {
            if (i === 3) resData.modulesToUnlock = ["f"];
          }
          //  Computing
          if (res.tech === TECHNOLOGIES.Robotics) {
            if (i === 2) resData.modulesToUnlock = ["t"];
          }
        }
        //#endregion
        this.researches.push(new Research(resData, this));
      }
    });
  }
  makeShipsResearches() {
    const shipyard = Game.getGame().shipyardManager;
    for (let i = 1, n = shipyard.shipTypes.length; i < n; i++) {
      const resData: IResearchData = {
        id: "s" + i,
        max: 1,
        name: shipyard.shipTypes[i].name,
        description: "Unlock " + shipyard.shipTypes[i].name,
        type: TECHNOLOGIES.MilitaryEngineering,
        shipTypeToUnlock: shipyard.shipTypes[i].id
      };
      resData.navalCapacity =
        shipyard.shipTypes[i].navalCapacity * SHIP_RESEARCH_NAV_CAP_MULTI;
      if (i + 1 < n) {
        resData.researchToUnlock = ["s" + (i + 1)];
      } else {
        resData.researchToUnlock = [];
      }
      resData.researchToUnlock.push("o" + i);
      if (i === 1) {
        resData.researchToUnlock.push("n");
      }
      this.researches.push(new Research(resData, this));
    }
    for (let i = 0, n = shipyard.shipTypes.length; i < n; i++) {
      const bonusResData: IResearchData = {
        id: "o" + i,
        max: 10,
        name: "Optimized " + shipyard.shipTypes[i].name,
        priceMulti: 0.5,
        description: "Improve " + shipyard.shipTypes[i].name + " build speed",
        type: TECHNOLOGIES.MilitaryEngineering,
        shipProductionBonus: [
          { shipType: shipyard.shipTypes[i].id, multi: OPTIMIZE_RES_BONUS }
        ]
      };
      this.researches.push(new Research(bonusResData, this));
    }
  }
  makeSpaceStationResearches() {
    const first = this.researches.find((r) => r.id === "s3");
    first.resData.researchToUnlock.push("i0");
    const spaceStations = Game.getGame().resourceManager.spaceStations;
    for (let i = 0, n = spaceStations.length; i < n; i++) {
      // Space station
      const resData: IResearchData = {
        id: "i" + i,
        max: 1,
        name: spaceStations[i].name,
        description: "Unlock " + spaceStations[i].name,
        type: TECHNOLOGIES.CivilEngineering,
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
        description: "+30% habitable space from " + spaceStations[i].name,
        type: TECHNOLOGIES.CivilEngineering,
        priceMulti: 0.8,
        stationToUp: [
          {
            stationId: spaceStations[i].id,
            habSpace: 0.5
          }
        ]
      };
      resData.researchToUnlock.push(resDataUp.id);
      if (i === 5) {
        resData.researchToUnlock.push("me");
      }
      this.researches.push(new Research(resDataUp, this));
      this.researches.push(new Research(resData, this));
    }
  }
  setRelations() {
    const rs = Game.getGame().resourceManager;
    const sm = Game.getGame().shipyardManager;
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
            if (!res.battleMulti) res.battleMulti = [];
            res.battleMulti.push({
              material,
              multi: new Decimal(multi.multi).toNumber()
            });
          }
        });
      }
      if ("prodMulti" in resData) {
        resData.prodMulti.forEach((multi) => {
          const unit = rs.units.find((u) => u.id === multi.unitId);
          if (unit) {
            unit.prodAllBonus.bonuses.push(
              new Bonus(res, new Decimal(multi.multi))
            );
            if (!res.prodMulti) res.prodMulti = [];
            res.prodMulti.push({
              unit,
              multi: multi.multi
            });
          }
        });
      }
      if ("effMulti" in resData) {
        resData.effMulti.forEach((multi) => {
          const unit = rs.units.find((u) => u.id === multi.unitId);
          if (unit) {
            unit.prodEfficiency.bonuses.push(
              new Bonus(res, new Decimal(multi.multi))
            );
            if (!res.effMulti) res.effMulti = [];
            res.effMulti.push({
              unit,
              multi: multi.multi
            });
          }
        });
      }
      if ("stationToUp" in resData) {
        resData.stationToUp.forEach((stu) => {
          const station = rs.spaceStations.find((u) => u.id === stu.stationId);
          if (!res.spaceStationsToUp) res.spaceStationsToUp = [];
          res.spaceStationsToUp.push({
            spaceStation: station,
            multi: 0.3
          });
          station.habSpaceStack.bonuses.push(new Bonus(res, new Decimal(0.3)));
        });
      }
      if ("limitMulti" in resData) {
        resData.limitMulti.forEach((lim) => {
          const unit = rs.units.find((u) => u.id === lim.unitId);
          if (!unit.limitStackMulti) unit.limitStackMulti = new BonusStack();
          unit.limitStackMulti.bonuses.push(
            new Bonus(res, new Decimal(lim.multi))
          );
          if (!res.limitMulti) res.limitMulti = [];
          res.limitMulti.push({ unit, multi: lim.multi });
        });
      }
      if ("modulesToUnlock" in resData) {
        resData.modulesToUnlock.forEach((modId) => {
          const mod = sm.modules.find((m) => m.id === modId);
          if (!res.modulesToUnlock) res.modulesToUnlock = [];
          res.modulesToUnlock.push(mod);
          mod.research = res;
        });
      }
      if ("buildingPoints" in resData) {
        resData.buildingPoints.forEach((bp) => {
          const building = rs.buildings.find((b) => b.id === bp.buildingId);
          if (!res.buildingPoints) res.buildingPoints = [];
          res.buildingPoints.push({ building, quantity: bp.quantity });
          if (!building.departmentResearches) {
            building.departmentResearches = [];
          }
          building.departmentResearches.push(res);
        });
      }
    });

    this.toDo = [this.researches[0]];
    this.done = [];
    this.backlog = [];

    this.researches[0].setLevels();
  }
  unlock(res: Research): boolean {
    if (this.toDo.findIndex((r) => r.id === res.id) > -1) {
      return false;
    }
    if (this.done.findIndex((r) => r.id === res.id) > -1) {
      return false;
    }
    if (this.backlog.findIndex((r) => r.id === res.id) > -1) {
      return false;
    }
    if (this.newJobsOnBacklog) this.backlog.push(res);
    else this.toDo.push(res);

    return true;
  }
  reloadTechList() {
    this.unlockedTechnologies = this.technologies.filter((t) => t.unlocked);
  }
  addProgress(prog: Decimal): Decimal {
    this.techPerSec = ZERO;
    if (this.unlockedTechnologies.length < 1) {
      this.researchPerSec = Game.getGame().resourceManager.science.perSec;
      return this.drag ? prog : super.addProgress(prog);
    }

    const resPercent = this.researchPriority / 100;
    const resProg = prog.times(resPercent);
    this.researchPerSec = Game.getGame().resourceManager.science.perSec.times(
      resPercent
    );
    this.techPerSec = Game.getGame().resourceManager.science.perSec.times(
      1 - resPercent
    );

    let notAdded = prog;
    if (!this.drag) {
      notAdded = super.addProgress(resProg);
      if (this.researchPriority >= 100) {
        return notAdded;
      }
    }

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
  sortJobs() {
    this.toDo.sort((a, b) =>
      a.total
        .minus(a.progress)
        .div(a.totalBonus)
        .cmp(b.total.minus(b.progress).div(b.totalBonus))
    );
  }
  //#region Save and Load
  getSave(): any {
    const ret: any = {
      d: this.done.map((r) => r.getSave()),
      t: this.toDo.map((r) => r.getSave()),
      b: this.backlog.map((r) => r.getSave()),
      e: this.unlockedTechnologies.map((t) => t.getSave()),
      r: this.researchPriority,
      s: this.sort
    };
    if (this.newJobsOnBacklog) ret.k = this.newJobsOnBacklog;
    return ret;
  }
  load(data: any) {
    this.toDo = [];
    this.done = [];
    this.backlog = [];
    if ("k" in data) this.newJobsOnBacklog = data.k;
    if ("s" in data) {
      this.sort = data.s;
    }
    for (const resData of data.t) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
        this.toDo.push(res);
      }
    }
    for (const resData of data.d) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
        this.done.push(res);
      }
    }
    for (const resData of data.b) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
        this.backlog.push(res);
      }
    }
    if ("e" in data) {
      for (const techData of data.e) {
        const tech = this.technologies.find((r) => r.id === techData.i);
        tech.unlocked = true;
        tech.load(techData);
      }
    }
    if ("r" in data) {
      this.researchPriority = data.r;
    }
    this.done.forEach((res) => {
      res.onCompleted(true);
    });
    this.reloadTechList();
  }
  //#endregion
}
