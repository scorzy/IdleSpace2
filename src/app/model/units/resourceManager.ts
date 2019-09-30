import { Unit } from "./unit";
import { UNITS } from "../data/units";

export class ResourceManager {
  units = new Array<Unit>();

  constructor() {
    this.units = new Array<Unit>();
    //  Initialize Units
    UNITS.forEach(unitData => {
      const unit = new Unit(unitData);
    });
  }
}
