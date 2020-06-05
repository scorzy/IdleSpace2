import { Unit } from "./unit";
import { ZERO } from "../CONSTANTS";
import { BonusStack } from "../bonus/bonusStack";
import { Game } from "../game";

export class SpaceStation extends Unit {
  buildPrice = ZERO;
  habSpace = ZERO;
  habSpaceOriginal = ZERO;
  habSpaceStack: BonusStack;
  habSpaceDivPrice = ZERO;
  buildPriceNext = ZERO;

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
    return Decimal.pow(1.1, this.quantity.plus(queued))
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
    this.habSpaceDivPrice = this.habSpace.div(this.buildPriceNext).times(1e12);
  }
}
