import { Cell } from "./cell";
import { ShipDesign } from "../shipyard/shipDesign";
import { SearchJob } from "./searchJob";
import { IShipData, FIRST_DRONE } from "../data/shipsData";
import { Game } from "../game";
import { sample } from "lodash-es";
import { ENEMY_NAVAL_CAP_LEVEL, FLEET_CAPACITY_MULTI } from "../CONSTANTS";

export class Enemy {
  constructor() {
    this.id = Enemy.lastId++;
  }
  static lastId = 0;
  id = 0;
  level = 0;
  name = "";
  icon = "setting";
  cells: Array<Cell>;
  designs: Array<ShipDesign>;
  totalNavCap = 0;

  generate(searchJob: SearchJob) {
    this.name = "aaa";
    this.designs = [];
    let sum = 0;
    const maxNavalCap = Math.min(
      ENEMY_NAVAL_CAP_LEVEL * (this.level + 1),
      FLEET_CAPACITY_MULTI
    );

    if (searchJob.level < 1) {
      this.designs.push(this.generateDesign(FIRST_DRONE));
      sum = 1;
    } else {
      // ToDo
    }

    this.designs.forEach(des => {
      des.enemyQuantity = Math.floor(
        (maxNavalCap * des.enemyPriority) / sum / des.type.navalCapacity
      );
    });

    for (let i = 0, n = this.designs.length; i < n; i++) {
      this.designs[i].id = i;
    }

    this.reloadTotalNavalCap();
  }
  generateCells() {
    this.cells = new Array<Cell>(100);
    this.cells.forEach(cell => {
      cell.ships = this.designs.map(des => des.enemyQuantity);
    });
  }
  reloadCell(index: number) {
    if (this.cells[index].done) {
      this.cells[index].percent = 0;
    } else {
      let cellNavCap = 0;
      for (let i = 0, n = this.designs.length; i < n; i++) {
        cellNavCap +=
          this.cells[index].ships[i] * this.designs[i].type.navalCapacity;
      }
      this.cells[index].percent = cellNavCap / this.totalNavCap;
    }
  }
  private generateDesign(iShipData: IShipData): ShipDesign {
    const sm = Game.getGame().shipyardManager;

    const design = new ShipDesign();
    design.name = "Pippo";
    design.type = sm.shipTypes.find(t => t.id === iShipData.typeId);
    iShipData.modules.forEach(mod => {
      const modId =
        typeof mod.moduleID === "string" ? mod.moduleID : sample(mod.moduleID);

      const module = sm.modules.find(m => m.id === modId);
      design.modules.push({
        module,
        level: this.level,
        size: mod.size
      });
    });
    design.reload();
    return design;
  }
  private reloadTotalNavalCap() {
    this.totalNavCap = 0;
    for (let i = 0, n = this.designs.length; i < n; i++) {
      this.totalNavCap +=
        this.designs[i].enemyQuantity * this.designs[i].type.navalCapacity;
    }
  }

  //#region Save and Load
  getSave(): any {
    const ret: any = {
      l: this.level,
      n: this.name,
      i: this.icon,
      d: this.designs.map(des => des.getEnemySave())
    };
    if (this.cells) ret.c = this.cells.map(c => c.getSave());
    return ret;
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
    if ("c" in data) {
      this.cells = data.c.map(cellData => {
        const cell = new Cell();
        cell.load(cellData);
        return cell;
      });
    }
    for (let i = 0, n = this.designs.length; i < n; i++) {
      this.designs[i].id = i;
    }
    this.reloadTotalNavalCap();
    for (let i = 0; i < 100; i++) {
      this.reloadCell(i);
    }
  }
  //#endregion
}
