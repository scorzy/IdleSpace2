import { Enemy } from "./enemy";
import { JobManager } from "../job/jobManager";
import { SearchJob } from "./searchJob";
import {
  FLEET_NUMBER,
  ZERO,
  NUKE_DAMAGE,
  ENEMY_EXP_START_LEVEL,
  ENEMY_BASE_EXP,
  ENEMY_EXP_GROW_RATE,
  DM_PER_LEVEL,
  VICTORY_WARP_CARD,
  ENEMY_DEFEAT_WARP_CARD,
  EXP_GAIN_CARD,
  DM_GAIN_CARD,
  ONE
} from "../CONSTANTS";
import { MainService } from "src/app/main.service";
import { BattleRequest } from "../battle/battleRequest";
import { Game } from "../game";
import { BattleResult } from "../battle/battleResult";
import { Cell } from "./cell";
import { BonusStack } from "../bonus/bonusStack";
import { SearchOption } from "./searchOption";
import {
  HABITABILITY_OPT,
  DISTANCE_OPT,
  METAL_OPT,
  ENERGY_OPT,
  SCIENCE_OPT,
  COMPONENT_OPT
} from "../data/searchOptions";
import { solveEquation } from "ant-utils";
import { UNIT_TYPES } from "../data/units";
import { AutoAttackOption } from "./autoAttackOptions";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";

export class EnemyManager extends JobManager {
  enemies = new Array<Enemy>();
  toDo = new Array<SearchJob>();
  currentEnemy: Enemy;
  fleetsInBattle: Array<Cell>;
  maxLevel = 0;
  nukeDamageMulti = new BonusStack();
  nukeDamage = ONE;
  autoAttackEnabled = false;
  autoNext = false;
  autoNuke = true;
  autoAttackOptions: AutoAttackOption[];
  private rewardString = "";
  searchLevel = 0;
  lostRow = 0;
  //#region Bonus
  districtMultiplier: BonusStack = new BonusStack();
  habSpaceMultiplier: BonusStack = new BonusStack();
  miningDistMultiplier: BonusStack = new BonusStack();
  energyDistMultiplier: BonusStack = new BonusStack();
  resourceMultiplier: BonusStack = new BonusStack();
  //#endregion
  //#region Search Options
  habitabilityOpt: SearchOption;
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

    this.autoAttackOptions = new Array<AutoAttackOption>();
    for (let i = 0; i < 5; i++) {
      this.autoAttackOptions[i] = new AutoAttackOption();
    }

    this.habitabilityOpt = new SearchOption(HABITABILITY_OPT);
    this.metalOpt = new SearchOption(METAL_OPT);
    this.energyOpt = new SearchOption(ENERGY_OPT);
    this.distanceOpt = new SearchOption(DISTANCE_OPT);
    this.scienceOpt = new SearchOption(SCIENCE_OPT);
    this.componentOpt = new SearchOption(COMPONENT_OPT);

