
import { ONE, ZERO } from "../CONSTANTS";
import { Game } from "../game";
import { IBase } from "../iBase";

export class InfraBonusUnit implements IBase {
  quantity = ONE;
  id = "infraBon";
  name = "Infrastructure";
  description?: string;
  icon?: string;
  colorClass?: string;

  reloadQuantity() {
    this.quantity = ZERO;
    const infrastructures = Game.getGame().resourceManager
      .unlockedInfrastructures;
    for (let i = 0, n = infrastructures.length; i < n; i++) {
      this.quantity = this.quantity.plus(infrastructures[i].totalBonus);
    }
  }
}
