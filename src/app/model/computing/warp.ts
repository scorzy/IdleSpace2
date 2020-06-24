import { Spell } from "./spell";
import { Game } from "../game";

export class WarpSpell extends Spell {
  id = "1";
  name = "Warp";
  icon = "field-time";
  description = "Warp 30 seconds";
  colorClass = "science-color";
  duration = 0;
  price = 3000;
  onActivate() {
    Game.getGame().timeToWarp += 30;
  }
}
