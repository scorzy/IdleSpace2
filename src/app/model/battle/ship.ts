import { ShipData } from "./shipData";

export class Ship {
  armour: number;
  shield: number;
  threat: number;
  accumulatedThreat = 0;

  constructor(public shipData: ShipData) {
    this.armour = shipData.totalArmour;
    this.shield = shipData.totalShield;
    this.threat = shipData.threat;
  }
}
