import { SpaceStation } from "./spaceStation";
import { Game } from "../game";
import { MEGA_PRICE_MULTI } from "../CONSTANTS";
import { UNIT_TYPES } from "../data/units";

export class MegaStructure extends SpaceStation {
  static getMegaBuildPrice(index = Number.POSITIVE_INFINITY): Decimal {
    const toDoList = Game.getGame().spaceStationManager.toDo;
    let queued = 0;

    if (toDoList.length > 0) {
      for (let i = 0, n = Math.min(index, toDoList.length); i < n; i++) {
        if (
          toDoList[i].spaceStation.unitData.unitType ===
          UNIT_TYPES.MEGASTRUCTURE
        ) {
          queued++;
        }
      }
    }
    const sm = Game.getGame().spaceStationManager;
    return Decimal.pow(MEGA_PRICE_MULTI, sm.megaBuilt.plus(queued))
      .times(sm.megaInitialPrice)
      .floor();
  }

  getBuildPrice(index = Number.POSITIVE_INFINITY): Decimal {
    return MegaStructure.getMegaBuildPrice(index);
  }
}
