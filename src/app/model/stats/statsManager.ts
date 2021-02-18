import { SHIP_TYPES } from "../data/shipTypes";

export class ShipStat {
  constructor(public killed = 0, public built = 0) {}
}
export class StatsManager {
  shipTypesMap: Map<number, ShipStat> = new Map();
  constructor() {
    SHIP_TYPES.forEach((st) => {
      //    Ship
      const stat = new ShipStat();
      this.shipTypesMap.set(st.id, stat);

      //    Defence
      const stat2 = new ShipStat();
      this.shipTypesMap.set(st.id * -1, stat2);
    });
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
    return save;
  }
  load(data: any) {
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
