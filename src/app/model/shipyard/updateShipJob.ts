import { Job } from "../job/job";
import { ShipDesign } from "./shipDesign";

export class UpdateShipJob extends Job {
  constructor(
    public quantity: number,
    public design: ShipDesign,
    public fleetNum = 0
  ) {
    super();
    this.total = this.design.price.times(this.quantity);
  }

  getSave() {
    throw new Error("Method not implemented.");
  }
}
