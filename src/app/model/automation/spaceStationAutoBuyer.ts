import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";
import { AbstractSpaceStation } from "../units/abstractSpaceStation";
import { SpaceStationJob } from "../space/spaceStationJob";

export enum StationAutoBuyTypes {
  OFF,
  BEST_RATIO,
  CHEAP,
  MOST_SPACE
}
export class SpaceStationAutoBuyer extends AbstractAutobuyer {
  autoBuyType: StationAutoBuyTypes = StationAutoBuyTypes.OFF;
  queueLength = 10;
  constructor() {
    super();
    this.id = "spA";
  }
  automate(): boolean {
    const rm = Game.getGame().resourceManager;
    if (!rm.worker.unlocked) return false;
    const sp = Game.getGame().spaceStationManager;
    if (!rm.spaceStations[0].unlocked) return false;
    if (sp.toDo.length > 20) return false;
    let ret = false;
    const toAdd =
      this.queueLength -
      sp.toDo.reduce((a, b) => a + (b instanceof SpaceStationJob ? 1 : 0), 0);

    for (let i = 0; i < toAdd; i++) {
      let selectedStation: AbstractSpaceStation;
      switch (this.autoBuyType) {
        case StationAutoBuyTypes.BEST_RATIO:
          selectedStation = rm.unlockedSpaceStations.reduce(
            (prev, cur) =>
              prev.habSpace
                .div(prev.buildPriceNext)
                .gt(cur.habSpace.div(cur.buildPriceNext))
                ? prev
                : cur,
            rm.unlockedSpaceStations[0]
          );
          break;
        case StationAutoBuyTypes.CHEAP:
          selectedStation = rm.unlockedSpaceStations.reduce(
            (prev, cur) =>
              prev.buildPriceNext.lt(cur.buildPriceNext) ? prev : cur,
            rm.unlockedSpaceStations[0]
          );
          break;
        case StationAutoBuyTypes.MOST_SPACE:
          selectedStation = rm.unlockedSpaceStations.reduce(
            (prev, cur) => (prev.habSpace.gt(cur.habSpace) ? prev : cur),
            rm.unlockedSpaceStations[0]
          );
          break;
      }

      if (selectedStation) {
        sp.addJob(selectedStation);
        ret = true;
      }
    }
    return ret;
  }
  reload() {
    if (!this.on) this.autoBuyType = StationAutoBuyTypes.OFF;
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.aut = this.autoBuyType;
    ret.qL = this.queueLength;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("aut" in save) this.autoBuyType = save.aut;
      if ("qL" in save) this.queueLength = save.qL;
      this.reload();
      return true;
    }
  }
  //#endregion
}
