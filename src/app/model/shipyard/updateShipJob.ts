import { Job } from "../job/job";
import { ShipDesign } from "./shipDesign";
import { ZERO } from "../CONSTANTS";
import { Game } from "../game";

export class UpdateShipJob extends Job {
  diff = ZERO;
  toUpdate = 0;
  updated = 0;

  public get name() {
    return this.design.name;
  }
  public set name(_name: string) {}
  public get description() {
    return "Updated: " + this.updated + "/" + (this.toUpdate + this.updated);
  }
  public set description(_description: string) {}

  constructor(public design: ShipDesign) {
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
    const perSec = Game.getGame().resourceManager.shipyardWork.perSec;
    this.timeToEnd = perSec.lte(0)
      ? Number.POSITIVE_INFINITY
      : this.total
          .minus(this.progress)
          .div(perSec)
          .floor()
          .toNumber();
  }

  //#region Save and Load
  getSave() {
    return {
      t: "u",
      d: this.design.id,
      p: this.progress,
      u: this.updated
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
    if ("u" in data) this.updated = data.u;
    this.reload();
  }
  //#endregion
}
