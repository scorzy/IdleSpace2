import { Spell } from "./spell";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import { ONE } from "../CONSTANTS";

export class ResearchSpell extends Spell {
  id = "2";
  name = "Research";
  icon = "fa-s:flask";
  description = "+30% research";
  colorClass = "science-color";
  duration = 60 * 5 * 1e3;
  price = 5e3;
  constructor() {
    super();
    const game = Game.getGame();

    game.resourceManager.scientist.prodEfficiency.bonuses.push(
      new Bonus(this, new Decimal(0.3))
    );
  }
}
