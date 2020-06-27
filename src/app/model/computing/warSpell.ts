import { Spell } from "./spell";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import { ONE } from "../CONSTANTS";

export class WarSpell extends Spell {
  id = "or2";
  name = "War initiative";
  icon = "my:medal";
  description = "+30% ship velocity, +30% districts from battle";
  colorClass = "explosion-color";
  duration = 60 * 5 * 1e3;
  price = 3e4;
  constructor() {
    super();
    const game = Game.getGame();

    game.shipyardManager.velocityBonusStack.bonuses.push(
      new Bonus(this, new Decimal(0.3))
    );
    game.enemyManager.districtMultiplier.bonuses.push(
      new Bonus(this, new Decimal(0.3))
    );
  }
}
