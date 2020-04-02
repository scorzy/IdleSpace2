import { Job } from "../job/job";
import { SEARCH_JOB_PRICE, EXTRA_OPT_EXP } from "../CONSTANTS";
import { Game } from "../game";

export class SearchJob extends Job {
  static LAST_ID = 0;
  enemyLevel = 0;
  id = 0;
  //#region Search Options
  habitabilityOpt: number = 0;
  difficultyOpt: number = 0;
  distanceOpt: number = 0;
  energyOpt: number = 0;
  metalOpt: number = 0;
  scienceOpt: number = 0;
  componentOpt: number = 0;
  //#endregion
  constructor() {
    super();
    this.id = SearchJob.LAST_ID;
    SearchJob.LAST_ID++;
    this.canDelete = true;
  }
  init() {
    this.name = "Search " + this.enemyLevel;
    this.total = SearchJob.getPrice(
      this.level,
      this.habitabilityOpt +
        this.difficultyOpt * -1 +
        this.distanceOpt * -1 +
        this.energyOpt +
        this.metalOpt +
        this.scienceOpt +
        this.componentOpt
    );
  }
  static getPrice(level: number, extraOpt: number): Decimal {
    return Decimal.multiply(level + 1, SEARCH_JOB_PRICE).times(
      Decimal.pow(EXTRA_OPT_EXP, Math.max(extraOpt, 0))
    );
  }
  onCompleted() {
    Game.getGame().enemyManager.generateEnemy(this);
  }
  reload() {
    const perSec = Game.getGame().resourceManager.search.perSec;
    this.timeToEnd = perSec.lte(0)
      ? Number.POSITIVE_INFINITY
      : this.getRemaining()
          .div(perSec)
          .floor()
          .toNumber();
  }
  delete() {
    const list = Game.getGame().enemyManager.toDo;
    list.splice(
      list.findIndex(e => e === this),
      1
    );
  }
  //#region Save and Load
  getSave() {
    const ret: any = {
      l: this.enemyLevel
    };
    if (this.habitabilityOpt !== 0) ret.h = this.habitabilityOpt;
    if (this.difficultyOpt !== 0) ret.d = this.difficultyOpt;
    if (this.distanceOpt !== 0) ret.i = this.distanceOpt;
    if (this.energyOpt !== 0) ret.e = this.energyOpt;
    if (this.metalOpt !== 0) ret.m = this.metalOpt;
    if (this.scienceOpt !== 0) ret.s = this.scienceOpt;
    if (this.componentOpt !== 0) ret.c = this.componentOpt;
    return ret;
  }
  load(data: any) {
    if ("l" in data) this.enemyLevel = data.l;
    if ("h" in data) this.habitabilityOpt = data.h;
    if ("d" in data) this.difficultyOpt = data.d;
    if ("i" in data) this.distanceOpt = data.i;
    if ("e" in data) this.energyOpt = data.e;
    if ("m" in data) this.scienceOpt = data.m;
    if ("s" in data) this.metalOpt = data.s;
    if ("c" in data) this.componentOpt = data.c;
    this.init();
  }
  //#endregion
}
