import { Game } from "../game";
import { Achievement } from "./achievement";
import { IGroupParent } from "./iGroupParent";

export class AchievementGroup implements IGroupParent {
  list: Array<Achievement> = [];
  total = 0;
  current = 0;
  constructor(public id: string, public name: string) {}
  reloadNumber(): void {
    this.current = this.list.reduce((a, b) => a + b.quantity.toNumber(), 0);
    if (this.current > 0) {
      Game.getGame().achievementManager.showTab = true;
      Game.getGame().achievementManager.reloadTotal();
    }
  }
}
