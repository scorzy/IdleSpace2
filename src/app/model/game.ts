import { ResourceManager } from "./units/resourceManager";
import { ResearchManager } from "./researches/researchManager";
import { ShipyardManager } from "./shipyard/shipyardManager";
import { BASE_NAVAL_CAPACITY, ZERO, FLEET_NUMBER } from "./CONSTANTS";
import { EnemyManager } from "./enemy/enemyManager";
import { BattleResult, Stats } from "./battle/battleResult";
import { DatePipe } from "@angular/common";

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

  navalCapacity: number = BASE_NAVAL_CAPACITY;
  updateNavalCapacity = true;

  battleStats: Array<{ name: string; stats: Stats[] }[]>;
  updateStats = true;

  private _gameId = "";

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
    this.researchManager = new ResearchManager();
    this.shipyardManager = new ShipyardManager();
    this.enemyManager = new EnemyManager();
    this.shipyardManager.init();
    this.researchManager.makeShipsResearches();
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

    while (toUpdate > 0) {
      this.resourceManager.shipyardWork.limit = this.shipyardManager.getWorkNeeded();
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
      this.shipyardManager.addProgress(
        this.resourceManager.shipyardWork.quantity
      );
      this.resourceManager.shipyardWork.quantity = ZERO;
      this.enemyManager.addProgress(this.resourceManager.search.quantity);
      this.resourceManager.search.quantity = ZERO;
    }
  }
  postUpdate() {
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
    }
    this.shipyardManager.postUpdate();
    this.enemyManager.postUpdate();
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
      e: this.enemyManager.getSave()
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
  }
  //#endregion
}
