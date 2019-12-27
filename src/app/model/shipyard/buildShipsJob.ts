import { Job } from "../job/job";
import { ShipDesign } from "./shipDesign";
import { Game } from "../game";

export class BuildShipsJob extends Job {
  built = 0;

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
  }

  addProgress(pro: DecimalSource): Decimal {
    const ret = super.addProgress(pro);
    const totalShip =
      this.level > 0
        ? this.quantity
        : this.progress
            .times(this.quantity)
            .div(this.total)
            .floor()
            .toNumber();
    if (totalShip > this.built) {
      this.design.fleets[this.fleetNum].shipsQuantity += totalShip - this.built;

      this.built = totalShip;
    }
    return ret;
  }

  //#region Save and Load
  getSave(): any {
    return {
      t: "b",
      d: this.design.id,
      p: this.progress,
      b: this.built,
      n: this.fleetNum,
      q: this.quantity
    };
  }
  load(data: any) {
    if ("d" in data) {
      this.design = Game.getGame().shipyardManager.shipDesigns.find(
        des => des.id === data.d
      );
    }
    if (!this.design) return false;
    if ("n" in data) this.fleetNum = data.n;
    if ("p" in data) this.progress = new Decimal(data.p);
    if ("b" in data) this.built = data.b;
    this.total = this.design.price.times(this.quantity);
  }
  //#endregion
}
