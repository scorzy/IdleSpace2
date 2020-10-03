import { Game } from "../game";
import { Infrastructure } from "../units/infrastructure";
import { AbstractAutobuyer } from "./abstractAutoBuyer";

export enum InfrastructureAutoBuyTypes {
  OFF,
  BEST_RATIO,
  CHEAP,
  MOST_BONUS
}
export class InfrastructureAutoBuyer extends AbstractAutobuyer {
  autoBuyType: InfrastructureAutoBuyTypes = InfrastructureAutoBuyTypes.OFF;
  constructor() {
    super();
    this.id = "Ifab";
  }
  automate(): boolean {
    const rm = Game.getGame().resourceManager;
    if (!rm.worker.unlocked) return false;
    if (!rm.infrastructures[0].unlocked) return false;
    const sp = Game.getGame().spaceStationManager;
    if (sp.toDo.length > 8) return false;

    let selectedStation: Infrastructure;
    switch (this.autoBuyType) {
      case InfrastructureAutoBuyTypes.BEST_RATIO:
        selectedStation = rm.unlockedInfrastructures.reduce(
          (prev, cur) =>
            prev.speedBonus
              .div(prev.buildPriceNext)
              .gt(cur.speedBonus.div(cur.buildPriceNext))
              ? prev
              : cur,
          rm.unlockedInfrastructures[0]
        );
        break;
      case InfrastructureAutoBuyTypes.CHEAP:
        selectedStation = rm.unlockedInfrastructures.reduce(
          (prev, cur) =>
            prev.buildPriceNext.lt(cur.buildPriceNext) ? prev : cur,
          rm.unlockedInfrastructures[0]
        );
        break;
      case InfrastructureAutoBuyTypes.MOST_BONUS:
        selectedStation = rm.unlockedInfrastructures.reduce(
          (prev, cur) => (prev.speedBonus.gt(cur.speedBonus) ? prev : cur),
          rm.unlockedInfrastructures[0]
        );
        break;
    }
    if (selectedStation) {
      sp.addJob(selectedStation);
    }
  }
  reload() {
    if (!this.on) this.autoBuyType = InfrastructureAutoBuyTypes.OFF;
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
