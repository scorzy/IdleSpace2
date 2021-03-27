import {
  ACK_LEVEL_STR,
  CON_SPELL_CAST_BONUS,
  CON_SPELL_CAST_LEVELS
} from "../CONSTANTS";
import { Game } from "../game";
import { LevelAck } from "./levelAck";

export class ConcurrentSpellsAck extends LevelAck {
  constructor() {
    super({
      id: "C",
      name: "Concurrent Spell Cast",
      description:
        "Have " +
        ACK_LEVEL_STR +
        " spells running at the same time. +" +
        CON_SPELL_CAST_BONUS * 100 +
        "% computing regeneration.",
      colorClass: "",
      groupId: "o",
      icon: "my:computing",
      levels: CON_SPELL_CAST_LEVELS
    });
  }
  getCurrentLevel(): number | Decimal {
    return Game.getGame().computingManager.activeSpells;
  }
}
