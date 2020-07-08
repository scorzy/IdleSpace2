import { Spell } from "./spell";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";

export class BuilderSpell extends Spell {
  id = "or3";
  name = "Production initiative";
  icon = "fa-s:cog";
  description = "+60% production, +3% per Factory";
  colorClass = "production-color";
  duration = 60 * 5 * 1e3;
  price = 5e3;
  constructor() {
    super();
    const game = Game.getGame();

    game.resourceManager.worker.prodEfficiency.bonuses.push(
      new Bonus(
        this,
        new Decimal(0.6),
        null,
        game.resourceManager.factory,
        new Decimal(0.03)
      )
    );
  }
}
