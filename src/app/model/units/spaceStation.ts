import { ZERO, EXTRA_DISTRICTS_FROM_STATIONS, ONE } from "../CONSTANTS";
import { BonusStack } from "../bonus/bonusStack";
import { Game } from "../game";
import { AbstractSpaceStation } from "./abstractSpaceStation";

export class SpaceStation extends AbstractSpaceStation {
  habSpace = ZERO;
  miningDistricts = ZERO;
  energyDistricts = ZERO;
  habSpaceOriginal = ZERO;
  priceDivDabSpace = ONE;
  habSpaceStack: BonusStack;

  reloadHabSpace() {
    if (!this.habSpaceStack) {
      return false;
    }
    const habSpace = Game.getGame().resourceManager.habitableSpace;
    const old = this.habSpace;
    const oldMining = this.miningDistricts;
    const oldEnergy = this.energyDistricts;
    this.habSpaceStack.reloadBonus();
    this.habSpace = this.habSpaceOriginal.times(this.habSpaceStack.totalBonus);
    habSpace.quantity = habSpace.quantity.plus(
      Decimal.minus(this.habSpace, old).times(this.quantity)
    );

    const game = Game.getGame();
    if (game.prestigeManager.extraMiningDistricts.active) {
      this.miningDistricts = this.habSpace.times(EXTRA_DISTRICTS_FROM_STATIONS);
      const extraDistricts = this.miningDistricts.minus(oldMining);
      if (extraDistricts.gt(0)) {
        game.resourceManager.miningDistrict.quantity = game.resourceManager.miningDistrict.quantity.plus(
          extraDistricts.times(this.quantity)
        );
      }
    } else {
      this.miningDistricts = ZERO;
    }
    if (game.prestigeManager.extraEnergyDistricts.active) {
      this.energyDistricts = this.habSpace.times(EXTRA_DISTRICTS_FROM_STATIONS);
      const extraDistricts = this.energyDistricts.minus(oldEnergy);
      if (extraDistricts.gt(0)) {
        game.resourceManager.energyDistrict.quantity = game.resourceManager.energyDistrict.quantity.plus(
          extraDistricts.times(this.quantity)
        );
      }
    } else {
      this.energyDistricts = ZERO;
    }

    this.priceDivDabSpace = this.buildPriceNext.div(this.habSpace);
  }
  prestige() {
    super.prestige();
    this.reloadHabSpace();
  }
}
