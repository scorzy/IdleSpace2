import { ResourceManager } from "./units/resourceManager";

/**
 * Game is the main class that orchestrate everything game related
 */
export class Game {
  /**
   * Instance  of game
   */
  private static instance: Game;

  resouceManager: ResourceManager;

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
  }
}
