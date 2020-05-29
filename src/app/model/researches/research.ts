import { IResearchData } from "../data/iResearchData";
import { Job } from "../job/job";
import { convertToRoman, solveEquation } from "ant-utils";
import {
  RESEARCH_GROW_RATE,
  ZERO,
  INFINITY,
  RESEARCH_BASE_PRICE,
  RESEARCH_LEVEL_MULTI,
  ONE
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
  prodMulti?: { unit: Unit; multi: number }[];
  effMulti?: { unit: Unit; multi: number }[];
  quantity: Decimal;
  icon?: string;
  resData: IResearchData;
  navalCapacity = 0;
  available = false;
  shipTypeToUnlock: ShipType;
  limitMulti?: { unit: Unit; multi: number }[];
  recycling = 0;
  modulesToUnlock: Module[];
  modPoints: { unit: Unit; quantity: number }[];
  buildingPoints: { building: Building; quantity: number }[];
  get totalBonus(): Decimal {
    return this.type.bonus.totalBonus;
  }
  constructor(researchData: IResearchData, researchManager: ResearchManager) {
    super();
    this.resData = researchData;
    this.id = researchData.id;
    this.name = researchData.name + " " + this.id;
    this.originalName = this.name;
    this.description = researchData.description;
    this.visId = Research.lastVisId++;
    this.initialPrice = ONE;

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
    this.type = researchManager.technologies.find(
      (tec) => tec.id === researchData.type.id
    );
    if ("modPoints" in researchData) {
      researchData.modPoints.forEach((modPoint) => {
        const unit = rs.workers.find((u) => u.id === modPoint.unitId);
        if (!this.modPoints) this.modPoints = [];
        this.modPoints.push({ unit, quantity: modPoint.quantity });
        if (!unit.modsResearches) unit.modsResearches = [];
        unit.modsResearches.push(this);
      });
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
  }
  unlock(): boolean {
    const resM = Game.getGame().researchManager;
    return resM.unlock(this);
  }
  setLevels() {
    if (this.researchToUnlock) {
      this.researchToUnlock.forEach((res) => {
        res.visLevel = this.visLevel + 1;
        res.setLevels();
      });
    }
    this.initialPrice = new Decimal(RESEARCH_BASE_PRICE).times(
      Decimal.pow(RESEARCH_LEVEL_MULTI, this.visLevel).times(
        this.resData?.priceMulti || 1
      )
    );
    this.reload();
  }

  //#region Save and Load
  getSave(): any {
    const ret: any = {};
    ret.i = this.id;
    if (this.progress.gt(0)) {
      ret.p = this.progress;
    }
    if (this.level > 0) {
      ret.l = this.level;
    }
    return ret;
  }
  load(data: any) {
    if (!("i" in data) || data.i !== this.id) {
      return false;
    }
    if ("p" in data) {
      this.progress = new Decimal(data.p);
    }
    if ("l" in data) {
      this.level = data.l;
    }
    this.reload();
  }
  //#endregion
}
