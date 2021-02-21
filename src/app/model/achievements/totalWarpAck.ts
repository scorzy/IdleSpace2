import {
  ACK_LEVEL_STR,
  LONGEST_WARP_BONUS,
  LONGEST_WARP_LEVELS,
  TOTAL_WARP_BONUS,
  TOTAL_WARP_LEVELS
} from "../CONSTANTS";
import { Game } from "../game";
import { LevelTimeAck } from "./levelTimeAck";

export class TotalWarpAck extends LevelTimeAck {
  constructor() {
    super({
      id: "tw",
      name: "Cumulative Warp",
      description:
        "Warp " +
        ACK_LEVEL_STR +
        ". +" +
        TOTAL_WARP_BONUS * 100 +
        "% dark matter gains.",
      colorClass: "science-color",
      groupId: "o",
      icon: "field-time",
      levels: TOTAL_WARP_LEVELS
    });
  }
  getCurrentLevel(): number | Decimal {
    return Game.getGame().statsManager.totalWarp;
  }
}
