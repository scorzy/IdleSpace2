import { Job } from "../job/job";
import { SEARCH_JOB_PRICE } from "../CONSTANTS";
import { Game } from "../game";

export class SearchJob extends Job {

  constructor() {
    super();
    this.id = SearchJob.LAST_ID;
    SearchJob.LAST_ID++;
    this.canDelete = true;
  }
  static LAST_ID = 0;
  enemyLevel = 0;
  id = 0;
  init() {
    this.name = "Search " + this.enemyLevel;
    this.total = Decimal.multiply(this.enemyLevel + 1, SEARCH_JOB_PRICE);
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
    return {
      l: this.enemyLevel
    };
  }
  load(data: any) {
    if ("l" in data) this.enemyLevel = data.l;

    this.init();
  }
  //#endregion
}
