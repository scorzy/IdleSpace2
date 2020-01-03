import { Enemy } from "./enemy";
import { JobManager } from "../job/jobManager";
import { SearchJob } from "./searchJob";
import { FLEET_NUMBER } from "../CONSTANTS";
import { MainService } from "src/app/main.service";
import { BattleRequest } from "../battle/battleRequest";
import { Game } from "../game";
import { BattleResult, Stats } from "../battle/battleResult";
import { Cell } from "./cell";
import { getWeekYearWithOptions } from "date-fns/fp";

export class EnemyManager extends JobManager {
  enemies = new Array<Enemy>();
  toDo = new Array<SearchJob>();
  currentEnemy: Enemy;
  fleetsInBattle: Array<Cell>;
  maxLevel = 0;

  constructor() {
    super();
    this.fleetsInBattle = new Array(FLEET_NUMBER);
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
  attackEnemy(enemy: Enemy) {
    if (this.currentEnemy || enemy.level > this.maxLevel) return false;
    this.currentEnemy = enemy;
    this.currentEnemy.generateCells();
    const index = this.enemies.indexOf(this.currentEnemy);
    if (index > 0) this.enemies.splice(index, 1);
  }
  attackCell(fleetNum: number) {
    if (
      this.fleetsInBattle[fleetNum] ||
      Game.getGame().shipyardManager.maxFleet <= fleetNum
    )
      return false;
    const playerDesign = Game.getGame().shipyardManager.shipDesigns;

    const toAttack = this.currentEnemy.cells.find(c => !c.done && !c.inBattle);
    if (toAttack) {
      toAttack.inBattle = true;
      this.fleetsInBattle[fleetNum] = toAttack;
      const battleRequest = new BattleRequest();
      battleRequest.gameId = Game.getGame().gameId;

      //  Player Fleet
      for (let i = 0, n = playerDesign.length; i < n; i++) {
        const shipData = playerDesign[i].getShipData();
        shipData.quantity = playerDesign[i].fleets[fleetNum].shipsQuantity;
        battleRequest.playerFleet.push(shipData);

        if (playerDesign[i].old) {
          const shipDataOld = playerDesign[i].old.getShipData();
          shipDataOld.designId *= -1;
          shipDataOld.quantity = playerDesign[i].old.fleets[i].shipsQuantity;
          battleRequest.playerFleet.push(shipDataOld);
        }
      }

      //  Enemy Fleet
      battleRequest.enemyFleet = this.currentEnemy.designs.map(d =>
        d.getShipData()
      );
      for (let i = 0, n = toAttack.ships.length; i < n; i++) {
        battleRequest.enemyFleet[i].quantity = toAttack.ships[i];
      }

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
  }
  //#endregion
}
