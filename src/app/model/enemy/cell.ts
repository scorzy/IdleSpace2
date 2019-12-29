import { ZERO } from "../CONSTANTS";
import { ShipDesign } from "../shipyard/shipDesign";

export class Cell {
  metal = ZERO;
  alloy = ZERO;

  ships: Array<number>;

  //#region Save and Load
  getSave(): any {
    return {
      a: this.alloy,
      m: this.metal,
      s: this.ships
    };
  }
  load(data: any) {
    if ("m" in data) this.metal = new Decimal(data.m);
    if ("a" in data) this.alloy = new Decimal(data.a);
    if ("s" in data) this.ships = data.s;
  }
  //#endregion
}
