import { ShipData } from "./shipData";

export class Ship {
  armour: number;
  shield: number;

  private active: boolean;
  private static Ships = new Array<Ship>();

  constructor(public shipData: ShipData) {}

  getCopy(): Ship {
    const ret = Ship.Ships.pop() || new Ship(this.shipData);
    ret.active = true;
    ret.shipData = this.shipData;
    ret.armour = this.armour;
    ret.shield = this.shield;

    return ret;
  }
  free(): void {
    // Reuse object to prevent gc
    if (this.active === true) {
      this.active = false;
      Ship.Ships.push(this);
    }
  }
}
