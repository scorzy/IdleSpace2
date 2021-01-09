import { MainService } from "src/app/main.service";
import { IAchievementData } from "../data/achievementData";
import { Game } from "../game";
import { Achievement } from "./achievement";

export class MaxEnemyLevelAck extends Achievement {
  enemyLevels: number[];
  constructor(data: IAchievementData) {
    super(data);
    if ("enemyLevels" in data) this.enemyLevels = data.enemyLevels;
  }
  checkQuantity() {
    let ret = 0;
    const currentLevel = Game.getGame().enemyManager.maxLevel;
    this.enemyLevels.forEach((level) => {
      if (level < currentLevel) ret++;
    });
    return ret;
  }
  updateDescription() {
    let next = this.enemyLevels[
      Math.min(this.enemyLevels.length - 1, this.quantity.toNumber())
    ];
    this.description = this._description.replace(
      "#enemyLevel@",
      MainService.formatPipe.transform(next, true)
    );
  }
}
