import { Module } from "./module";
import { modules } from "../data/modules";
import { ShipDesign } from "./shipDesign";

export class ShipyardManager {
  shipDesigns = new Array<ShipDesign>();
  modules = new Array<Module>();

  init() {
    this.modules = modules.map(m => new Module(m));
  }
}
