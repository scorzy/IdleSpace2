import { JobManager } from "../job/jobManager";
import { RESEARCHES } from "../data/researches";
import { Research } from "./research";
import { Game } from "../game";
import { Technology } from "./technology";
import { TECHNOLOGIES } from "../data/technologyData";
import {
  ZERO,
  RESEARCH_TECH_EFF,
  OPTIMIZE_RES_BONUS,
  RESEARCH_TECH_MOD_MULTI,
  PROPULSION_SPEED_MULTI,
  OPTIMIZED_SHIP_PREFIX,
  SPACE_STATION_UP_PREFIX,
  STANDARDIZED_SHIP_PREFIX,
  STANDARDIZED_RES_BONUS,
  SPACE_STATIONS_EXPANSION,
  SPACE_STATIONS_EXPANSION_PREFIX,
  ONE,
  IDS
} from "../CONSTANTS";
import { IResearchData } from "../data/iResearchData";
import { ExclusiveResGroups } from "./exclusiveResGroups";
import { Bonus } from "../bonus/bonus";

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
  researchNotAdded = ZERO;
  autoOrigin: Research;
  autoSpecialization: Research;
  //#region Researches
  nukeResearch: Research;
  searching: Research;
  scavenging: Research;
  robotics: Research;
  assimilation: Research;
  scout: Research;
  scienceOrigin: Research;
  warOrigin: Research;
  buildersOrigin: Research;
  megaBuildersSpec: Research;
  moddersSpec: Research;
  explorersSpec: Research;
  //#endregion
  //#region Technologies
  militaryEngTech: Technology;
  civilEngTech: Technology;
  physicsTech: Technology;
  materialsTech: Technology;
  propulsionTech: Technology;
  computingTech: Technology;
  roboticsTech: Technology;
  navalCapTech: Technology;
  searchTech: Technology;
  energyTech: Technology;
  miningTech: Technology;
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
    this.militaryEngTech = this.technologies.find((t) => t.id === "e");
    this.civilEngTech = this.technologies.find((t) => t.id === "i");
    this.physicsTech = this.technologies.find((t) => t.id === "p");
    this.materialsTech = this.technologies.find((t) => t.id === "m");
    this.propulsionTech = this.technologies.find((t) => t.id === "o");
    this.computingTech = this.technologies.find((t) => t.id === "c");
    this.roboticsTech = this.technologies.find((t) => t.id === "R");
    this.navalCapTech = this.technologies.find((t) => t.id === "n");
    this.searchTech = this.technologies.find((t) => t.id === "r");
    this.energyTech = this.technologies.find((t) => t.id === "t");
    this.miningTech = this.technologies.find((t) => t.id === "l");

    this.roboticsTech = this.technologies.find(
      (t) => t.id === TECHNOLOGIES.Robotics.id
    );
    Game.getGame().additiveNavalCapStack.bonuses.push(
      new Bonus(this.navalCapTech, ONE)
    );

    //  Researches
    this.researches = RESEARCHES.map((resData) => new Research(resData, this));
    this.nukeResearch = this.researches.find((res) => res.id === "b");
    this.searching = this.researches.find((res) => res.id === "h");
    this.scavenging = this.researches.find((res) => res.id === "ns");
    this.assimilation = this.researches.find((res) => res.id === "ns1");
    this.robotics = this.researches.find((res) => res.id === "x");
    this.scienceOrigin = this.researches.find((res) => res.id === "or1");
    this.warOrigin = this.researches.find((res) => res.id === "or2");
    this.buildersOrigin = this.researches.find((res) => res.id === "or3");
    this.megaBuildersSpec = this.researches.find((res) => res.id === "spe1");
    this.moddersSpec = this.researches.find((res) => res.id === "spe2");
    this.explorersSpec = this.researches.find((res) => res.id === "spe3");

    for (let i = 0; i < 21; i++) {
      const resData: IResearchData = {
        id: "n" + i,
        max: 1,
        name: "Naval Logistics " + i,
        description: "Increase Naval Capacity",
        type: TECHNOLOGIES.Naval
      };
      if (i < 10) {
        resData.navalCapacity = 30 * Math.pow(1.75, i);
      } else {
        resData.fleetCapacity = 1e3;
      }
      if (i + 1 < 21) {
        resData.researchToUnlock = ["n" + (i + 1)];
      }
      if (i > 1) {
        resData.buildingPoints = [{ buildingId: "10", quantity: 1 }];
      }
      if (i === 1) {
        resData.researchToUnlock.push("b");
      }
      this.researches.push(new Research(resData, this));
    }

    [
      {
        name: "Physics",
        id: "p",
        start: 0,
        tech: TECHNOLOGIES.Physics,
        inspirationBuilding: "3",
        spell: IDS.Scientist + "I"
      },
      {
        name: "Searching",
        id: "h",
        start: 0,
        tech: TECHNOLOGIES.Search,
        inspirationBuilding: "6",
        spell: IDS.Searcher + "I"
      },
      {
        name: "Materials",
        id: "M",
        start: 0,
        tech: TECHNOLOGIES.Materials,
        inspirationBuilding: "4",
        spell: IDS.Metallurgist + "I"
      },
      {
        name: "Energy",
        id: "E",
        start: 0,
        tech: TECHNOLOGIES.Energy,
        inspirationBuilding: "2",
        spell: IDS.Technician + "I"
      },
      {
        name: "Computing",
        id: "c",
        start: 1,
        tech: TECHNOLOGIES.Computing,
        inspirationBuilding: ""
      },
      {
        name: "Robotics",
        id: "x",
        start: 1,
        tech: TECHNOLOGIES.Robotics,
        inspirationBuilding: "7",
        spell: IDS.Replicator + "I"
      },
      {
        name: "Mining",
        id: "N",
        start: 1,
        tech: TECHNOLOGIES.Mining,
        inspirationBuilding: "1",
        spell: IDS.Miner + "I"
      },
      {
        name: "Propulsion",
        id: "P",
        start: 1,
        tech: TECHNOLOGIES.Propulsion,
        inspirationBuilding: ""
      }
    ].forEach((res) => {
      for (let i = res.start; i < 20; i++) {
        const resData: IResearchData = {
          id: res.id + i,
          max: 1,
          name: res.name + " " + (i + 1),
          description: res.name,
          type: res.tech
        };
        if (i + 1 < 20) {
          resData.researchToUnlock = [res.id + (i + 1)];
        }
        if (res.inspirationBuilding !== "") {
          resData.inspirationBuildingId = res.inspirationBuilding;
        }
        if (res.spell && i === 2) {
          resData.spellToUnlock = res.spell;
        }

        const modPlus = RESEARCH_TECH_MOD_MULTI;
        switch (res.id) {
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
            if (i > 0) {
              resData.buildingPoints = [
                { buildingId: "4", quantity: 1 },
                { buildingId: "5", quantity: 1 }
              ];
            }
            break;
          //  Propulsion
          case "P":
            resData.speedMulti = PROPULSION_SPEED_MULTI;
            break;
          //  Research / Physics
          case "p":
            resData.modPoints = [{ unitId: "s", multi: modPlus }];
            resData.effMulti = [{ unitId: "s", multi: RESEARCH_TECH_EFF }];
            if (i > 0) {
              resData.buildingPoints = [{ buildingId: "3", quantity: 1 }];
            }
            break;
          //  Searching
          case "h":
            resData.modPoints = [{ unitId: "r", multi: modPlus }];
            resData.effMulti = [{ unitId: "r", multi: RESEARCH_TECH_EFF }];
            if (i > 0) {
              resData.buildingPoints = [{ buildingId: "6", quantity: 1 }];
            }
            break;
          //  Computing
          case "c":
            resData.computingPerSec = i + 2;
            break;
          //  Energy
          case "E":
            resData.modPoints = [{ unitId: "e", multi: modPlus }];
            resData.effMulti = [{ unitId: "e", multi: RESEARCH_TECH_EFF }];
            if (i > 0) {
              resData.buildingPoints = [{ buildingId: "2", quantity: 1 }];
            }
            resData.limitMulti = [
              {
                unitId: "E",
                multi: 1
              }
            ];
            break;
        }
        if (i > 0) {
          switch (res.id) {
            //  Robotics
            case "x":
              resData.modPoints = [{ unitId: "X", multi: modPlus }];
              resData.recycling = i * 2;
              if (i > 0) {
                resData.buildingPoints = [{ buildingId: "7", quantity: 1 }];
              }
              resData.limitMulti = [
                {
                  unitId: "x",
                  multi: 0.1
                }
              ];
              break;

            //  Mining
            case "N":
              resData.modPoints = [{ unitId: "m", multi: modPlus }];
              resData.effMulti = [{ unitId: "m", multi: RESEARCH_TECH_EFF }];
              if (i > 0) {
                resData.buildingPoints = [{ buildingId: "1", quantity: 1 }];
              }
              break;
          }
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
          if (i === 11) resData.modulesToUnlock = ["d1"];
        }
        //  Energy - Generators
        if (res.tech === TECHNOLOGIES.Energy) {
          if (i === 0) resData.modulesToUnlock = ["R"];
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
          // if (i === 6) resData.modulesToUnlock = ["V"];
          if (i === 7) resData.modulesToUnlock = ["D"];
          if (i === 10) resData.modulesToUnlock = ["A2"];
        }
        //  Physics
        if (res.tech === TECHNOLOGIES.Physics) {
          if (i === 2) resData.modulesToUnlock = ["p", "tb"];
          if (i === 3) resData.modulesToUnlock = ["O", "H", "G"];
          if (i === 4) resData.modulesToUnlock = ["g"];
          if (i === 5) resData.modulesToUnlock = ["X"];
          if (i === 6) resData.modulesToUnlock = ["P"];
          if (i === 7) resData.modulesToUnlock = ["j"];
          if (i === 8) resData.modulesToUnlock = ["i", "e"];
          if (i === 11) resData.modulesToUnlock = ["L1"];
          if (i === 13) resData.modulesToUnlock = ["s1"];
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
        if (res.tech === TECHNOLOGIES.Computing) {
          if (i === 1) resData.modulesToUnlock = ["cj"];
          if (i === 2) resData.modulesToUnlock = ["t"];
        }

        //#endregion
        this.researches.push(new Research(resData, this));
      }
    });

    const civResLen = 11;
    for (let i = 0; i < civResLen; i++) {
      const resData: IResearchData = {
        id: "CV" + i,
        max: 1,
        name: "Civilian Engineering" + " " + (i + 1),
        description: "",
        commonCivilianBonus: 0.2,
        spaceStationBuildBonus: 1,
        type: TECHNOLOGIES.CivilEngineering
      };
      if (i < civResLen - 1) {
        resData.researchToUnlock = ["CV" + (1 + i)];
      }
      if (i === 0) {
        resData.unlockFrom = "i7";
      }
      this.researches.push(new Research(resData, this));
    }
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
        shipTypeToUnlock: shipyard.shipTypes[i].id,
        inspirationDescription: "Win a battle vs. " + shipyard.shipTypes[i].name
      };
      if (i === 1) resData.technologiesToUnlock = ["e"];
      resData.navalCapacity =
        shipyard.shipTypes[i].navalCapacity * SHIP_RESEARCH_NAV_CAP_MULTI;
      if (i + 1 < n) {
        resData.researchToUnlock = ["s" + (i + 1)];
      } else {
        resData.researchToUnlock = [];
      }
      resData.researchToUnlock.push(
        OPTIMIZED_SHIP_PREFIX + shipyard.shipTypes[i].id
      );
      this.researches.push(new Research(resData, this));
    }
    for (let i = 0, n = shipyard.shipTypes.length; i < n; i++) {
      const bonusResData: IResearchData = {
        id: OPTIMIZED_SHIP_PREFIX + shipyard.shipTypes[i].id,
        max: 10,
        name: "Optimized " + shipyard.shipTypes[i].name,
        priceMulti: 0.4,
        description: "Improve " + shipyard.shipTypes[i].name + " build speed",
        type: TECHNOLOGIES.MilitaryEngineering,
        shipProductionBonus: [
          { shipType: shipyard.shipTypes[i].id, multi: OPTIMIZE_RES_BONUS }
        ],
        inspirationDescription: "Build one " + shipyard.shipTypes[i].name
      };
      this.researches.push(new Research(bonusResData, this));
    }
    let prevId = "";
    for (let i = shipyard.shipTypes.length - 1; i >= 0; i--) {
      const id = STANDARDIZED_SHIP_PREFIX + shipyard.shipTypes[i].id;
      const bonusResData2: IResearchData = {
        id,
        max: 10,
        name: "Standardized " + shipyard.shipTypes[i].name,
        priceMulti: 1,
        description: "Improve " + shipyard.shipTypes[i].name + " build speed",
        type: TECHNOLOGIES.MilitaryEngineering,
        shipProductionBonus: [
          { shipType: shipyard.shipTypes[i].id, multi: STANDARDIZED_RES_BONUS }
        ],
        inspirationDescription: "Build one " + shipyard.shipTypes[i].name
      };
      if (prevId !== "") {
        bonusResData2.researchToUnlock = [prevId];
      }
      if (i === 0) {
        bonusResData2.unlockFrom = "s10";
      }
      prevId = id;
      this.researches.push(new Research(bonusResData2, this));
    }

    this.scout = this.researches.find((res) => res.id === "s1");
  }
  makeSpaceStationResearches() {
    const first = this.researches.find((r) => r.id === "s2");
    first.resData.researchToUnlock.push("i0");
    const builderUpData = RESEARCHES.find((r) => r.id === "or32");
    const orbitalExpData = RESEARCHES.find((r) => r.id === "spa");
    builderUpData.stationToUp = [];
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
        id: SPACE_STATION_UP_PREFIX + spaceStations[i].id,
        name: "Upgraded " + spaceStations[i].name,
        description: "", // "+30% habitable space from " + spaceStations[i].name,
        type: TECHNOLOGIES.CivilEngineering,
        priceMulti: 0.1,
        stationToUp: [
          {
            stationId: spaceStations[i].id,
            habSpace: 1
          }
        ]
      };
      resData.researchToUnlock.push(resDataUp.id);
      this.researches.push(new Research(resDataUp, this));
      this.researches.push(new Research(resData, this));

      builderUpData.stationToUp.push({
        stationId: spaceStations[i].id,
        habSpace: 0.25
      });
      orbitalExpData.stationToUp.push({
        stationId: spaceStations[i].id,
        habSpace: 1
      });
    }

    //  Expansions

    for (let i = spaceStations.length - 1; i >= 0; i--) {
      const id = SPACE_STATIONS_EXPANSION_PREFIX + spaceStations[i].id;
      const resDataUp: IResearchData = {
        id,
        name: spaceStations[i].name + " Expansion",
        description: "",
        type: TECHNOLOGIES.CivilEngineering,
        priceMulti: 0.1,
        stationToUp: [
          {
            stationId: spaceStations[i].id,
            habSpace: SPACE_STATIONS_EXPANSION
          }
        ]
      };
      resDataUp.unlockFrom = "CV" + (1 + i);
      this.researches.push(new Research(resDataUp, this));
    }

    //  Infrastructures
    const infrastructure = Game.getGame().resourceManager.infrastructures;
    for (let i = 0, n = infrastructure.length; i < n; i++) {
      // Upgrade
      const resDataUp: IResearchData = {
        id: SPACE_STATION_UP_PREFIX + infrastructure[i].id,
        name: "Upgraded " + infrastructure[i].name,
        description: "",
        unlockFrom: "S" + infrastructure[i].id,
        type: TECHNOLOGIES.CivilEngineering,
        priceMulti: 0.1,
        infrastructureToUp: [
          {
            infraId: infrastructure[i].id,
            bonus: 0.15
          }
        ]
      };
      this.researches.push(new Research(resDataUp, this));
    }
  }
  setRelations() {
    this.researches.forEach((res) => {
      if ("unlockFrom" in res.resData) {
        const resParent = this.researches.find(
          (r) => r.id === res.resData.unlockFrom
        );
        if (!resParent.resData.researchToUnlock) {
          resParent.resData.researchToUnlock = [];
        }
        if (!resParent.resData.researchToUnlock.some((r) => r === res.id)) {
          resParent.resData.researchToUnlock.push(res.id);
        }
      }
    });

    this.researches.forEach((res) => res.setRelations());

    this.toDo = [this.researches[0]];
    this.done = [];
    this.backlog = [];

    this.researches[0].setLevels();
  }
  setChallengesRelations() {
    this.researches.forEach((res) => res.setChallengesRelations());
  }
  unlock(res: Research): boolean {
    if (
      res.exclusiveGroup &&
      this.done.some((r1) => r1.exclusiveGroup === res.exclusiveGroup)
    ) {
      return false;
    }
    if (this.toDo.findIndex((r) => r.id === res.id) > -1) {
      return false;
    }
    if (this.done.findIndex((r) => r.id === res.id) > -1) {
      return false;
    }
    if (this.backlog.findIndex((r) => r.id === res.id) > -1) {
      return false;
    }
    if (
      this.newJobsOnBacklog ||
      (res.exclusiveGroup === ExclusiveResGroups.FIRST_ORIGIN &&
        res !== this.autoOrigin) ||
      (res.exclusiveGroup === ExclusiveResGroups.SPECIALIZATION &&
        res !== this.autoSpecialization)
    ) {
      this.backlog.push(res);
    } else this.toDo.push(res);

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

    this.researchPriority = Math.max(Math.min(this.researchPriority, 100), 0);
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
      notAdded = super.addProgress(resProg.plus(this.researchNotAdded));
      if (this.researchPriority >= 100) {
        this.researchNotAdded = notAdded;
        return ZERO;
      } else {
        this.researchNotAdded = ZERO;
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
  setPrestigeRelations() {
    const pm = Game.getGame().prestigeManager;
    this.researches.forEach((res) => {
      if (res.resData.requiredCardId) {
        res.requiredCard = pm.cards.find(
          (c) => c.id === res.resData.requiredCardId
        );
      }
    });
  }
  prestige() {
    this.researches.forEach((res) => res.prestige());
    this.technologies.forEach((tech) => tech.prestige());
    this.toDo = [this.researches[0]];
    this.done = [];
    this.backlog = [];
    this.reloadTechList();
  }
  //#region Save and Load
  getSave(): any {
    const ret: any = {
      d: this.done.map((r) => r.getSave()),
      t: this.toDo.map((r) => r.getSave(true)),
      b: this.backlog.map((r) => r.getSave()),
      e: this.unlockedTechnologies.map((t) => t.getSave()),
      r: this.researchPriority,
      s: this.sort,
      o: this.researches
        .filter(
          (res) =>
            this.toDo.findIndex((r) => r === res) < 0 &&
            this.backlog.findIndex((r) => r === res) < 0 &&
            this.done.findIndex((r) => r === res) < 0 &&
            (res.inspiration || res.progress.gt(0))
        )
        .map((res) => res.getSave())
    };
    if (this.newJobsOnBacklog) ret.k = this.newJobsOnBacklog;
    if (this.autoOrigin) ret.a = this.autoOrigin.id;
    if (this.autoSpecialization) ret.S = this.autoSpecialization.id;
    return ret;
  }
  load(data: any, oldGameVersion: number) {
    this.toDo = [];
    this.done = [];
    this.backlog = [];
    if ("k" in data) this.newJobsOnBacklog = data.k;
    if ("s" in data) {
      this.sort = data.s;
    }
    for (const resData of data.o) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
      }
    }
    for (const resData of data.t) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
        this.toDo.push(res);
        res.unlocked = true;
      }
    }
    for (const resData of data.d) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
        this.done.push(res);
        res.unlocked = true;
      }
    }
    for (const resData of data.b) {
      const res = this.researches.find((r) => r.id === resData.i);
      if (res) {
        res.load(resData);
        this.backlog.push(res);
        res.unlocked = true;
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
    if ("a" in data) {
      this.autoOrigin = this.researches.find((res) => res.id === data.a);
    }
    if ("S" in data) {
      this.autoSpecialization = this.researches.find(
        (res) => res.id === data.S
      );
    }
    this.done.forEach((res) => {
      res.onCompleted(true, oldGameVersion);
    });
    this.reloadTechList();
  }
  //#endregion
}
