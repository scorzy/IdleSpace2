import { Job } from "../job/job";
import { ShipDesign } from "./shipDesign";
import { Game } from "../game";
import { ZERO } from "../CONSTANTS";

export class BuildShipsJob extends Job {
  built = 0;
  workDone = ZERO;

  public get name() {
    return this.design.name;
  }
  public set name(_name: string) {}
  public get description() {
    return (
      "Fleet " + this.fleetNum + " Ships: " + this.built + " / " + this.quantity
    );
  }
  public set description(_description: string) {}

  constructor(
    public quantity: number,
    public design: ShipDesign,
    public fleetNum = 0
  ) {
    super();
    this.total = this.design.price.times(this.quantity);
    this.canDelete = true;
  }

  addProgress(pro: DecimalSource): Decimal {
    this.reload();

    const ret = super.addProgress(pro);
    const toBuild =
      this.level > 0
        ? Math.floor(this.quantity - this.built)
        : this.progress
            .minus(this.workDone)
            .div(this.design.price)
            .floor()
            .toNumber();
    if (toBuild > 0) {
      this.design.fleets[this.fleetNum].shipsQuantity += toBuild;
      this.built += toBuild;
      this.workDone = this.workDone.plus(this.design.price.times(toBuild));
    }
    return ret;
  }
  reload() {
    this.quantity = Math.min(
      this.quantity,
      this.design.fleets[this.fleetNum].wantedShips -
        (this.design.old
          ? this.design.old.fleets[this.fleetNum].shipsQuantity
          : 0)
    );
    this.total = this.design.price
      .times(this.quantity - this.built)
      .plus(this.workDone);

    this.timeToEnd = this.getRemaining()
      .div(Game.getGame().shipWorkPerSec)
      .floor()
      .toNumber();
  }
  delete() {
    const shipyardManager = Game.getGame().shipyardManager;
    shipyardManager.toDo.splice(
      shipyardManager.toDo.findIndex(job => job === this),
      1
    );
  }

  //#region Save and Load
  getSave(): any {
    return {
      t: "b",
      d: this.design.id,
      p: this.progress,
      b: this.built,
      n: this.fleetNum,
      q: this.quantity,
      w: this.workDone
    };
  }
  load(data: any) {
    if ("d" in data) {
      this.design = Game.getGame().shipyardManager.shipDesigns.find(
        des => des.id === data.d
      );
    }
    if (!this.design) { return false; }
    if ("n" in data) { this.fleetNum = data.n; }
    if ("p" in data) { this.progress = new Decimal(data.p); }
    if ("b" in data) { this.built = data.b; }
    if ("w" in data) { this.workDone = new Decimal(data.w); }
    this.total = this.design.price.times(this.quantity);
  }
  //#endregion
}
