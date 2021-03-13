import {
  ACK_LEVEL_STR,
  BUILT_SHIP_BONUS,
  BUILT_SHIP_LEVELS
} from "../CONSTANTS";
import { IAchievementData } from "../data/achievementData";
import { ShipTypeData } from "../data/shipTypes";
import { Game } from "../game";
import { ShipStat } from "../stats/statsManager";
import { LevelAck } from "./levelAck";

export class BuiltShipAck extends LevelAck {
  shipStat: ShipStat;
  constructor(data: IAchievementData, public shipType: ShipTypeData) {
    super(data);
    this.shipStat = Game.getGame().statsManager.shipTypesMap.get(
      this.shipType.id
    );
  }
  getCurrentLevel(): number | Decimal {
    return this.shipStat.built;
  }
  static GetBuiltShipAck(shipType: ShipTypeData): BuiltShipAck {
    return new BuiltShipAck(
      {
        id: "B" + shipType.id,
        name: shipType.name + " built",
        description:
          "Build " +
          ACK_LEVEL_STR +
          " " +
          shipType.name +
          ". +" +
          BUILT_SHIP_BONUS * 100 +
          "% " +
          shipType.name +
          " build speed.",
        icon: "my:strafe",
        colorClass: "production-color",
        groupId: "w1",
        levels: BUILT_SHIP_LEVELS
      },
      shipType
    );
  }
}
