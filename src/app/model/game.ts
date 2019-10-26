import { ResourceManager } from "./units/resourceManager";
import { ResearchManager } from "./researches/researchManager";

/**
 * Game is the main class that orchestrate everything game related
 */
export class Game {
  /**
   * Instance  of game
   */
  private static instance: Game;

  resouceManager: ResourceManager;
  researchManager: ResearchManager;

  /**
   * Gets game return instance of game
   * this is not a relal singleton, may return null
   * @returns game
   */
  static getGame(): Game {
    return Game.instance;
  }

  constructor() {
    Game.instance = this;
    this.resouceManager = new ResourceManager();
    this.researchManager = new ResearchManager();
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
      this.resouceManager.reloadProduction();
      const maxUp = Math.min(toUpdate, this.resouceManager.maxTime);
      if (maxUp > 0) {
        this.resouceManager.update(maxUp);
        toUpdate = toUpdate - maxUp;
      }
      if (toUpdate > 0) {
        this.resouceManager.stopResources();
      }
    }
  }

  postUpdate() {
    const resNotAdded = this.researchManager.addProgress(
      this.resouceManager.science.quantity
    );
    this.resouceManager.science.quantity = resNotAdded;

    this.resouceManager.reloadProduction();
    this.resouceManager.postUpdate();
  }
}
