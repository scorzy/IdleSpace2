import { IAchievementData } from "../data/achievementData";
import { IBase } from "../iBase";
import { LevelAck } from "./levelAck";

export class UnitQuantityAck extends LevelAck {
  getCurrentLevel(): number | Decimal {
    return this.unit.quantity;
  }
  unit: IBase;

  constructor(data: IAchievementData) {
    super(data);
  }
}
