import { ZERO } from "../CONSTANTS";

export class Cell {
  metal = ZERO;
  alloy = ZERO;
  percent = 100;
  done = false;
  inBattle = false;

  ships: Array<number>;

  //#region Save and Load
  getSave(): any {
    const ret: any = {
      a: this.alloy,
      m: this.metal
    };
    if (this.ships) ret.s = this.ships;
    if (this.done) ret.d = this.done;
    return ret;
  }
  load(data: any) {
    if ("m" in data) this.metal = new Decimal(data.m);
    if ("a" in data) this.alloy = new Decimal(data.a);
    if ("s" in data) this.ships = data.s;
    if ("d" in data) this.done = data.d;
  }
  //#endregion
}
