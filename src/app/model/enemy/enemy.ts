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

  generate(searchJob: SearchJob) {
    this.name = "aaa";
    this.designs = [];
    let sum = 0;
    const maxNavalCap = Math.min(
      ENEMY_NAVAL_CAP_LEVEL * this.level,
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
  }

  private generateDesign(iShipData: IShipData): ShipDesign {
    const sm = Game.getGame().shipyardManager;

    const design = new ShipDesign();
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
