import { ResourceManager } from "./units/resourceManager";
import { ResearchManager } from "./researches/researchManager";
import { ShipyardManager } from "./shipyard/shipyardManager";
import { BASE_NAVAL_CAPACITY, ZERO, FLEET_NUMBER } from "./CONSTANTS";
import { EnemyManager } from "./enemy/enemyManager";
import { BattleResult, Stats } from "./battle/battleResult";
import { DatePipe } from "@angular/common";
import { SpaceStationManager } from "./space/spaceStationManager";

/**
 * Game is the main class that orchestrate everything game related
 */
export class Game {
  /**
   * Instance  of game
   */
  private static instance: Game;

  resourceManager: ResourceManager;
  researchManager: ResearchManager;
  shipyardManager: ShipyardManager;
  enemyManager: EnemyManager;
  spaceStationManager: SpaceStationManager;

  navalCapacity: number = BASE_NAVAL_CAPACITY;
  updateNavalCapacity = true;
  updateMods = true;

  battleStats: Array<{ name: string; stats: Stats[] }[]>;
  updateStats = true;

  civilianWorkPercent = 50;
  civWorkPerSec = ZERO;
  shipWorkPerSec = ZERO;

  private _gameId = "";
  private battleResults: { result: BattleResult; fleet: number }[] = [];