    this.searchOptions = [
      this.habitabilityOpt,
      this.metalOpt,
      this.energyOpt,
      this.scienceOpt,
      this.componentOpt,
      this.distanceOpt
    ];
  }
  search(level: number) {
    const searchJob = new SearchJob();
    searchJob.enemyLevel = level;
    searchJob.habitabilityOpt = this.habitabilityOpt.quantity;
    searchJob.distanceOpt = this.distanceOpt.quantity;
    searchJob.energyOpt = this.energyOpt.quantity;
    searchJob.metalOpt = this.metalOpt.quantity;
    searchJob.scienceOpt = this.scienceOpt.quantity;
    searchJob.componentOpt = this.componentOpt.quantity;
    searchJob.init();
    this.toDo.push(searchJob);
  }
  sortJobs() {
    this.toDo = this.toDo.sort((a, b) => a.enemyLevel - b.enemyLevel);
  }
  generateEnemy(searchJob: SearchJob) {
    const enemy = new Enemy();
    enemy.generate(searchJob);
    this.enemies.push(enemy);
  }
  postUpdate() {
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reloadTotalBonus();
      this.toDo[i].reload();
    }
    Game.getGame().enemyManager.reloadNukeDamage();
    //  Auto Attack
    if (this.currentEnemy && this.autoAttackEnabled) {
      const sm = Game.getGame().shipyardManager;
      for (let i = 0; i < 5; i++) {
        if (
          this.autoAttackOptions[i].autoAttack &&
          sm.fleetsPercent[i] >= this.autoAttackOptions[i].minPercent
        ) {
          this.attackCell(i, true);
        }
      }
    }
    //  Auto Next
    if (this.autoNext && !this.currentEnemy) {
      const next = this.enemies.find((n) => n.level <= this.maxLevel);
      if (next) {
        this.attackEnemy(next);
      }
    }
  }
  attackEnemy(enemy: Enemy): boolean {
    if (this.currentEnemy || enemy.level > this.maxLevel) {
      return false;
    }
    this.currentEnemy = enemy;
    this.currentEnemy.generateCells();
    const index = this.enemies.indexOf(enemy);
    if (index >= 0) {
      this.enemies.splice(index, 1);
    }
    return true;
  }
  attackCell(fleetNum: number, autoAttack = false) {
    if (this.fleetsInBattle[fleetNum]) {
      return false;
    }
    let playerShip = false;
    const sd = Game.getGame().shipyardManager.shipDesigns;
    for (let k = 0, n = sd.length; k < n; k++) {
      if (sd[k].fleets[fleetNum].shipsQuantity > 0) playerShip = true;
      try {
        if (sd[k].old?.fleets[fleetNum]?.shipsQuantity > 0) playerShip = true;
      } catch {}
    }
    if (!playerShip) return false;

    const playerDesign = Game.getGame().shipyardManager.shipDesigns;
    const toAttack = this.currentEnemy.cells.find(
      (c) => !c.inBattle && !c.done
    );
    if (toAttack) {
      if (autoAttack && this.autoNuke) {
        this.nuke(toAttack.index);
      }
      toAttack.inBattle = true;
      this.fleetsInBattle[fleetNum] = toAttack;
      const battleRequest = new BattleRequest();
      battleRequest.gameId = Game.getGame().gameId;
      //#region Player Fleet
      let maxTime = 0;
      for (let i = 0, n = playerDesign.length; i < n; i++) {
        const shipData = playerDesign[i].getShipData();
        let oldShips = 0;
        try {
          oldShips = playerDesign[i].old?.fleets[fleetNum]?.shipsQuantity;
        } catch (ex) {}
        if (
          playerDesign[i].fleets[fleetNum].shipsQuantity < 1 &&
          oldShips < 1
        ) {
          continue;
        }

        shipData.quantity = playerDesign[i].fleets[fleetNum].shipsQuantity;
        if (shipData.quantity > 0) {
          battleRequest.playerFleet.push(shipData);
          const tempMax = solveEquation(
            ZERO,
            playerDesign[i].acceleration,
            playerDesign[i].velocity,
            this.currentEnemy.distance.times(-1)
          );
          for (const sol of tempMax) {
            if (sol.gt(maxTime)) {
              maxTime = sol.toNumber();
            }
          }
        }

        if (playerDesign[i].old && oldShips > 0) {
          const shipDataOld = playerDesign[i].old.getShipData();
          shipDataOld.designId *= -1;
          shipDataOld.quantity =
            playerDesign[i].old.fleets[fleetNum].shipsQuantity;
          if (shipDataOld.quantity > 0) {
            battleRequest.playerFleet.push(shipDataOld);
            const tempMax = solveEquation(
              ZERO,
              playerDesign[i].acceleration,
              playerDesign[i].velocity,
              this.currentEnemy.distance.times(-1)
            );
            for (const sol of tempMax) {
              if (sol.gt(maxTime)) {
                maxTime = sol.toNumber();
              }
            }
          }
        }
      }
      battleRequest.endTime = performance.now() + maxTime * 1e3;
      toAttack.eta = battleRequest.endTime;
      //#endregion
      //#region Enemy Fleet
      battleRequest.enemyFleet = this.currentEnemy.designs.map((d) =>
        d.getShipData()
      );
      for (let i = 0, n = toAttack.ships.length; i < n; i++) {
        battleRequest.enemyFleet[i].quantity = toAttack.ships[i];
      }
      //#endregion
      // Battle
      MainService.battleWorkers[fleetNum].postMessage(battleRequest);
    }
  }
  onBattleEnd(battleResult: BattleResult, fleetNum: number) {
    this.rewardString = "";
    const cell = this.fleetsInBattle[fleetNum];
    if (!this.currentEnemy) {
      this.fleetsInBattle[fleetNum] = null;
      return;
    }
    let done = true;
    if (this.currentEnemy) {
      for (let i = 0, n = this.currentEnemy.designs.length; i < n; i++) {
        const designId = this.currentEnemy.designs[i].id;
        const lostD = battleResult.enemyLost.find((en) => en.id === designId);
        if (lostD) {
          cell.ships[i] -= lostD.lost;
          cell.ships[i] = Math.floor(Math.max(cell.ships[i], 0));
        }
        if (cell.ships[i] > 0) {
          done = false;
        }
      }
    }
    cell.done = done;
    cell.inBattle = false;
    if (this.currentEnemy) {
      if (cell.done) {
        this.lostRow = 0;
        this.reward(cell, fleetNum);
        battleResult.won = true;
        //#region Research Inspiration
        //  Ship types unlock
        const rm = Game.getGame().researchManager;
        const shipResToInspire =
          rm.backlog.find((r) => r.shipTypeToUnlock) ||
          rm.backlog.find((r) => r.shipTypeToUnlock);
        if (shipResToInspire) {
          if (
            this.currentEnemy.designs.findIndex(
              (des) => des.type === shipResToInspire.shipTypeToUnlock
            ) > -1
          ) {
            shipResToInspire.inspire();
          }
        }
        //  Nuke
        if (this.currentEnemy.designs.findIndex((des) => des.isDefence) > -1) {
          rm.nukeResearch.inspire();
        }
        //#endregion
        if (this.currentEnemy.cells.findIndex((c) => !c.done) < 0) {
          this.defeatEnemy();
        } else {
          Game.getGame().notificationManager.addNotification(
            new MyNotification(
              NotificationTypes.BATTLE_WIN,
              "Battle win",
              "Fleet " +
                (fleetNum + 1) +
                " cell: " +
                cell.index +
                (this.rewardString === "" ? "" : "\n" + this.rewardString)
            )
          );
        }
      } else {
        this.lostRow++;
        Game.getGame().notificationManager.addNotification(
          new MyNotification(
            NotificationTypes.BATTLE_LOST,
            "Battle lost",
            "Fleet " + (fleetNum + 1) + " cell: " + cell.index
          )
        );
      }

      this.currentEnemy?.reloadCell(this.currentEnemy.cells.indexOf(cell));
    }
    this.fleetsInBattle[fleetNum] = null;
  }
  surrender() {
    this.currentEnemy = null;
    this.lostRow = 0;
  }
  reward(cell: Cell, fleetNum: number) {
    //  Card Warp
    if (Game.getGame().prestigeManager.victoryWarp.active) {
      Game.getGame().timeToWarp += VICTORY_WARP_CARD;
    }

    if (cell.materials.length < 1) {
      return;
    }
    let cargo = ZERO;
    const playerDesign = Game.getGame().shipyardManager.shipDesigns;
    for (let i = 0, n = playerDesign.length; i < n; i++) {
      cargo = cargo.plus(
        playerDesign[i].cargo.times(
          playerDesign[i].fleets[fleetNum].shipsQuantity
        )
      );
    }
    cargo = cargo.div(100).plus(1);

    let scienceLab = ZERO;
    for (let i = 0, n = playerDesign.length; i < n; i++) {
      scienceLab = scienceLab.plus(
        playerDesign[i].scienceLab.times(
          playerDesign[i].fleets[fleetNum].shipsQuantity
        )
      );
    }
    scienceLab = scienceLab.div(100).plus(1);

    for (let i = 0, n = cell.materials.length; i < n; i++) {
      const mat = cell.materials[i];
      let toAdd = mat.quantity;

      if (mat.material.unitData.unitType === UNIT_TYPES.MATERIAL) {
        if (
          mat.material.unitData.id === "S" ||
          mat.material.unitData.id === "R"
        ) {
          toAdd = toAdd.times(scienceLab);
        } else toAdd = toAdd.times(cargo);
      }
      if (toAdd.gt(0)) {
        mat.material.unlock();
        mat.material.quantity = mat.material.quantity.plus(toAdd);
        this.rewardString +=
          (this.rewardString === "" ? "" : ", ") +
          "+" +
          MainService.formatPipe.transform(toAdd) +
          " " +
          mat.material.name;
      }
      // mat.quantity = ZERO;
    }
  }
  getExperience(enemyLevel): Decimal {
    if (enemyLevel < ENEMY_EXP_START_LEVEL) return ZERO;
    if (this.currentEnemy.level < this.maxLevel) return ZERO;
    return Decimal.floor(
      (ENEMY_BASE_EXP + enemyLevel * ENEMY_EXP_GROW_RATE) *
        (Game.getGame().prestigeManager.moreExp.active ? 1 + EXP_GAIN_CARD : 1)
    );
  }
  getDarkMatter(enemyLevel): Decimal {
    if (this.currentEnemy.level < ENEMY_EXP_START_LEVEL) return ZERO;
    let dmToAdd = Decimal.multiply(DM_PER_LEVEL, this.currentEnemy.level);
    if (Game.getGame().prestigeManager.moreDM.active) {
      dmToAdd = dmToAdd.times(1 + DM_GAIN_CARD);
    }
    return dmToAdd;
  }
  defeatEnemy() {
    if (!this.currentEnemy) return false;

    if (Game.getGame().prestigeManager.enemyDefeatWarp.active) {
      Game.getGame().timeToWarp += ENEMY_DEFEAT_WARP_CARD;
    }

    Game.getGame().researchManager.searching.inspire();
    Game.getGame().researchManager.scavenging.inspire();

    if (this.currentEnemy.level >= this.maxLevel) {
      if (this.currentEnemy.level >= ENEMY_EXP_START_LEVEL) {
        const pm = Game.getGame().prestigeManager;
        const exp = this.getExperience(this.currentEnemy.level);
        pm.addExperience(exp);
      }
      this.maxLevel++;
    }
    let dmToAdd = ZERO;
    if (this.currentEnemy.level >= ENEMY_EXP_START_LEVEL) {
      dmToAdd = this.getDarkMatter(this.currentEnemy.level);
      Game.getGame().lockedDarkMatter = Game.getGame().lockedDarkMatter.plus(
        dmToAdd
      );
    }
    Game.getGame().notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.ENEMY_DEFEATED,
        "Enemy Defeated!" +
          (dmToAdd.lte(0)
            ? ""
            : " +" + MainService.timePipe.transform(dmToAdd) + " dark matter"),
        "Lv. " +
          MainService.formatPipe.transform(this.currentEnemy.level, true) +
          " " +
          this.currentEnemy.name +
          (this.rewardString === "" ? "" : "\n" + this.rewardString)
      )
    );
    this.currentEnemy = null;
  }
  nuke(cellNum: number) {
    if (!this.currentEnemy) {
      return false;
    }
    const cell = this.currentEnemy.cells[cellNum];
    if (!cell) {
      return false;
    }
    const rm = Game.getGame().resourceManager;
    if (cell.antiMissiles.gt(0)) {
      if (cell.antiMissiles.lte(rm.nuke.quantity)) {
        rm.nuke.quantity = rm.nuke.quantity.minus(cell.antiMissiles);
        cell.antiMissiles = ZERO;
      } else {
        cell.antiMissiles = cell.antiMissiles.minus(rm.nuke.quantity);
        rm.nuke.quantity = ZERO;
      }
    }
    if (cell.antiMissiles.lte(0)) {
      const nukeNeed = cell.getNuke();
      const dmg = Game.getGame().enemyManager.nukeDamage.times(
        Decimal.min(rm.nuke.quantity, nukeNeed)
      );
      cell.nuke(dmg.toNumber(), rm.nuke.quantity.gte(nukeNeed));
      rm.nuke.quantity = rm.nuke.quantity.minus(nukeNeed).max(0);
    }
  }
  reloadNukeDamage() {
    this.nukeDamageMulti.reloadBonus();
    this.nukeDamage = Decimal.times(
      NUKE_DAMAGE,
      this.nukeDamageMulti.totalBonus
    );
  }
  prestige() {
    this.maxLevel = 0;
    this.toDo = [];
    this.currentEnemy = null;
    this.enemies = [];
    for (let i = 0, n = this.fleetsInBattle.length; i < n; i++) {
      this.fleetsInBattle[i] = null;
    }
  }
  //#region Save and Load
  getSave(): any {
    const ret: any = {
      e: this.enemies.map((en) => en.getSave()),
      t: this.toDo.map((t) => t.getSave()),
      m: this.maxLevel,
      a: this.autoAttackOptions.map((auto) => auto.getSave()),
      l: this.lostRow
    };
    if (this.autoNext) {
      ret.x = this.autoNext;
    }
    if (this.autoAttackEnabled) {
      ret.p = this.autoAttackEnabled;
    }
    const searchData = this.searchOptions
      .filter((s) => s.quantity !== 0)
      .map((s) => s.getData());
    if (searchData.length > 0) {
      ret.s = searchData;
    }
    if (this.currentEnemy) {
      ret.c = this.currentEnemy.getSave();
    }
    if (this.autoNuke) ret.n = true;

    return ret;
  }
  load(data: any) {
    if ("e" in data) {
      this.enemies = data.e.map((enemyData) => {
        const enemy = new Enemy();
        enemy.load(enemyData);
        return enemy;
      });
    }
    if ("t" in data) {
      this.toDo = data.t.map((jobData) => {
        const job = new SearchJob();
        job.load(jobData);
        return job;
      });
    }
    if ("c" in data) {
      this.currentEnemy = new Enemy();
      this.currentEnemy.load(data.c);
    }
    if ("m" in data) {
      this.maxLevel = data.m;
    }
    if ("s" in data) {
      data.s.forEach((optionData) => {
        const searchOption = this.searchOptions.find(
          (so) => so.id === optionData.i
        );
        if (searchOption) {
          searchOption.load(optionData);
        }
      });
    }
    if ("a" in data) {
      for (let i = 0; i < FLEET_NUMBER; i++) {
        const optData = data.a[i];
        const opt = this.autoAttackOptions[i];
        if (optData && opt) {
          opt.load(optData);
        }
      }
    }
    if ("p" in data) {
      this.autoAttackEnabled = data.p;
    }
    if ("x" in data) {
      this.autoNext = data.x;
    }
    if ("n" in data) this.autoNuke = data.n;
    if ("l" in data) this.lostRow = data.l;
  }
  //#endregion
}
