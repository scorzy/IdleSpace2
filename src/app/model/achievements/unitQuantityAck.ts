import { IAchievementData } from "../data/achievementData";
import { IBase } from "../iBase";
import { LevelAck } from "./levelAck";

export class UnitQuantityAck extends LevelAck {
  unit: IBase;
  checkQuantity() {
    let ret = 0;
    this.levels.forEach((level) => {
      if (this.unit.quantity.gte(level)) ret++;
    });
    return ret;
  }
  constructor(data: IAchievementData) {
    super(data);
  }
}