  /**
   * Gets game return instance of game
   * this is not a real singleton, may return null
   * @returns game
   */
  static getGame(): Game {
    return Game.instance;
  }
  constructor() {
    Game.instance = this;
    this.generateGameId();
    this.resourceManager = new ResourceManager();
    this.resourceManager.makeUnits();
    this.researchManager = new ResearchManager();
    this.shipyardManager = new ShipyardManager();
    this.enemyManager = new EnemyManager();
    this.spaceStationManager = new SpaceStationManager();
    this.shipyardManager.init();
    this.researchManager.makeShipsResearches();
    this.researchManager.makeSpaceStationResearches();
    this.researchManager.setRelations();

    this.setTheme();
    this.battleStats = Array<{ name: string; stats: Stats[] }[]>();
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.battleStats.push(new Array<{ name: string; stats: Stats[] }>());
    }
  }
  private generateGameId() {
    this._gameId = Date.now().toString() + Math.random().toString();
  }
  get gameId() {
    return this._gameId;
  }
  /**
   * Update function.
   * Works only with resource growing at max rate of x^2
   * When something reach zero consumers are stopped and it will update again
   * @param delta in seconds
   */
  update(delta: number) {
    let toUpdate = delta;
    this.processBattles();
    while (toUpdate > 0) {
      this.resourceManager.shipyardWork.limit = this.shipyardManager
        .getWorkNeeded()
        .plus(this.spaceStationManager.getWorkNeeded());
      this.resourceManager.search.limit = this.enemyManager.getWorkNeeded();

      this.resourceManager.reloadProduction();
      const maxUp = Math.min(toUpdate, this.resourceManager.maxTime);
      if (maxUp > 0) {
        this.resourceManager.update(maxUp);
        toUpdate = toUpdate - maxUp;
      }
      if (toUpdate > 0) {
        this.resourceManager.stopResources();
      }

      const shipWork = this.resourceManager.shipyardWork.quantity.times(
        (100 - this.civilianWorkPercent) / 100
      );
      const civWork = this.resourceManager.shipyardWork.quantity.minus(
        shipWork
      );
      const notAdded = this.shipyardManager.addProgress(shipWork).max(0);
      this.spaceStationManager.addProgress(civWork.plus(notAdded));

      this.resourceManager.shipyardWork.quantity = ZERO;
      this.enemyManager.addProgress(this.resourceManager.search.quantity);
      this.resourceManager.search.quantity = ZERO;
    }
  }
  reloadWorkPerSec() {
    if (this.shipyardManager.toDo.length === 0) {
      this.civWorkPerSec = this.resourceManager.shipyardWork.perSec;
      this.shipWorkPerSec = ZERO;
    } else {
      if (this.spaceStationManager.toDo.length === 0) {
        this.shipWorkPerSec = this.resourceManager.shipyardWork.perSec;
        this.civWorkPerSec = ZERO;
      } else {
        this.shipWorkPerSec = this.resourceManager.shipyardWork.perSec.times(
          1 - this.civilianWorkPercent / 100
        );
        this.civWorkPerSec = this.resourceManager.shipyardWork.perSec.times(
          this.civilianWorkPercent / 100
        );
      }
    }
  }
  postUpdate() {
    this.reloadWorkPerSec();
    this.researchManager.technologies.forEach(t => t.bonus.reloadBonus());
    const resNotAdded = this.researchManager.addProgress(
      this.resourceManager.science.quantity
    );
    this.resourceManager.science.quantity = resNotAdded;
    this.resourceManager.reloadProduction();
    this.resourceManager.postUpdate();
    this.researchManager.toDo.forEach(r => r.reloadTotalBonus());
    this.researchManager.backlog.forEach(r => r.reloadTotalBonus());
    if (this.updateNavalCapacity) {
      this.reloadNavalCapacity();
      this.updateNavalCapacity = false;
    }
    if (this.updateMods) {
      this.resourceManager.reloadMods();
      this.updateMods = false;
    }
    this.shipyardManager.postUpdate();
    this.enemyManager.postUpdate();
    this.spaceStationManager.postUpdate();
  }
  reloadNavalCapacity() {
    this.navalCapacity = BASE_NAVAL_CAPACITY;
    for (let i = 0, n = this.researchManager.done.length; i < n; i++) {
      this.navalCapacity += this.researchManager.done[i].navalCapacity;
    }
    this.navalCapacity += this.researchManager.navalCapTech.quantity.toNumber();
    this.navalCapacity = Math.floor(this.navalCapacity);
    this.shipyardManager.reloadFleetCapacity();
  }
  onBattleEnd(battleResult: BattleResult, fleetNum: number) {
    if (battleResult.gameId !== this.gameId) return;
    this.battleResults.push({ result: battleResult, fleet: fleetNum });
  }
  processBattles() {
    const now = performance.now();
    for (let i = this.battleResults.length - 1; i >= 0; i--) {
      const battleResult = this.battleResults[i].result;
      const fleetNum = this.battleResults[i].fleet;
      if (now >= battleResult.endTime) {
        if (this.updateStats) {
          const toAdd = {
            name:
              this.enemyManager.currentEnemy.name +
              " lv." +
              this.enemyManager.currentEnemy.level +
              " cell: " +
              this.enemyManager.fleetsInBattle[fleetNum].index +
              " " +
              new DatePipe("en-US").transform(Date.now(), "HH:mm:sss"),
            stats: battleResult.stats
          };
          this.battleStats[fleetNum].push(toAdd);
          this.battleStats[fleetNum].splice(3);
        }

        this.shipyardManager.onBattleEnd(battleResult, fleetNum);
        this.enemyManager.onBattleEnd(battleResult, fleetNum);
        this.battleResults.splice(i, 1);
      }
    }
  }
  setTheme() {
    this.researchManager.technologies.forEach(tech => {
      tech.setTheme();
    });
  }
  //#region Save and Load
  getSave(): any {
    return {
      s: this.resourceManager.getSave(),
      r: this.researchManager.getSave(),
      d: this.shipyardManager.getSave(),
      e: this.enemyManager.getSave(),
      m: this.spaceStationManager.getSave(),
      c: this.civilianWorkPercent
    };
  }
  load(data: any) {
    if (!("s" in data && "r" in data)) {
      throw new Error("Save not valid");
    }

    this.resourceManager.load(data.s);
    this.researchManager.load(data.r);
    if ("d" in data) {
      this.shipyardManager.load(data.d);
    }
    if ("e" in data) {
      this.enemyManager.load(data.e);
    }
    if ("m" in data) {
      this.spaceStationManager.load(data.m);
    }
    if ("c" in data) this.civilianWorkPercent = data.c;
  }
  //#endregion
}
