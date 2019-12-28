import { Job } from "../job/job";
import { ShipDesign } from "./shipDesign";
import { ZERO } from "../CONSTANTS";
import { Game } from "../game";

export class UpdateShipJob extends Job {
  diff = ZERO;
  toUpdate = 0;
  updated = 0;

  constructor(public design: ShipDesign, public fleetNum = 0) {
    super();
    this.diff = this.design.price.minus(this.design.old.price);
    this.reload();
  }
  addProgress(pro: DecimalSource): Decimal {
    this.reload();
    const ret = super.addProgress(pro);
    const done =
      this.progress
        .div(this.diff)
        .floor()
        .toNumber() - this.updated;
    if (done >= 1) {
      let toUpp = done;
      for (let i = 0, n = this.design.fleets.length; i < n; i++) {
        if (this.design.old.fleets[i].shipsQuantity > 0 && toUpp > 0) {
          const shipUp = Math.min(
            this.design.old.fleets[i].shipsQuantity,
            toUpp
          );
          this.design.fleets[i].shipsQuantity += shipUp;
          this.design.old.fleets[i].shipsQuantity -= toUpp;
          this.design.old.fleets[i].shipsQuantity = Math.max(
            this.design.old.fleets[i].shipsQuantity,
            0
          );
          toUpp -= shipUp;
        }
      }
      this.updated += done;

      let completed = true;
      for (let i = 0, n = this.design.fleets.length; i < n; i++) {
        if (this.design.old.fleets[i].shipsQuantity > 0) {
          completed = false;
          break;
        }
      }
      if (completed) {
        this.design.old = null;
      }
    }

    return ret;
  }
  onCompleted() {
    for (let i = 0, n = this.design.fleets.length; i < n; i++) {
      this.design.fleets[i].shipsQuantity += this.design.old.fleets[
        i
      ].shipsQuantity;
    }
    this.design.old = null;
  }
  reload() {
    this.toUpdate = 0;
    if (this.design.old) {
      for (let i = 0, n = this.design.fleets.length; i < n; i++) {
        this.toUpdate += this.design.old.fleets[i].shipsQuantity;
      }
    }
    this.total = this.diff.times(this.toUpdate + this.updated);
  }

  //#region Save and Load
  getSave() {
    return {
      t: "b",
      d: this.design.id,
      p: this.progress
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
  }
  //#endregion
}
