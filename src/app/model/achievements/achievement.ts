import { ONE } from "../CONSTANTS";
import { IAchievementData } from "../data/achievementData";
import { IBase } from "../iBase";

export class Achievement implements IBase {
  quantity: Decimal = ONE;
  id: string;
  name: string;
  description?: string;
  icon?: string;
  colorClass?: string;
  done = false;

  constructor(data: IAchievementData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon;
    this.colorClass = data.colorClass;
  }
  complete(): boolean {
    if (this.done) return false;

    this.done = true;
    return this.done;
  }
}
