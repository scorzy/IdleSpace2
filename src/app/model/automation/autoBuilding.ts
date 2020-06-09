import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Building } from "../units/building";
import { ONE } from "../CONSTANTS";

export enum BuildingAutoBuyTypes {
  ASAP,
  AS_NEED
}
export class AutoBuilding extends AbstractAutobuyer {
  autoBuyType: BuildingAutoBuyTypes = BuildingAutoBuyTypes.ASAP;
  constructor(public building: Building) {
    super();
    // this.on = true;
    building.autoBuyer = this;
  }
  automate(): boolean {
    if (!this.building.unlocked) return false;
    this.building.reloadMaxBuy();
    if (this.building.buyPrice.maxBuy.lt(1)) return false;
    let ret = false;
    switch (this.autoBuyType) {
      case BuildingAutoBuyTypes.ASAP:
        ret = this.building.buy(ONE);
        break;
      case BuildingAutoBuyTypes.AS_NEED:
        if (
          this.building.workers.findIndex(
            (w) => w.fullIn < 60 || w.quantity.gte(w.limit)
          ) > -1
        ) {
          ret = this.building.buy(ONE);
        }
        break;
    }

    return ret;
  }

  //#region Save and Load
  getSave(): any {
    let ret = super.getSave();
    ret.aut = this.autoBuyType;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      this.autoBuyType = save.aut ?? BuildingAutoBuyTypes.ASAP;
      return true;
    }
  }
  //#endregion
}
