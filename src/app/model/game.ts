import { ResourceManager } from "./units/resourceManager";
import { ResearchManager } from "./researches/researchManager";
import { ShipyardManager } from "./shipyard/shipyardManager";

/**
 * Game is the main class that orchestrate everything game related
 */
export class Game {
  /**
   * Instance  of game
   */
  private static instance: Game;

  resourceManager: ResourceManager;
  researchManager: ResearchManager;
  shipyardManager: ShipyardManager;

  navalCapacity: number;
  updateNavalCapacity = true;

  /**
   * Gets game return instance of game
   * this is not a real singleton, may return null
   * @returns game
   */
  static getGame(): Game {
    return Game.instance;
  }

  constructor() {
    Game.instance = this;
    this.resourceManager = new ResourceManager();
    this.researchManager = new ResearchManager();
    this.shipyardManager = new ShipyardManager();
    this.shipyardManager.init();
    this.researchManager.makeShipsResearches();
    this.researchManager.setRelations();
  }

  /**
   * Update function.
   * Works only with resource growing at max rate of x^2
   * When something reach zero consumers are stopped and it will update again
   * @param delta in seconds
   */
  update(delta: number) {
    let toUpdate = delta;

    while (toUpdate > 0) {
      this.resourceManager.reloadProduction();
      const maxUp = Math.min(toUpdate, this.resourceManager.maxTime);
      if (maxUp > 0) {
        this.resourceManager.update(maxUp);
        toUpdate = toUpdate - maxUp;
      }
      if (toUpdate > 0) {
        this.resourceManager.stopResources();
      }
    }
  }
  postUpdate() {
    this.researchManager.technologies.forEach(t => t.bonus.reloadBonus());
    const resNotAdded = this.researchManager.addProgress(
      this.resourceManager.science.quantity
    );
    this.resourceManager.science.quantity = resNotAdded;
    this.resourceManager.reloadProduction();
    this.resourceManager.postUpdate();
    this.researchManager.toDo.forEach(r => r.reloadTotalBonus());
    this.researchManager.backlog.forEach(r => r.reloadTotalBonus());
    if (this.updateNavalCapacity) {
      this.reloadNavalCapacity();
    }
    this.shipyardManager.postUpdate();
  }
  reloadNavalCapacity() {
    this.navalCapacity = 0;
    for (let i = 0, n = this.researchManager.done.length; i < n; i++) {
      this.navalCapacity += this.researchManager.done[i].navalCapacity;
    }
    this.navalCapacity += this.researchManager.navalCapTech.quantity.toNumber();
    this.navalCapacity = Math.floor(this.navalCapacity);
  }

  //#region Save and Load
  getSave(): any {
    return {
      s: this.resourceManager.getSave(),
      r: this.researchManager.getSave(),
      d: this.shipyardManager.getSave()
    };
  }
  load(data: any) {
    if (!("s" in data && "r" in data)) {
      throw new Error("Save not valid");
    }

    this.resourceManager.load(data.s);
    this.researchManager.load(data.r);
    if ("d" in data) {
      this.shipyardManager.load(data.d);
    }
  }
  //#endregion
}
