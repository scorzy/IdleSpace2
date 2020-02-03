import { Job } from "../job/job";
import { Unit } from "../units/unit";
import { Game } from "../game";

export class SpaceStationJob extends Job {
  constructor(public spaceStation: Unit) {
    super();
    this.canDelete = true;
    this.reload();
    this.spaceStation.reloadBuildPrice();
  }
  get name(): string {
    return this.spaceStation.name;
  }
  onCompleted() {
    this.spaceStation.quantity = this.spaceStation.quantity.plus(1);
  }
  reload() {
    const toDoList = Game.getGame().spaceStationManager.toDo;
    const index = toDoList.indexOf(this);
    this.total = this.spaceStation.getBuildPrice(index);
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
    if (!("i" in data)) return false;
    if ("p" in data) this.progress = new Decimal(data.p);
    this.reload();
  }
  //#endregion
}
