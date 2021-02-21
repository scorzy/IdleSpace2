import { ACK_LEVEL_STR, KILL_SHIP_BONUS, KILL_SHIP_LEVELS } from "../CONSTANTS";
import { IAchievementData } from "../data/achievementData";
import { ShipTypeData } from "../data/shipTypes";
import { Game } from "../game";
import { ShipStat } from "../stats/statsManager";
import { LevelAck } from "./levelAck";

export class KillShipAck extends LevelAck {
  shipStat: ShipStat;
  constructor(
    data: IAchievementData,
    public shipType: ShipTypeData,
    public isDefence: boolean
  ) {
    super(data);
    this.shipStat = Game.getGame().statsManager.shipTypesMap.get(
      this.shipType.id * (isDefence ? -1 : 1)
    );
  }
  getCurrentLevel(): number | Decimal {
    return this.shipStat.killed;
  }
  static GetKillShipAck(
    shipType: ShipTypeData,
    isDefence: boolean
  ): KillShipAck {
    const shipName = isDefence ? shipType.defenceName : shipType.name;
    return new KillShipAck(
      {
        id: "K" + shipType.id,
        name: shipName + " destroyed",
        description:
          "Destroy " +
          ACK_LEVEL_STR +
          " " +
          shipName +
          ". +" +
          KILL_SHIP_BONUS * 100 +
          "% " +
          shipType.name +
          " build speed.",
        icon: isDefence ? "my:defense-satellite" : "my:strafe",
        colorClass: "",
        groupId: "wa",
        levels: KILL_SHIP_LEVELS
      },
      shipType,
      isDefence
    );
  }
}
