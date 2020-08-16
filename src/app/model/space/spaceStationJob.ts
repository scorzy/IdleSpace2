import { Job } from "../job/job";
import { Game } from "../game";
import { SpaceStation } from "../units/spaceStation";
import { UNIT_TYPES } from "../data/units";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { EXTRA_DISTRICTS_FROM_STATIONS } from "../CONSTANTS";

export class SpaceStationJob extends Job {
  constructor(public spaceStation: SpaceStation) {
    super();
    this.canDelete = true;
    this.type = Game.getGame().researchManager.civilEngTech;
    this.reload();
    this.spaceStation.reloadBuildPrice();
  }
  get totalBonus(): Decimal {
    return this.type.bonus.totalBonus;
  }
  set totalBonus(bon: Decimal) {}
  get name(): string {
    return this.spaceStation.name;
  }
  onCompleted() {
    const game = Game.getGame();
    this.spaceStation.quantity = this.spaceStation.quantity.plus(1);
    if (this.spaceStation.unitData.unitType === UNIT_TYPES.SPACE_STATION) {
      const habSpace = game.resourceManager.habitableSpace;
      habSpace.quantity = habSpace.quantity.plus(this.spaceStation.habSpace);
      if (game.prestigeManager.extraMiningDistricts.active) {
        game.resourceManager.miningDistrict.quantity = game.resourceManager.miningDistrict.quantity.plus(
          this.spaceStation.habSpace.times(EXTRA_DISTRICTS_FROM_STATIONS)
        );
      }
      if (game.prestigeManager.extraEnergyDistricts.active) {
        game.resourceManager.energyDistrict.quantity = game.resourceManager.energyDistrict.quantity.plus(
          this.spaceStation.habSpace.times(EXTRA_DISTRICTS_FROM_STATIONS)
        );
      }
    } else if (
      this.spaceStation.unitData.unitType === UNIT_TYPES.MEGASTRUCTURE
    ) {
      const sm = game.spaceStationManager;
      sm.megaBuilt = sm.megaBuilt.plus(1);
    }

    game.notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.SPACE_STATION_COMPLETED,
        this.spaceStation.name + " completed."
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
