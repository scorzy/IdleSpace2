import { Enemy } from "./enemy";
import { JobManager } from "../job/jobManager";
import { SearchJob } from "./searchJob";
import { FLEET_NUMBER, ZERO } from "../CONSTANTS";
import { MainService } from "src/app/main.service";
import { BattleRequest } from "../battle/battleRequest";
import { Game } from "../game";
import { BattleResult } from "../battle/battleResult";
import { Cell } from "./cell";
import { BonusStack } from "../bonus/bonusStack";
import { SearchOption } from "./searchOption";
import {
  HABITABILITY_OPT,
  DIFFICULTY_OPT,
  DISTANCE_OPT,
  METAL_OPT,
  ENERGY_OPT,
  SCIENCE_OPT,
  COMPONENT_OPT
} from "../data/searchOptions";
import { solveEquation } from "ant-utils";

export class EnemyManager extends JobManager {
  enemies = new Array<Enemy>();
  toDo = new Array<SearchJob>();
  currentEnemy: Enemy;
  fleetsInBattle: Array<Cell>;
  maxLevel = 0;
  //#region Bonus
  districtMultiplier: BonusStack = new BonusStack();
  resourceMultiplier: BonusStack = new BonusStack();
  scienceMultiplier: BonusStack = new BonusStack();
  //#endregion
  //#region Search Options
  habitabilityOpt: SearchOption;
  difficultyOpt: SearchOption;
  distanceOpt: SearchOption;
  energyOpt: SearchOption;
  metalOpt: SearchOption;
  scienceOpt: SearchOption;
  componentOpt: SearchOption;

