import { IAchievementData } from "../data/achievementData";
import { Game } from "../game";
import { ShipType } from "../shipyard/ShipType";
import { ShipStat } from "../stats/statsManager";
import { LevelAck } from "./levelAck";

export class KillShipAck extends LevelAck {
  shipStat: ShipStat;
  constructor(
    data: IAchievementData,
    public shipType: ShipType,
    public isDefence: boolean
  ) {
    super(data);
    this.shipStat = Game.getGame().statsManager.shipTypesMap.get(
      this.shipType.id * (isDefence ? -1 : 1)
    );
  }
  checkQuantity(): number | Decimal {
    return this.shipStat.killed;
  }
}
