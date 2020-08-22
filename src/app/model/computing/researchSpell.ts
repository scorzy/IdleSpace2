import { Spell } from "./spell";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";

export class ResearchSpell extends Spell {
  id = "or1";
  name = "Research initiative";
  icon = "fa-s:flask";
  description = "+30% research, +1.5% per Research Lab";
  colorClass = "science-color";
  duration = 60 * 5 * 1e3;
  price = 5e3;
  constructor() {
    super();
    const game = Game.getGame();

    game.resourceManager.scientist.prodEfficiency.bonuses.push(
      new Bonus(
        this,
        new Decimal(0.4),
        null,
        game.resourceManager.laboratory,
        new Decimal(0.015)
      )
    );
  }
}
