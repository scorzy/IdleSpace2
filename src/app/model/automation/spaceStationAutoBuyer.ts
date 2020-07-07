import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";
import { SpaceStation } from "../units/spaceStation";

export enum StationAutoBuyTypes {
  OFF,
  BEST_RATIO,
  CHEAP,
  MOST_SPACE
}
export class SpaceStationAutoBuyer extends AbstractAutobuyer {
  autoBuyType: StationAutoBuyTypes = StationAutoBuyTypes.OFF;
  constructor() {
    super();
    this.id = "spA";
  }
  automate(): boolean {
    const rm = Game.getGame().resourceManager;
    const sp = Game.getGame().spaceStationManager;
    if (!rm.spaceStations[0].unlocked) return false;
    if (sp.toDo.length > 8) return false;

    let selectedStation: SpaceStation;
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
    }
  }
  reload() {
    if (!this.on) this.autoBuyType = StationAutoBuyTypes.OFF;
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.aut = this.autoBuyType;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("aut" in save) this.autoBuyType = save.aut;
      this.reload();
      return true;
    }
  }
  //#endregion
}
