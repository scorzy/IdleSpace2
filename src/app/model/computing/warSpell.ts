import { Spell } from "./spell";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";

export class WarSpell extends Spell {
  id = "or2";
  name = "War initiative";
  icon = "my:medal";
  colorClass = "explosion-color";
  duration = 60 * 5 * 1e3;
  price = 5e3;
  constructor() {
    super();
    this.description = "+60% ship velocity, +30% districts from battle";
    const game = Game.getGame();

    game.shipyardManager.velocityBonusStack.bonuses.push(
      new Bonus(this, new Decimal(0.6))
    );
    game.enemyManager.districtMultiplier.bonuses.push(
      new Bonus(this, new Decimal(0.3))
    );
  }
}
