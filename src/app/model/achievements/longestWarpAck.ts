import {
  ACK_LEVEL_STR,
  LONGEST_WARP_BONUS,
  LONGEST_WARP_LEVELS
} from "../CONSTANTS";
import { Game } from "../game";
import { LevelTimeAck } from "./levelTimeAck";

export class LongestWarpAck extends LevelTimeAck {
  constructor() {
    super({
      id: "lw",
      name: "Longest Warp",
      description:
        "Warp " +
        ACK_LEVEL_STR +
        " at once. +" +
        LONGEST_WARP_BONUS * 100 +
        "% dark matter gains.",
      colorClass: "science-color",
      groupId: "o",
      icon: "field-time",
      levels: LONGEST_WARP_LEVELS
    });
  }
  getCurrentLevel(): number | Decimal {
    return Game.getGame().statsManager.longestWarp;
  }
}
