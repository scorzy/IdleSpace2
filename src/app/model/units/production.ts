import { Unit } from "./unit";
import { ONE, ZERO } from "../CONSTANTS";

export class Production {
  prodPerSec = ZERO;
  prodPerSecFull = ZERO;
  prodPerSecMod = ZERO;
  ratio: Decimal;
  expand = false;
  constructor(
    public producer: Unit,
    public product: Unit,
    ratio: DecimalSource = ONE
  ) {
    this.ratio = new Decimal(ratio);
  }
  reload() {
    if (
      this.producer.operativity < Number.EPSILON ||
      this.producer.quantity.lt(Number.EPSILON)
    ) {
      this.prodPerSec = ZERO;
    } else {
      this.reloadFull();
      this.prodPerSec = this.prodPerSecFull.times(
        this.producer.operativity / 100
      );
    }
  }
  reloadFull() {
    const modStack = this.producer.modStack;
    let totalBonus = this.producer.prodAllBonus.totalBonus.times(
      this.product.prodBy.totalBonus
    );
    if (this.ratio.gt(0)) {
      totalBonus = totalBonus.times(this.producer.prodEfficiency.totalBonus);
      if (modStack && modStack.efficiencyMod) {
        totalBonus = totalBonus.times(modStack.efficiencyMod.totalBonus);
      }
    }
    if (modStack && modStack.prodMultiMod) {
      totalBonus = totalBonus.times(modStack.prodMultiMod.totalBonus);
    }
    this.prodPerSecFull = this.ratio.times(totalBonus);
  }
  reloadMod() {
    const modStack = this.producer.modStack;
    let totalBonus = this.producer.prodAllBonus.totalBonus.times(
      this.product.prodBy.totalBonus
    );
    if (this.ratio.gt(0)) {
      totalBonus = totalBonus.times(this.producer.prodEfficiency.totalBonus);
      if (modStack && modStack.efficiencyMod) {
        totalBonus = totalBonus.times(modStack.efficiencyMod.totalBonusTemp);
      }
    }
    if (modStack && modStack.prodMultiMod) {
      totalBonus = totalBonus.times(modStack.prodMultiMod.totalBonusTemp);
    }
    this.prodPerSecMod = this.ratio.times(totalBonus);
  }
}
