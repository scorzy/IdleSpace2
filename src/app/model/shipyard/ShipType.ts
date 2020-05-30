import { ShipTypeData } from "../data/shipTypes";

export class ShipType implements ShipTypeData {
  id: number;
  name: string;
  defenceName: string;
  maxModule: number;
  maxPoints: number;
  navalCapacity: number;
  unlocked = false;

  constructor(data: ShipTypeData) {
    this.id = data.id;
    this.name = data.name;
    this.defenceName = data.defenceName;
    if ("maxModule" in data) {
      this.maxModule = data.maxModule;
    } else {
      this.maxModule = 2 + this.id;
    }
    if ("maxPoints" in data) {
      this.maxPoints = data.maxPoints;
    } else {
      this.maxPoints = 1 + 2 * this.id;
    }
    if ("navalCapacity" in data) {
      this.navalCapacity = data.navalCapacity;
    } else {
      this.navalCapacity = this.maxPoints;
    }
    this.unlocked = this.id === 1;
  }
}
