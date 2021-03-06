import { Spell } from "../computing/spell";
import { ONE, ZERO } from "../CONSTANTS";
import { SHIP_TYPES } from "../data/shipTypes";

export class ShipStat {
  constructor(public name: string, public killed = 0, public built = 0) {}
}
export class StatsManager {
  longestWarp = ZERO;
  totalWarp = ZERO;
  spellsCast = ZERO;
  shipTypesMap: Map<number, ShipStat> = new Map();
  constructor() {
    SHIP_TYPES.forEach((st) => {
      //    Ship
      this.shipTypesMap.set(st.id, new ShipStat(st.name));

      //    Defence
      this.shipTypesMap.set(st.id * -1, new ShipStat(st.defenceName));
    });
  }
  onWarp(warp: number | Decimal) {
    this.longestWarp = Decimal.max(this.longestWarp, warp);
    this.totalWarp = this.totalWarp.plus(warp);
  }
  onSpellCast(spell: Spell) {
    this.spellsCast = this.spellsCast.plus(ONE);
  }
  //#region Save and load
  getSave(): any {
    const save: any = {};
    const ships: { i: number; k?: number; b?: number }[] = [];
    this.shipTypesMap.forEach((s, id) => {
      if (s.built > 0 || s.killed > 0) {
        const record: any = { i: id };
        if (s.built > 0) record.b = s.built;
        if (s.killed > 0) record.k = s.killed;
        ships.push(record);
      }
    });
    if (ships.length > 0) save.s = ships;

    if (this.longestWarp.gt(0)) save.l = this.longestWarp;
    if (this.spellsCast.gt(0)) save.c = this.spellsCast;
    return save;
  }
  load(data: any) {
    if ("l" in data) this.longestWarp = new Decimal(data.l);
    if ("c" in data) this.spellsCast = new Decimal(data.c);
    if ("s" in data) {
      for (const shipData of data.s) {
        if ("i" in shipData && typeof shipData.i === "number") {
          const record = this.shipTypesMap.get(shipData.i);
          if (record) {
            if ("k" in shipData && typeof shipData.k === "number") {
              record.killed = shipData.k;
            }
            if ("b" in shipData && typeof shipData.b === "number") {
              record.built = shipData.b;
            }
          }
        }
      }
    }
  }
  //#endregion
}
