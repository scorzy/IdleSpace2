import { Unit } from "./unit";
import { UNITS } from "../data/units";

export class ResourceManager {
  units = new Array<Unit>();

  constructor() {
    this.units = new Array<Unit>();
    //  Initialize Units
    this.units = UNITS.map(unitData => new Unit(unitData));
  }
}
