import { Game } from "../game";
import { LevelAck } from "./levelAck";

export class EnemyLevelAck extends LevelAck {
  checkQuantity() {
    let ret = 0;
    const currentLevel = Game.getGame().enemyManager.maxLevel;
    this.levels.forEach((level) => {
      if (level < currentLevel) ret++;
    });
    return ret;
  }
}
