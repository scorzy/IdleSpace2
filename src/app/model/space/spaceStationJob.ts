import { Game } from "../game";
import { SpaceStation } from "../units/spaceStation";
import { EXTRA_DISTRICTS_FROM_STATIONS } from "../CONSTANTS";
import { CivilianJob } from "./civilianJob";

export class SpaceStationJob extends CivilianJob {
  public spaceStation: SpaceStation;
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
