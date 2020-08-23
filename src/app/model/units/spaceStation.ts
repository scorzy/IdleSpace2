import { Unit } from "./unit";
import {
  ZERO,
  EXTRA_DISTRICTS_FROM_STATIONS,
  UNIT_PRICE_GROW_RATE
} from "../CONSTANTS";
import { BonusStack } from "../bonus/bonusStack";
import { Game } from "../game";
import { Research } from "../researches/research";

export class SpaceStation extends Unit {
  buildPrice = ZERO;
  habSpace = ZERO;
  habSpaceOriginal = ZERO;
  habSpaceStack: BonusStack;
  priceDivDabSpace = ZERO;
  buildPriceNext = ZERO;
  researchesToInspire: Array<Research>;
  level = 0;

  getBuildPrice(index = Number.POSITIVE_INFINITY) {
    const toDoList = Game.getGame().spaceStationManager.toDo;
    let queued = 0;

    if (toDoList.length > 0) {
      for (let i = 0, n = Math.min(index, toDoList.length); i < n; i++) {
        if (toDoList[i].spaceStation === this) {
          queued++;
        }
      }
    }
    return Decimal.pow(UNIT_PRICE_GROW_RATE, this.quantity.plus(queued))
      .times(this.buildPrice)
      .floor();
  }
  reloadBuildPrice() {
    this.buildPriceNext = this.getBuildPrice();
  }
  reloadHabSpace() {
    if (!this.habSpaceStack) {
      return false;
    }
    const habSpace = Game.getGame().resourceManager.habitableSpace;
    const old = this.habSpace;
    this.habSpaceStack.reloadBonus();
    this.habSpace = this.habSpaceOriginal.times(this.habSpaceStack.totalBonus);
    habSpace.quantity = habSpace.quantity.plus(
      Decimal.minus(this.habSpace, old).times(this.quantity)
    );
    const extraDistricts = Decimal.minus(this.habSpace, old).times(
      EXTRA_DISTRICTS_FROM_STATIONS
    );
    if (extraDistricts.gt(0)) {
      const game = Game.getGame();
      if (game.prestigeManager.extraMiningDistricts.active) {
        game.resourceManager.miningDistrict.quantity = game.resourceManager.miningDistrict.quantity.plus(
          extraDistricts.times(this.quantity)
        );
      }
      if (game.prestigeManager.extraEnergyDistricts.active) {
        game.resourceManager.energyDistrict.quantity = game.resourceManager.energyDistrict.quantity.plus(
          extraDistricts.times(this.quantity)
        );
      }
    }

    this.priceDivDabSpace = this.buildPriceNext.div(this.habSpace);
  }
}