  searchOptions: SearchOption[];
  //#endregion
  constructor() {
    super();
    this.fleetsInBattle = new Array(FLEET_NUMBER);

    this.habitabilityOpt = new SearchOption(HABITABILITY_OPT);
    this.metalOpt = new SearchOption(METAL_OPT);
    this.energyOpt = new SearchOption(ENERGY_OPT);
    this.difficultyOpt = new SearchOption(DIFFICULTY_OPT);
    this.distanceOpt = new SearchOption(DISTANCE_OPT);
    this.scienceOpt = new SearchOption(SCIENCE_OPT);
    this.componentOpt = new SearchOption(COMPONENT_OPT);

    this.searchOptions = [
      this.habitabilityOpt,
      this.metalOpt,
      this.energyOpt,
      this.scienceOpt,
      this.componentOpt,
      this.difficultyOpt,
      this.distanceOpt
    ];
  }
  search(level: number) {
    const job = new SearchJob();
    job.enemyLevel = level;
    job.reload();
    this.toDo.push(job);
  }
  generateEnemy(searchJob: SearchJob) {
    const enemy = new Enemy();
    enemy.generate(searchJob);
    this.enemies.push(enemy);
  }
  postUpdate() {
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reload();
    }
  }
  attackEnemy(enemy: Enemy): boolean {
    if (this.currentEnemy || enemy.level > this.maxLevel) return false;
    this.currentEnemy = enemy;
    this.currentEnemy.generateCells();
    const index = this.enemies.indexOf(enemy);
    if (index >= 0) this.enemies.splice(index, 1);
    return true;
  }
  attackCell(fleetNum: number) {
    if (
      this.fleetsInBattle[fleetNum] ||
      Game.getGame().shipyardManager.maxFleet <= fleetNum
    ) {
      return false;
    }
    const playerDesign = Game.getGame().shipyardManager.shipDesigns;

    const toAttack = this.currentEnemy.cells.find(c => !c.done && !c.inBattle);
    if (toAttack) {
      toAttack.inBattle = true;
      this.fleetsInBattle[fleetNum] = toAttack;
      const battleRequest = new BattleRequest();
      battleRequest.gameId = Game.getGame().gameId;
      //#region  Player Fleet
      let maxTime = 0;
      for (let i = 0, n = playerDesign.length; i < n; i++) {
        const shipData = playerDesign[i].getShipData();
        shipData.quantity = playerDesign[i].fleets[fleetNum].shipsQuantity;
        battleRequest.playerFleet.push(shipData);
        let tempMax = solveEquation(
          ZERO,
          playerDesign[i].acceleration,
          playerDesign[i].velocity,
          this.currentEnemy.distance.times(-1)
        );
        for (let sol of tempMax) {
          if (sol.gt(maxTime)) maxTime = sol.toNumber();
        }

        if (playerDesign[i].old) {
          const shipDataOld = playerDesign[i].old.getShipData();
          shipDataOld.designId *= -1;
          shipDataOld.quantity = playerDesign[i].old.fleets[i].shipsQuantity;
          battleRequest.playerFleet.push(shipDataOld);
          tempMax = solveEquation(
            ZERO,
            playerDesign[i].acceleration,
            playerDesign[i].velocity,
            this.currentEnemy.distance.times(-1)
          );
          for (let sol of tempMax) {
            if (sol.gt(maxTime)) maxTime = sol.toNumber();
          }
        }
      }
      battleRequest.endTime = performance.now() + maxTime * 1e3;
      //#endregion
      //#region Enemy Fleet
      battleRequest.enemyFleet = this.currentEnemy.designs.map(d =>
        d.getShipData()
      );
      for (let i = 0, n = toAttack.ships.length; i < n; i++) {
        battleRequest.enemyFleet[i].quantity = toAttack.ships[i];
      }
      //#endregion
      //  Battle
      MainService.battleWorkers[fleetNum].postMessage(battleRequest);
    }
  }
  onBattleEnd(battleResult: BattleResult, fleetNum: number) {
    const cell = this.fleetsInBattle[fleetNum];
    if (!this.currentEnemy) {
      this.fleetsInBattle[fleetNum] = null;
      return;
    }
    let done = true;
    for (let i = 0, n = this.currentEnemy.designs.length; i < n; i++) {
      const designId = this.currentEnemy.designs[i].id;
      const lostD = battleResult.enemyLost.find(en => en.id === designId);
      if (lostD) {
        cell.ships[i] -= lostD.lost;
        cell.ships[i] = Math.floor(Math.max(cell.ships[i], 0));
      }
      if (cell.ships[i] > 0) {
        done = false;
      }
    }
    cell.done = done;
    cell.inBattle = false;
    if (cell.done) {
      this.reward(cell, fleetNum);
      if (this.currentEnemy.cells.findIndex(c => !c.done) < 0) {
        this.defeatEnemy();
      }
    }
    this.currentEnemy.reloadCell(this.currentEnemy.cells.indexOf(cell));
    this.fleetsInBattle[fleetNum] = null;
  }
  surrender() {
    this.currentEnemy = null;
  }
  reward(cell: Cell, fleetNum: number) {}
  defeatEnemy() {}

  //#region Save and Load
  getSave(): any {
    const ret: any = {
      e: this.enemies.map(en => en.getSave()),
      t: this.toDo.map(t => t.getSave()),
      m: this.maxLevel
    };
    const searchData = this.searchOptions
      .filter(s => s.quantity !== 0)
      .map(s => s.getData());
    if (searchData.length > 0) ret.s = searchData;
    if (this.currentEnemy) ret.c = this.currentEnemy.getSave();
    return ret;
  }
  load(data: any) {
    if ("e" in data) {
      this.enemies = data.e.map(enemyData => {
        const enemy = new Enemy();
        enemy.load(enemyData);
        return enemy;
      });
    }
    if ("t" in data) {
      this.toDo = data.t.map(jobData => {
        const job = new SearchJob();
        job.load(jobData);
        return job;
      });
    }
    if ("c" in data) {
      this.currentEnemy = new Enemy();
      this.currentEnemy.load(data.c);
    }
    if ("m" in data) this.maxLevel = data.m;
    if ("s" in data) {
      data.s.forEach(optionData => {
        const searchOption = this.searchOptions.find(
          so => so.id === optionData.i
        );
        if (searchOption) {
          searchOption.load(optionData);
        }
      });
    }
  }
  //#endregion
}
