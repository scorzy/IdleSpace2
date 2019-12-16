import { Job } from "../job/job";
import { ZERO } from "../CONSTANTS";
import { ShipDesign } from "./shipDesign";
import { Game } from "../game";

export class BuildShipsJob extends Job {
  built = ZERO;

  constructor(public quantity: Decimal, public design: ShipDesign) {
    super();
    this.total = this.design.price.times(this.quantity);
  }

  addProgress(pro: DecimalSource): Decimal {
    const ret = super.addProgress(pro);
    const totalShip =
      this.level > 0
        ? this.quantity
        : this.quantity
            .times(this.total)
            .div(this.progress)
            .floor();
    if (totalShip.gt(this.built)) {
      this.design.shipsQuantity = this.design.shipsQuantity.plus(
        totalShip.minus(this.built)
      );
      this.built = totalShip;
    }
    return ret;
  }

  //#region Save and Load
  getSave(): any {
    return {
      d: this.design.id,
      p: this.progress,
      b: this.built
    };
  }
  load(data: any) {
    if ("d" in data) {
      this.design = Game.getGame().shipyardManager.shipDesigns.find(
        des => des.id === data.d
      );
    }
    if (!this.design) return false;
    if ("p" in data) this.progress = new Decimal(data.p);
    if ("b" in data) this.built = new Decimal(data.b);
    this.total = this.design.price.times(this.quantity);
  }
  //#endregion
}
