import { Game } from "../game";
import { LevelAck } from "./levelAck";

export class EnemyLevelAck extends LevelAck {
  getCurrentLevel(): number | Decimal {
    return Game.getGame().enemyManager.maxLevel;
  }
}
