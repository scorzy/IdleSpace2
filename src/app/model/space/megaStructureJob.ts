import { Game } from "../game";
import { MEGA_BUILD_SPEED_CARD } from "../CONSTANTS";
import { CivilianJob } from "./civilianJob";

export class MegaStructureJob extends CivilianJob {
  get totalBonus(): Decimal {
    return Game.getGame().prestigeManager.megaBuildSpeed.active
      ? this.type.bonus.totalBonus.times(MEGA_BUILD_SPEED_CARD)
      : this.type.bonus.totalBonus;
  }
  set totalBonus(bon: Decimal) {}

  onCompleted() {
    super.onCompleted();
    const sm = Game.getGame().spaceStationManager;
    sm.megaBuilt = sm.megaBuilt.plus(1);
  }
}
