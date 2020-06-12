import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";
import { AutoBuilding } from "./autoBuilding";

export class AutomationManager {
  autobuyers = new Array<AbstractAutobuyer>();
  orderedAutoBuyers = new Array<AbstractAutobuyer>();
  constructor() {
    const game = Game.getGame();
    game.resourceManager.buildings.forEach((building) => {
      this.autobuyers.push(new AutoBuilding(building));
    });

    this.sort();
  }
  update() {
    const now = Date.now();
    for (let i = 0, n = this.orderedAutoBuyers.length; i < n; i++) {
      this.orderedAutoBuyers[i].execute(now);
    }
  }
  sort() {
    this.orderedAutoBuyers = this.autobuyers.sort(
      (p, n) => n.priority - p.priority
    );
  }

  //#region Save and Load
  getSave(): any {
    return { l: this.autobuyers.map((a) => a.getSave()) };
  }
  load(save: any) {
    if (!("l" in save)) return false;
    for (const data of save.l) {
      console.log(data);
      if ("i" in data) {
        const auto = this.autobuyers.find((a) => a.id === data.i);
        if (auto) {
          auto.load(data);
        }
      }
    }
    this.autobuyers.forEach((a) => a.reload());
    this.sort();
    return true;
  }
  //#endregion
}
