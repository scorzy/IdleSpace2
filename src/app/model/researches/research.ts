import { IResearchData } from "../data/iResearchData";
import { Job } from "../job/job";
import { convertToRoman, solveEquation } from "ant-utils";
import {
  RESEARCH_GROW_RATE,
  ZERO,
  INFINITY,
  RESEARCH_BASE_PRICE,
  RESEARCH_LEVEL_MULTI,
  ONE,
  TIER_ONE_RES_PRICE_MULTI,
  INSPIRATION_PERCENT,
  INSPIRATION_CARD
} from "../CONSTANTS";
import { IUnlockable } from "../iUnlocable";
import { Game } from "../game";
import { IBase } from "../iBase";
import { ResearchManager } from "./researchManager";
import { Unit } from "../units/unit";
import { Technology } from "./technology";
import { ShipType } from "../shipyard/ShipType";
import { Module } from "../shipyard/module";
import { Building } from "../units/building";
import { SearchJob } from "../enemy/searchJob";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { ExclusiveResGroups } from "./exclusiveResGroups";
import { Spell } from "../computing/spell";
import { Bonus } from "../bonus/bonus";

export class Research extends Job implements IUnlockable, IBase {
  static lastVisId = 0;
  id: string;
  visId = 0;
  visLevel = 0;
  private originalName: string;
  max = 1;
  unitsToUnlock?: Unit[];
  researchToUnlock?: Research[];
  technologiesToUnlock?: Technology[];
  spaceStationsToUp?: { spaceStation: Unit; multi: number }[];
  battleMulti?: { material: Unit; multi: number }[];
  prodMulti?: { unit: Unit; multi: number; secondUnit: Unit }[];
  effMulti?: { unit: Unit; multi: number; secondUnit: Unit }[];
  quantity: Decimal;
  icon?: string;
  resData: IResearchData;
  navalCapacity = 0;
  available = false;
  shipTypeToUnlock: ShipType;
  limitMulti?: { unit: Unit; multi: number; second: Unit }[];
  recycling = 0;
  modulesToUnlock: Module[];
  modPoints: { unit: Unit; multi: number }[];
  buildingPoints: { building: Building; quantity: number }[];
  shipProductionBonus: { shipType: ShipType; multi: number }[];
  shipProductionBonusAll: number;
  speedMulti: number;
  accelerationMulti: number;
  inspiration = false;
  inspirationDescription = "";
  districtMultiplier: number;
  habSpaceMulti: number;
  miningDistMulti: number;
  energyDistMulti: number;
  materialMulti: number;
  scienceMulti: number;
  exclusiveGroup: ExclusiveResGroups;
  spellToUnlock: Spell;
  technologyBonus: { technology: Technology; multi: number }[];
  computingPerSec = 0;
  type: Technology;
  parent: Research;
  unlocked = false;
  constructor(researchData: IResearchData, researchManager: ResearchManager) {
    super();
    this.resData = researchData;
    this.id = researchData.id;
    this.name = researchData.name; // + " " + this.id;
    this.originalName = this.name;
    this.description = researchData.description;
    this.visId = Research.lastVisId++;
    this.initialPrice = ONE;
    this.inspirationDescription = researchData.inspirationDescription ?? "";
    this.exclusiveGroup = researchData.exclusiveGroup;

    const rs = Game.getGame().resourceManager;
    const sm = Game.getGame().shipyardManager;

    this.max = researchData.max ?? 10;
    this.growRate = researchData.growRate ?? RESEARCH_GROW_RATE;

    if ("unitsToUnlock" in researchData) {
      this.unitsToUnlock = researchData.unitsToUnlock.map((uId) =>
        rs.units.find((a) => a.id === uId)
      );
    }
    if ("technologiesToUnlock" in researchData) {
      this.technologiesToUnlock = researchData.technologiesToUnlock.map(
        (techId) => researchManager.technologies.find((a) => a.id === techId)
      );
    }
    if ("technologyBonus" in researchData) {
      this.technologyBonus = researchData.technologyBonus.map((data) => {
        return {
          technology: researchManager.technologies.find(
            (a) => a.id === data.techId
          ),
          multi: data.multi
        };
      });
      this.technologyBonus.forEach((data) => {
        data.technology.technologyBonus.bonuses.push(
          new Bonus(this, new Decimal(data.multi))
        );
      });
    }
    if ("navalCapacity" in researchData) {
      this.navalCapacity = this.resData.navalCapacity;
    }
    if ("recycling" in researchData) {
      this.recycling = this.resData.recycling;
    }
    if ("shipTypeToUnlock" in researchData) {
      this.shipTypeToUnlock = sm.shipTypes.find(
        (t) => t.id === this.resData.shipTypeToUnlock
      );
    }
    if ("shipProductionBonus" in researchData) {
      this.shipProductionBonus = researchData.shipProductionBonus.map((spb) => {
        return {
          shipType: sm.shipTypes.find((t) => t.id === spb.shipType),
          multi: spb.multi
        };
      });
    }
    if ("shipProductionBonusAll" in researchData) {
      this.shipProductionBonusAll = researchData.shipProductionBonusAll;
    }
    this.type = researchManager.technologies.find(
      (tec) => tec.id === researchData.type.id
    );
    if ("modPoints" in researchData) {
      researchData.modPoints.forEach((modPoint) => {
        const unit = rs.workers.find((u) => u.id === modPoint.unitId);
        if (!this.modPoints) this.modPoints = [];
        this.modPoints.push({ unit, multi: modPoint.multi });
        if (!unit.modsResearches) unit.modsResearches = [];
        unit.modsResearches.push(this);
      });
    }
    this.speedMulti = researchData.speedMulti ?? 0;
    this.accelerationMulti = researchData.accelerationMulti ?? 0;

    if (researchData.inspirationBuildingId) {
      const building = rs.buildings.find(
        (b) => b.id === researchData.inspirationBuildingId
      );
      if (building) {
        building.researchesToInspire =
          building.researchesToInspire || new Array<Research>();
        building.researchesToInspire.push(this);

        if (this.inspirationDescription === "") {
          this.inspirationDescription = "Build one " + building.name;
        }
      }
    }
    if (researchData.inspirationSpaceStationId) {
      const spaceStation = rs.spaceStations.find(
        (b) => b.id === researchData.inspirationSpaceStationId
      );
      if (spaceStation) {
        spaceStation.researchesToInspire =
          spaceStation.researchesToInspire || new Array<Research>();
        spaceStation.researchesToInspire.push(this);
        if (this.inspirationDescription === "") {
          this.inspirationDescription = "Build one " + spaceStation.name;
        }
      }
    }

    if ("computingPerSec" in researchData) {
      this.computingPerSec = researchData.computingPerSec;
    }

    this.reload();
  }
  reload(): void {
    super.reload();
    this.name =
      this.originalName +
      (this.level > 1
        ? " " + convertToRoman(Decimal.min(this.level, this.max))
        : "");
    this.quantity = new Decimal(this.level);
  }
  reloadUi() {
    super.reloadUi();
    this.timeToEnd = solveEquation(
      ZERO,
      ZERO,
      Game.getGame().researchManager.researchPerSec.times(this.totalBonus),
      this.total.minus(this.progress).times(-1)
    )
      .reduce((p, c) => p.min(c), INFINITY)
      .toNumber();
  }
  onCompleted(force = false): void {
    super.onCompleted();

    if (this.level < 2 || force) {
      const game = Game.getGame();
      if (this.unitsToUnlock) {
        this.unitsToUnlock.forEach((u) => u.unlock());
        game.resourceManager.reloadLists();
      }
      if (this.researchToUnlock) {
        this.researchToUnlock.forEach((u) => u.unlock());
      }
      if (this.technologiesToUnlock) {
        this.technologiesToUnlock.forEach((tech) => tech.unlock());
      }
      if (this.shipTypeToUnlock) {
        this.shipTypeToUnlock.unlocked = true;
      }
      if (this.modulesToUnlock) {
        this.modulesToUnlock.forEach((m) => m.unlock());
      }
      game.navalCapacity += this.navalCapacity;
    }
    if (this.level < 2 && !force) {
      if (this.spellToUnlock) {
        Game.getGame().computingManager.addSpell(this.spellToUnlock);
      }
    }
    /**
     * First Research
     * Generate enemies and drone design
     */
    if (this.id === "m") {
      const em = Game.getGame().enemyManager;
      for (let i = 0; i < 3; i++) {
        const enemyJob = new SearchJob();
        enemyJob.level = 0;
        em.generateEnemy(enemyJob);
      }
      if (!em.currentEnemy) {
        em.attackEnemy(em.enemies[0]);
      }
      const sm = Game.getGame().shipyardManager;
      if (sm.shipDesigns.length < 1) sm.addDefaultDesign();
    }

    /**
     * Eventually remove other exclusive researches
     */
    if (this.exclusiveGroup) {
      const rm = Game.getGame().researchManager;
      rm.backlog = rm.backlog.filter(
        (res) => res.exclusiveGroup !== this.exclusiveGroup
      );
    }

    if (!force) {
      Game.getGame().notificationManager.addNotification(
        new MyNotification(
          NotificationTypes.RESEARCH,
          this.name + " completed!"
        )
      );
      this.inspiration = false;
    }
  }
  unlock(): boolean {
    const resM = Game.getGame().researchManager;
    const result = resM.unlock(this);
    this.unlocked = this.unlocked || result;

    return this.unlocked;
  }
  setLevels(specialRes: Research = null) {
    if (this.researchToUnlock) {
      this.researchToUnlock.forEach((res) => {
        res.visLevel = this.visLevel + 1;
        res.parent = this;
        const special = specialRes || (this.exclusiveGroup ? this : null);
        if (special && this.modulesToUnlock) {
          this.modulesToUnlock.forEach(
            (mod) => (mod.specialResearch = special)
          );
        }
        res.setLevels(special);
      });
    }
    this.initialPrice = new Decimal(RESEARCH_BASE_PRICE).times(
      Decimal.pow(RESEARCH_LEVEL_MULTI, this.visLevel).times(
        this.resData?.priceMulti || 1
      )
    );
    if (this.visLevel <= 1) {
      this.initialPrice = this.initialPrice.times(TIER_ONE_RES_PRICE_MULTI);
    }
    this.reload();
  }
  inspire(): boolean {
    if (this.inspiration) return false;

    const rm = Game.getGame().researchManager;
    if (rm.done.indexOf(this) > -1) return false;
    if (!this.unlocked) return false;

    this.inspiration = true;
    const percent = Game.getGame().prestigeManager.inspiration.active
      ? INSPIRATION_CARD
      : INSPIRATION_PERCENT;
    const toAdd = this.total.times(percent);
    if (
      this.type.unlocked &&
      Game.getGame().prestigeManager.inspirationTechnology.active
    ) {
      this.type.addProgress(toAdd, true);
    }
    this.addProgress(toAdd, true);
    Game.getGame().notificationManager.addNotification(
      new MyNotification(NotificationTypes.RESEARCH_INSPIRED, this.name)
    );
    return true;
  }
  prestige() {
    this.level = 0;
    this.progress = ZERO;
    this.inspiration = false;
    this.quantity = ZERO;

    this.reload();
  }
  //#region Save and Load
  getSave(done = false): any {
    const ret: any = {};
    ret.i = this.id;
    if (this.progress.gt(0)) {
      ret.p = this.progress;
    }
    if (!done) {
      if (this.level > 0) {
        ret.l = this.level;
      }
    } else {
      if (this.level !== 1) {
        ret.l = this.level;
      }
    }
    if (this.inspiration) ret.s = this.inspiration;
    return ret;
  }
  load(data: any, done = false) {
    if (!("i" in data) || data.i !== this.id) {
      return false;
    }
    if ("p" in data) {
      this.progress = new Decimal(data.p);
    }
    if ("l" in data) {
      this.level = data.l;
    } else if (done) {
      this.level = 1;
    }
    this.inspiration = data.s ?? false;
    this.reload();
  }
  //#endregion
}
