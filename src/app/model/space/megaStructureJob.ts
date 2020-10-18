import { Game } from "../game";
import { CivilianJob } from "./civilianJob";
import { MegaStructure } from "../units/megaStructure";
import { BonusStack } from "../bonus/bonusStack";

export class MegaStructureJob extends CivilianJob {
  constructor(mega: MegaStructure) {
    super(mega);
    this.bonuses = this.bonuses || new BonusStack();

    const common = Game.getGame().spaceStationManager.megaBonuses;
    common.forEach((bon) => {
      this.bonuses.bonuses.push(bon);
    });
  }

  onCompleted() {
    super.onCompleted();
    const sm = Game.getGame().spaceStationManager;
    sm.megaBuilt = sm.megaBuilt.plus(1);
  }
}
