import {
  ACK_LEVEL_STR,
  SPELL_CAST_BONUS,
  SPELL_CAST_LEVELS
} from "../CONSTANTS";
import { Game } from "../game";
import { LevelAck } from "./levelAck";

export class SpellCastAck extends LevelAck {
  constructor() {
    super({
      id: "S",
      name: "Spell Cast",
      description:
        "Cast " +
        ACK_LEVEL_STR +
        " spells. +" +
        SPELL_CAST_BONUS * 100 +
        "% computing regeneration.",
      colorClass: "",
      groupId: "o",
      icon: "my:computing",
      levels: SPELL_CAST_LEVELS
    });
  }
  getCurrentLevel(): number | Decimal {
    return Game.getGame().statsManager.spellsCast;
  }
}
