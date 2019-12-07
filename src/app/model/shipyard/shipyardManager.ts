import { Module } from "./module";
import { modules } from "../data/modules";

export class ShipyardManager {
  modules = new Array<Module>();

  init() {
    this.modules = modules.map(m => new Module(m));
  }
}
