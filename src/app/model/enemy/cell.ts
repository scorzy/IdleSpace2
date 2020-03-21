import { ZERO } from "../CONSTANTS";
import { Unit } from "../units/unit";
import { Game } from "../game";

export const TO_DO_COLOR = [245, 79, 71];
export const DONE_COLOR = [96, 181, 21];

export class Cell {
  index = 0;
  metal = ZERO;
  alloy = ZERO;
  components = ZERO;

  search = ZERO;
  science = ZERO;

  special: Unit;
  specialQuantity = ZERO;

  percent = 100;
  done = false;
  inBattle = false;
  color = "rgb(245, 79, 71)";

  ships: Array<number>;

  //#region Save and Load
  getSave(): any {
    const ret: any = {};
    if (this.metal.gt(0)) ret.m = this.metal;
    if (this.alloy.gt(0)) ret.a = this.alloy;
    if (this.components.gt(0)) ret.c = this.components;
    if (this.search.gt(0)) ret.s = this.search;
    if (this.science.gt(0)) ret.e = this.science;
    if (this.special) ret.i = this.special.id;
    if (this.specialQuantity.gt(0)) ret.p = this.specialQuantity;

    if (this.ships) ret.s = this.ships;
    if (this.done) ret.d = this.done;
    return ret;
  }
  load(data: any) {
    if ("m" in data) this.metal = new Decimal(data.m);
    if ("a" in data) this.alloy = new Decimal(data.a);
    if ("c" in data) this.components = new Decimal(data.c);
    if ("s" in data) this.search = new Decimal(data.s);
    if ("e" in data) this.science = new Decimal(data.e);
    if ("i" in data) {
      this.special = Game.getGame().resourceManager.districts.find(
        u => u.id === data.i
      );
    }
    if ("p" in data) this.specialQuantity = new Decimal(data.p);

    if ("s" in data) this.ships = data.s;
    if ("d" in data) this.done = data.d;
  }
  //#endregion
}
