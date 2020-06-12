import { Worker } from "./worker";
import { ONE, ZERO } from "../CONSTANTS";
import { Unit } from "./unit";

export class Production {
  prodPerSec = ZERO;
  prodPerSecFull = ZERO;
  prodPerSecMod = ZERO;
  ratio: Decimal;
  expand = false;
  constructor(
    public producer: Worker,
    public product: Unit,
    ratio: DecimalSource = ONE
  ) {
    this.ratio = new Decimal(ratio);
  }
  reload() {
    this.reloadFull();
    if (
      this.producer.operativity < Number.EPSILON ||
      this.producer.quantity.lt(Number.EPSILON)
    ) {
      this.prodPerSec = ZERO;
    } else {
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
      if (
        modStack &&
        modStack.efficiencyMod &&
        modStack.efficiencyMod.quantity.gt(0)
      ) {
        totalBonus = totalBonus.times(modStack.efficiencyMod.totalBonus);
      }
    } else if (
      modStack &&
      modStack.efficiencyMod &&
      modStack.efficiencyMod.quantity.lt(0)
    ) {
      totalBonus = totalBonus.times(modStack.efficiencyMod.totalBonusAbs);
    }
    if (modStack && modStack.prodMultiMod) {
      totalBonus = totalBonus.times(modStack.prodMultiMod.totalBonus);
    }
    if (this.product.id === "E" && modStack && modStack.energyMod) {
      totalBonus = totalBonus.times(modStack.energyMod.totalBonus);
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
      if (
        modStack &&
        modStack.efficiencyMod &&
        modStack.efficiencyMod.uiQuantity.gt(0)
      ) {
        totalBonus = totalBonus.times(modStack.efficiencyMod.totalBonusTemp);
      }
    } else if (
      modStack &&
      modStack.efficiencyMod &&
      modStack.efficiencyMod.uiQuantity.lt(0)
    ) {
      totalBonus = totalBonus.times(modStack.efficiencyMod.totalBonusTempAbs);
    }

    if (modStack && modStack.prodMultiMod) {
      totalBonus = totalBonus.times(modStack.prodMultiMod.totalBonusTemp);
    }
    if (this.product.id === "E" && modStack && modStack.energyMod) {
      totalBonus = totalBonus.times(modStack.energyMod.totalBonusTemp);
    }
    this.prodPerSecMod = this.ratio.times(totalBonus);
  }
}
