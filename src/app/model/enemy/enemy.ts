import { Cell } from "./cell";
import { ShipDesign } from "../shipyard/shipDesign";

export class Enemy {
  level = 0;
  name = "";
  icon = "";
  cells: Array<Cell>;
  designs: Array<ShipDesign>;

  constructor() {}

  //#region Save and Load
  getSave(): any {
    return {
      l: this.level,
      n: this.name,
      i: this.icon,
      d: this.designs.map(des => des.getEnemySave())
    };
  }
  load(data: any) {
    if ("l" in data) this.level = data.l;
    if ("n" in data) this.name = data.n;
    if ("i" in data) this.icon = data.i;
    if ("d" in data) {
      this.designs = data.d.map(designData => {
        const design = new ShipDesign();
        design.loadEnemy(designData);
        return design;
      });
    }
  }
  //#endregion
}
