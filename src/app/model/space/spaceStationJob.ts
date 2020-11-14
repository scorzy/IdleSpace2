import { Game } from "../game";
import { SpaceStation } from "../units/spaceStation";
import { EXTRA_DISTRICTS_FROM_STATIONS } from "../CONSTANTS";
import { CivilianJob } from "./civilianJob";
import { BonusStack } from "../bonus/bonusStack";

export class SpaceStationJob extends CivilianJob {
  constructor(public spaceStation: SpaceStation) {
    super(spaceStation);
    this.bonuses = this.bonuses || new BonusStack();

    const common = Game.getGame().spaceStationManager.stationsBonuses;
    common.forEach((bon) => {
      this.bonuses.bonuses.push(bon);
    });
  }
  onCompleted() {
    super.onCompleted();
    const game = Game.getGame();

    const habSpace = game.resourceManager.habitableSpace;
    habSpace.quantity = habSpace.quantity.plus(this.spaceStation.habSpace);
    if (game.prestigeManager.extraMiningDistricts.active) {
      game.resourceManager.miningDistrict.quantity = game.resourceManager.miningDistrict.quantity.plus(
        this.spaceStation.habSpace.times(EXTRA_DISTRICTS_FROM_STATIONS)
      );
    }
    if (game.prestigeManager.extraEnergyDistricts.active) {
      game.resourceManager.energyDistrict.quantity = game.resourceManager.energyDistrict.quantity.plus(
        this.spaceStation.habSpace.times(EXTRA_DISTRICTS_FROM_STATIONS)
      );
    }
  }
}
