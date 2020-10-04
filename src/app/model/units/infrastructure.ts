import { BonusStack } from "../bonus/bonusStack";
import { ONE } from "../CONSTANTS";
import { AbstractSpaceStation } from "./abstractSpaceStation";

export class Infrastructure extends AbstractSpaceStation {
  speedStack: BonusStack;
  priceDivBonus = ONE;
  speedBonus = ONE;
  speedOriginal = ONE;
  speedBonusUi = ONE;
  totalBonus = ONE;
  totalBonusUi = ONE;
  reloadBonus() {
    if (!this.speedStack) return false;
    this.speedStack.reloadBonus();
    this.speedBonus = this.speedOriginal.times(this.speedStack.totalBonus);
    this.totalBonus = this.quantity.times(this.speedBonus);
    this.priceDivBonus = this.buildPriceNext.div(this.speedBonus);
    this.speedBonusUi = this.speedBonus.times(100);
    this.totalBonusUi = this.quantity.times(this.speedBonusUi);
  }
  prestige() {
    super.prestige();
    this.reloadBonus();
  }
}
