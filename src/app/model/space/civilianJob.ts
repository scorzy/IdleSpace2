
import { Game } from "../game";
import { Job } from "../job/job";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { AbstractSpaceStation } from "../units/abstractSpaceStation";

export class CivilianJob extends Job {
  get name(): string {
    return this.spaceStation.name;
  }
  constructor(public spaceStation: AbstractSpaceStation) {
    super();
    this.canDelete = true;
    this.type = Game.getGame().researchManager.civilEngTech;
    this.reloadTotalBonus();
    this.reload();
    this.spaceStation.reloadBuildPrice();
  }
  onCompleted() {
    const game = Game.getGame();
    this.spaceStation.quantity = this.spaceStation.quantity.plus(1);

    game.notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.SPACE_STATION_COMPLETED,
        this.spaceStation.name
      )
    );

    if (this.spaceStation.researchesToInspire) {
      for (
        let i = 0, n = this.spaceStation.researchesToInspire.length;
        i < n;
        i++
      ) {
        this.spaceStation.researchesToInspire[i].inspire();
      }
    }
    if (Game.getGame().prestigeManager.spaceStationWarp.active) {
      Game.getGame().timeToWarp =
        Game.getGame().timeToWarp + 1 + this.spaceStation.level / 2;
    }
  }
  reload() {
    const toDoList = Game.getGame().spaceStationManager.toDo;
    const index = toDoList.indexOf(this);
    this.total = this.spaceStation.getBuildPrice(index);

    this.timeToEnd = this.getRemaining()
      .div(Game.getGame().civWorkPerSec)
      .toNumber();
  }
  delete() {
    const manager = Game.getGame().spaceStationManager;
    manager.toDo.splice(manager.toDo.indexOf(this), 1);
    manager.postUpdate();
    this.spaceStation.reloadBuildPrice();
  }
  //#region Save and Load
  getSave() {
    const ret: any = {};
    ret.i = this.spaceStation.id;
    if (this.progress.gt(0)) {
      ret.p = this.progress;
    }
    return ret;
  }
  load(data: any) {
    if (!("i" in data)) {
      return false;
    }
    if ("p" in data) {
      this.progress = new Decimal(data.p);
    }
    this.reload();
  }
  //#endregion
}
