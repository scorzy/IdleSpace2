import { Module } from "./module";
import { modules } from "../data/modules";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./ShipType";
import { SHIP_TYPES } from "../data/shipTypes";

export class ShipyardManager {
  shipDesigns = new Array<ShipDesign>();
  modules = new Array<Module>();
  shipTypes = new Array<ShipType>();

  init() {
    this.shipTypes = SHIP_TYPES.map(s => new ShipType(s));
    this.modules = modules.map(m => new Module(m));
  }

  addDesign(name: string, type: number) {
    const shipType = this.shipTypes.find(t => t.id == type);
    if (!shipType) return -1;
    let newId = 0;
    if (this.shipDesigns.length > 0)
      this.shipDesigns[this.shipDesigns.length].id++;

    const shipDesign = new ShipDesign();
    shipDesign.id = newId;
    shipDesign.name = name;
    this.shipDesigns.push(shipDesign);
    return shipDesign.id;
  }
}
