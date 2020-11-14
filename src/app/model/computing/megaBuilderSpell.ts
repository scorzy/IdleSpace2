import { Spell } from "./spell";

import { Game } from "../game";

import { Bonus } from "../bonus/bonus";
import { ONE } from "../CONSTANTS";
import { IBase } from "../iBase";

export class MegaBuilderSpell extends Spell {
  id = "spe1";
  name = "Production initiative";
  icon = "my:defense-satellite";
  colorClass = "production-color";
  duration = 60 * 5 * 1e3;
  price = 5e4;
  constructor() {
    super();
    this.description = "All drones yeilds (20 + 100*megastructure)% more";
    const game = Game.getGame();
    const megaUnit: IBase = {
      id: "megaU",
      name: "megastructures",
      get quantity() {
        return Game.getGame().spaceStationManager.megaBuilt;
      }
    };

    game.resourceManager.worker.prodEfficiency.bonuses.push(
      new Bonus(this, new Decimal(0.2), null, megaUnit, ONE)
    );
  }
}
