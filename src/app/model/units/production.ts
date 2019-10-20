import { Unit } from "./unit";
import { ONE, ZERO } from "../CONSTANTS";

export class Production {
  prodPerSec = ZERO;
  ratio: Decimal;

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
      let totalBonus = this.producer.prodAllBonus.totalBonus.times(
        this.product.prodBy.totalBonus
      );
      if (this.ratio.gt(0)) {
        totalBonus = totalBonus.times(this.producer.prodEfficiety.totalBonus);
      }
      this.prodPerSec = this.ratio
        .times(this.producer.operativity / 100)
        .times(totalBonus);
    }
  }
}
