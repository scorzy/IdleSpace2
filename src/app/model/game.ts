import { ResourceManager } from "./units/resourceManager";
import { ResearchManager } from "./researches/researchManager";
import { ShipyardManager } from "./shipyard/shipyardManager";
import {
  BASE_NAVAL_CAPACITY,
  ZERO,
  TEN,
  SIX_HOURS,
  LEVEL_PER_CARD,
  UPDATE_WARP_CARD,
  ONE,
  AUTOMATION_UNLOCKED_LEVEL,
  GAME_VERSION
} from "./CONSTANTS";
import { EnemyManager } from "./enemy/enemyManager";
import { BattleResult, Stats } from "./battle/battleResult";
import { SpaceStationManager } from "./space/spaceStationManager";
import { NotificationManager } from "./notifications/notificationManager";
import { AutomationManager } from "./automation/automationManager";
import { ComputingManager } from "./computing/computingManager";
import {
  MyNotification,
  NotificationTypes
} from "./notifications/myNotification";
import { MainService } from "../main.service";
import { PrestigeManager } from "./prestige/prestigeManager";
import { BonusStack } from "./bonus/bonusStack";
import { ChallengeManager } from "./challenge/challengeManager";
import { Challenge } from "./challenge/challenge";
import { Bonus } from "./bonus/bonus";
import { AchievementManager } from "./achievements/achievementManager";
import { StatsManager } from "./stats/statsManager";
import { Achievement } from "./achievements/achievement";
import { Spell } from "./computing/spell";
import { IBase } from "./iBase";
import { PrestigeCard } from "./prestige/prestigeCard";
import { PrestigePoint } from "./prestige/prestigePoint";
import { Research } from "./researches/research";
import { Building } from "./units/building";
import { SpaceStation } from "./units/spaceStation";

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
  automationManager: AutomationManager;
  computingManager: ComputingManager;
  prestigeManager: PrestigeManager;
  challengeManager: ChallengeManager;
  achievementManager: AchievementManager;
  statsManager: StatsManager;

  navalCapacity: number = BASE_NAVAL_CAPACITY;

  battleStats: Array<{
    id: string;
    fleetNum: number;
    name: string;
    stats: Stats[];
    date: number;
    battleResult: BattleResult;
  }>;
  lastId = 0;
  updateStats = true;

  civilianWorkPercent = 50;
  civWorkPerSec = ZERO;
  shipWorkPerSec = ZERO;
  baseRecycling = ZERO;
  recyclingMulti = new BonusStack();
  notificationManager = new NotificationManager();

  customBuy = TEN;
  customBuyPercent = 1;
  buyFixed = false;
  timeToWarp = 0;
  idleTimeMultipliers: BonusStack;
  darkMatter = ZERO;
  lockedDarkMatter = ZERO;
  firstUpdate = true;
  firstRun = true;
  automationUnlocked = false;
  additiveNavalCapStack: BonusStack;
  multiNavalCapStack: BonusStack;
  lastPrestigeTime = Date.now();
  extraAttacks = [true, true, true, true, true];
  skipPost = false;

  private _gameId = "";
  private battleResults: { result: BattleResult; fleet: number }[] = [];

  /**
   * Gets game return instance of game
   * this is not a real singleton, may return null
   *
   * @returns game
   */
  static getGame(): Game {
    return Game.instance;
  }
  constructor() {
    Game.instance = this;
    this.statsManager = new StatsManager();
    this.idleTimeMultipliers = new BonusStack();
    this.additiveNavalCapStack = new BonusStack();
    this.multiNavalCapStack = new BonusStack();
    this.additiveNavalCapStack.bonuses.push(
      new Bonus(
        {
          id: "",
          name: "Initial Naval Capacity",
          quantity: ONE,
          typeIcon: "my:strafe"
        },
        new Decimal(BASE_NAVAL_CAPACITY)
      )
    );
    this.generateGameId();
    this.resourceManager = new ResourceManager();
    this.resourceManager.makeUnits();
    this.researchManager = new ResearchManager();
    this.shipyardManager = new ShipyardManager();
    this.enemyManager = new EnemyManager();
    this.spaceStationManager = new SpaceStationManager();
    this.computingManager = new ComputingManager();
    this.shipyardManager.init();
    this.researchManager.makeShipsResearches();
    this.researchManager.makeSpaceStationResearches();
    this.researchManager.setRelations();
    this.resourceManager.makeUnitsMods();
    this.resourceManager.makeDepartments();

    this.resourceManager.setRelations();
    this.automationManager = new AutomationManager();
    this.prestigeManager = new PrestigeManager();
    this.challengeManager = new ChallengeManager();
    this.researchManager.setChallengesRelations();
    this.researchManager.setPrestigeRelations();

    this.achievementManager = new AchievementManager();
    this.shipyardManager.afterResearchesInit();

    this.setTheme();
    this.achievementManager.afterInit();

    this.battleStats = Array<{
      id: string;
      fleetNum: number;
      name: string;
      stats: Stats[];
      date: number;
      battleResult: BattleResult;
    }>();
    this.researchManager.researches.forEach((res) => res.loadMax());
  }
  /**
   * Generate an unique ID. Used for battle.
   */
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
   *
   * @param delta in seconds
   */
  update(delta: number) {
    //  Warps
    this.idleTimeMultipliers.reloadBonus();
    if (delta > SIX_HOURS) {
      const oldDelta = delta;
      delta = this.idleTimeMultipliers.totalBonus.toNumber() * delta;
      const diff = delta - oldDelta;
      if (diff > 0) {
        this.notificationManager.addNotification(
          new MyNotification(
            NotificationTypes.EXTRA_TIME,
            "+ " + MainService.timePipe.transform(diff)
          )
        );
      }
    }
    if (
      this.prestigeManager.updateWarp.active &&
      delta > UPDATE_WARP_CARD * 3600
    ) {
      this.timeToWarp += delta;
      delta = 0;
    }
    if (this.timeToWarp > 0) {
      //  Double Warp
      if (this.prestigeManager.moreWarp.active) {
        this.timeToWarp = this.timeToWarp * 2;
      }
      //  Science Warp
      if (this.prestigeManager.scienceWarp.active) {
        this.scienceWarp(this.timeToWarp);
      }
      this.notificationManager.addNotification(
        new MyNotification(
          NotificationTypes.WARP,
          "Warp: " + MainService.timePipe.transform(this.timeToWarp, 1)
        ),
        this.timeToWarp
      );
      this.statsManager.onWarp(this.timeToWarp);
    }
    let toUpdate = delta + this.timeToWarp;
    const warped = this.timeToWarp;
    this.timeToWarp = 0;
    this.processBattles(warped);

    if (this.automationUnlocked) this.automationManager.update();

    let n = 0;
    while (toUpdate > 0 && n < 20) {
      n++;
      // console.log(n + " " + toUpdate);
      this.resourceManager.shipyardWork.limit = this.shipyardManager
        .getWorkNeeded()
        .plus(this.spaceStationManager.getWorkNeeded());
      this.resourceManager.search.limit = this.enemyManager.getWorkNeeded();
      this.resourceManager.reloadProduction();
      if (this.resourceManager.maxTime > 0) {
        // Avoid problems with js number rounding
        this.resourceManager.maxTime = this.resourceManager.maxTime + 0.05;
      }
      const maxUp = Math.min(toUpdate, this.resourceManager.maxTime);
      if (maxUp > 0) {
        this.resourceManager.update(maxUp);
        toUpdate = toUpdate - maxUp;
      }
      if (toUpdate > 0) {
        this.resourceManager.stopResources();
      }

      if (this.resourceManager.spaceStations[0].unlocked) {
        const shipWork =
          this.spaceStationManager.toDo.length > 0
            ? this.resourceManager.shipyardWork.quantity.times(
                (100 - this.civilianWorkPercent) / 100
              )
            : this.resourceManager.shipyardWork.quantity;

        const civWork = this.resourceManager.shipyardWork.quantity.minus(
          shipWork
        );
        const notAdded = this.shipyardManager.addProgress(shipWork).max(0);
        this.spaceStationManager.addProgress(civWork.plus(notAdded));
      } else {
        this.shipyardManager
          .addProgress(this.resourceManager.shipyardWork.quantity)
          .max(0);
      }

      this.resourceManager.shipyardWork.quantity = ZERO;
      this.enemyManager.addProgress(this.resourceManager.search.quantity);
      this.resourceManager.search.quantity = ZERO;
    }
    this.firstUpdate = false;
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
  postUpdate(delta: number) {
    this.skipPost = !this.skipPost;
    this.notificationManager.notifyResearches();

    this.challengeManager.postUpdate();
    this.computingManager.update(delta);
    this.reloadWorkPerSec();
    for (let i = 0, n = this.researchManager.technologies.length; i < n; i++) {
      this.researchManager.technologies[i].bonus.reloadBonus();
      this.researchManager.technologies[i].technologyBonus.reloadBonus();
    }
    const resNotAdded = this.researchManager.addProgress(
      this.resourceManager.science.quantity
    );
    this.resourceManager.science.quantity = resNotAdded;
    this.resourceManager.reloadProduction();
    this.resourceManager.postUpdate();
    for (let i = 0, n = this.researchManager.toDo.length; i < n; i++) {
      this.researchManager.toDo[i].reloadTotalBonus();
    }
    for (let i = 0, n = this.researchManager.backlog.length; i < n; i++) {
      this.researchManager.backlog[i].reloadTotalBonus();
    }
    this.reloadNavalCapacity();
    this.resourceManager.reloadMods();

    this.shipyardManager.postUpdate();
    this.enemyManager.postUpdate();
    this.spaceStationManager.postUpdate();
    this.reloadBaseRecycling();
    this.resourceManager.energy.quantity = this.resourceManager.energy.quantity.min(
      this.resourceManager.energy.limit
    );
    this.prestigeManager.loadNextMultiplier();
    this.extraAttacks[0] = true;
    this.extraAttacks[1] = true;
    this.extraAttacks[2] = true;
    this.extraAttacks[3] = true;
    this.extraAttacks[4] = true;
    if (!this.skipPost) this.achievementManager.postUpdate();
  }
  /**
   * Reload naval capacity.
   */
  reloadNavalCapacity() {
    this.additiveNavalCapStack.reloadAdditiveBonus();
    this.multiNavalCapStack.reloadBonus();
    this.navalCapacity = this.additiveNavalCapStack.totalAdditiveBonus
      .times(this.multiNavalCapStack.totalBonus)
      .toNumber();
    this.navalCapacity = Math.floor(this.navalCapacity);
    this.shipyardManager.reloadFleetCapacity();
  }
  /**
   * Add BattleResult to results list.
   */
  onBattleEnd(battleResult: BattleResult, fleetNum: number) {
    if (battleResult.gameId !== this.gameId) {
      return;
    }

    this.battleResults.push({ result: battleResult, fleet: fleetNum });
    const now = performance.now();
    if (
      this.prestigeManager.doubleAttackCard.active &&
      now >= battleResult.endTime &&
      this.extraAttacks[fleetNum]
    ) {
      this.processBattles(0);
      this.enemyManager.autoAttack();
      this.extraAttacks[fleetNum] = false;
    }
  }
  /**
   * Process ended battles.
   *
   * @param warpTime
   */
  processBattles(warpTime: number) {
    const now = performance.now();
    if (this.prestigeManager.battleWarp.active) {
      warpTime *= 2;
    }
    if (this.enemyManager.currentEnemy) {
      this.enemyManager.currentEnemy.cells.forEach((c) => {
        if (c.inBattle && !c.done) {
          c.eta -= warpTime * 1000;
        }
      });
    }
    for (let i = this.battleResults.length - 1; i >= 0; i--) {
      const battleResult = this.battleResults[i].result;
      const fleetNum = this.battleResults[i].fleet;
      battleResult.endTime -= warpTime * 1000;

      if (now >= battleResult.endTime) {
        if (this.enemyManager.currentEnemy && this.updateStats) {
          const toAdd = {
            id: "" + this.lastId++,
            fleetNum,
            name:
              this.enemyManager.currentEnemy.name +
              " lv." +
              this.enemyManager.currentEnemy.level +
              " cell: " +
              this.enemyManager.fleetsInBattle[fleetNum].index,
            stats: battleResult.stats,
            date: Date.now(),
            battleResult
          };
          this.battleStats.unshift(toAdd);
          this.battleStats.splice(10);
        }

        this.shipyardManager.onBattleEnd(battleResult, fleetNum);
        this.enemyManager.onBattleEnd(battleResult, fleetNum);
        this.battleResults.splice(i, 1);
      }
    }
  }
  /**
   * Set technologies colors
   */
  setTheme() {
    this.researchManager.technologies.forEach((tech) => {
      tech.setTheme();
    });
  }
  reloadBaseRecycling() {
    this.recyclingMulti.reloadBonus();
    this.baseRecycling = ZERO;
    for (let i = 0, n = this.researchManager.researches.length; i < n; i++) {
      this.baseRecycling = this.baseRecycling.plus(
        this.researchManager.researches[i].quantity.times(
          this.researchManager.researches[i].recycling
        )
      );
    }
  }
  prestige() {
    //  Try to send stats to kongregate
    try {
      MainService.instance.sendKong();
    } catch (ex) {}

    const newMaxCard = Math.floor(
      (this.enemyManager.maxLevel - 1) / LEVEL_PER_CARD
    );
    this.generateGameId();
    this.prestigeManager.loadNextMultiplier();
    this.resourceManager.prestige();
    this.researchManager.prestige();
    this.shipyardManager.prestige();
    this.spaceStationManager.prestige();
    this.enemyManager.prestige();
    this.computingManager.prestige();
    this.battleResults = [];
    this.battleStats = [];
    this.prestigeManager.prestigeMultiplier = this.prestigeManager.nextPrestigeMultiplier;
    this.prestigeManager.loadNextMultiplier();
    this.darkMatter = this.darkMatter.plus(this.lockedDarkMatter);
    this.lockedDarkMatter = ZERO;
    this.prestigeManager.lockedCars = false;
    this.prestigeManager.maxCards = Math.max(
      this.prestigeManager.maxCards,
      newMaxCard
    );
    this.firstRun = false;
    this.postUpdate(0);
    MainService.instance.lastUnitId = "m";
    this.lastPrestigeTime = Date.now();
  }
  startChallenge(challenge: Challenge) {
    if (!this.challengeManager.startChallenge(challenge)) return;
    this.prestige();
    this.prestigeManager.prestigeMultiplier = ONE;
    this.postUpdate(0);
  }
  quitChallenge() {
    this.challengeManager.activeChallenge = null;
    this.postUpdate(0);
  }
  scienceWarp(timeToWarp: number) {
    const totalScience = this.resourceManager.science.makers
      .filter((p) => p.ratio.gt(0) && p.producer.quantity.gt(0))
      .map((p) => p.prodPerSec.times(p.producer.quantity))
      .reduce((p, c) => p.plus(c), ZERO);
    this.resourceManager.science.quantity = this.resourceManager.science.quantity.plus(
      totalScience.times(timeToWarp)
    );
  }
  /**
   * Warp with Dark Matter
   *
   * @param time warp in seconds
   */
  warp(time: number): boolean {
    if (this.darkMatter.lt(time)) return false;
    this.darkMatter = this.darkMatter.minus(time);
    this.timeToWarp = this.timeToWarp + time;
    return true;
  }
  static GetClassIcon(base: IBase): string {
    let ret = "";
    if (base instanceof Research) {
      ret = "fa-s:flask";
    } else if (base instanceof Challenge) {
      ret = "fa-s:flask";
    } else if (base instanceof Achievement) {
      ret = "trophy";
    } else if (base instanceof PrestigeCard) {
      ret = "fa-s:layer-group";
    } else if (base instanceof PrestigePoint) {
      ret = "arrow-up";
    } else if (base instanceof Building) {
      ret = "fa-s:building";
    } else if (base instanceof SpaceStation) {
      ret = "my:defense-satellite";
    } else if (base instanceof Spell) {
      ret = "my:computing";
    }
    return ret;
  }
  //#region Save and Load
  getSave(): any {
    return {
      s: this.resourceManager.getSave(),
      r: this.researchManager.getSave(),
      d: this.shipyardManager.getSave(),
      e: this.enemyManager.getSave(),
      m: this.spaceStationManager.getSave(),
      c: this.civilianWorkPercent,
      a: this.automationManager.getSave(),
      p: this.computingManager.getSave(),
      t: this.prestigeManager.getSave(),
      k: this.darkMatter,
      l: this.lockedDarkMatter,
      fr: this.firstRun,
      j: this.challengeManager.getSave(),
      u: this.automationUnlocked,
      v: GAME_VERSION,
      P: this.lastPrestigeTime,
      A: this.achievementManager.getSave(),
      S: this.statsManager.getSave()
    };
  }
  load(data: any) {
    if (!("s" in data && "r" in data)) {
      throw new Error("Save not valid");
    }
    const saveVersion = "v" in data ? data.v : 0;
    if ("S" in data) this.statsManager.load(data.S);

    if ("P" in data && typeof data.P === "number") {
      this.lastPrestigeTime = data.P;
    }

    if ("u" in data) this.automationUnlocked = data.u;
    if ("fr" in data) this.firstRun = data.fr;
    if ("j" in data) this.challengeManager.load(data.j);

    this.resourceManager.load(data.s);
    this.researchManager.load(data.r, saveVersion);
    //  Reload module status
    this.shipyardManager.postUpdate();
    if ("d" in data) {
      this.shipyardManager.load(data.d);
    }
    if ("e" in data) {
      this.enemyManager.load(data.e);
    }
    if ("m" in data) {
      this.spaceStationManager.load(data.m);
    }
    if ("c" in data) {
      this.civilianWorkPercent = data.c;
    }
    if ("a" in data) {
      this.automationManager.load(data.a);
    }
    if ("p" in data) {
      this.computingManager.load(data.p);
    }
    if ("t" in data) this.prestigeManager.load(data.t);
    if ("k" in data) this.darkMatter = new Decimal(data.k);
    if ("l" in data) this.lockedDarkMatter = new Decimal(data.l);

    if (
      !this.firstRun ||
      this.enemyManager.maxLevel >= AUTOMATION_UNLOCKED_LEVEL
    ) {
      this.automationUnlocked = true;
    }

    //  Fix No Physics challenge
    if (this.challengeManager.noPhysics.isActive) {
      this.shipyardManager.modules.forEach((mod) => {
        if (mod.technologies.some((tec) => tec.technology.id === "p")) {
          mod.unlocked = false;
        }
      });
    }
    if ("A" in data) {
      this.achievementManager.load(data.A);
    }
    this.researchManager.researches.forEach((res) => res.loadMax());
    //this.enemyManager.maxLevel = 900;

    this.challengeManager.afterLoad();
    this.researchManager.researches.forEach((res) => res.reload());
    this.postUpdate(0);

    // this.challengeManager.expandingChallenge.quantity = new Decimal(10);
    // this.prestigeManager.maxCards = 80;
    // this.prestigeManager.lockedCars = false;
    // this.darkMatter = new Decimal(1e20);
    // this.prestigeManager.experience = new Decimal(1e6);
    // this.challengeManager.scienceChallenge.quantity = new Decimal(1);
  }
  //#endregion
}
