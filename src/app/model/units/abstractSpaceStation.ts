import { Unit } from "./unit";
import {
  ZERO,
  UNIT_PRICE_GROW_RATE,
  SPACE_STATION_ICON,
  STATION_PRICE_GROW_RATE_1,
  STATION_PRICE_GROW_RATE_2
} from "../CONSTANTS";
import { Game } from "../game";
import { Research } from "../researches/research";

export abstract class AbstractSpaceStation extends Unit {
  buildPrice = ZERO;
  buildPriceNext = ZERO;
  researchesToInspire: Array<Research>;
  level = 0;
  typeIcon = SPACE_STATION_ICON;

  getBuildPrice(index = Number.POSITIVE_INFINITY) {
    const toDoList = Game.getGame().spaceStationManager.toDo;
    let queued = 0;

    if (toDoList.length > 0) {
      for (let i = 0, n = Math.min(index, toDoList.length); i < n; i++) {
        if (toDoList[i].spaceStation.id === this.id) {
          queued++;
        }
      }
    }
    const pm = Game.getGame().prestigeManager;
    const growRate = pm.spaceStationPrice1.active
      ? pm.spaceStationPrice2.active
        ? STATION_PRICE_GROW_RATE_2
        : STATION_PRICE_GROW_RATE_1
      : UNIT_PRICE_GROW_RATE;
    return Decimal.pow(growRate, this.quantity.plus(queued))
      .times(this.buildPrice)
      .floor();
  }
  reloadBuildPrice() {
    this.buildPriceNext = this.getBuildPrice();
  }
  prestige() {
    super.prestige();
    this.reloadBuildPrice();
  }
}
