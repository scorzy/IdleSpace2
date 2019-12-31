import { ShipData } from "./shipData";

export class Ship {
  armour: number;
  shield: number;

  constructor(public shipData: ShipData) {
    this.armour = shipData.totalArmour;
    this.shield = shipData.totalShield;
  }
}
