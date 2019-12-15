import { Module } from "./module";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./ShipType";
import { SHIP_TYPES } from "../data/shipTypes";
import { modules } from "../data/modulesData";

export class ShipyardManager {
  shipDesigns = new Array<ShipDesign>();
  modules = new Array<Module>();
  shipTypes = new Array<ShipType>();

  weapons = new Array<Module>();
  defences = new Array<Module>();
  generators = new Array<Module>();
  others = new Array<Module>();

  init() {
    this.shipTypes = SHIP_TYPES.map(s => new ShipType(s));
    this.modules = modules.map(m => new Module(m));
  }

  addDesign(name: string, type: number): number {
    const shipType = this.shipTypes.find(t => t.id === type);
    if (!shipType) return -1;
    let newId = 0;
    if (this.shipDesigns.length > 0) {
      newId = this.shipDesigns[this.shipDesigns.length - 1].id + 1;
    }

    const shipDesign = new ShipDesign();
    shipDesign.id = newId;
    shipDesign.name = name;
    shipDesign.type = shipType;
    this.shipDesigns.push(shipDesign);
    return shipDesign.id;
  }
  postUpdate() {
    let unlocked = false;
    for (let i = 0, n = this.modules.length; i < n; i++) {
      this.modules[i].reloadMaxLevel();
      if (
        !this.modules[i].unlocked &&
        this.modules[i].maxLevel.gte(this.modules[i].unlockLevel)
      ) {
        if (this.modules[i].unlock()) {
          unlocked = true;
        }
      }
    }
    if (unlocked) this.reloadLists();
  }
  reloadLists() {
    this.weapons = this.modules.filter(mod => mod.unlocked && mod.damage.gt(0));
    this.defences = this.modules.filter(
      mod => mod.unlocked && (mod.armour.gt(0) || mod.shield.gt(0))
    );
    this.generators = this.modules.filter(
      mod => mod.unlocked && mod.energy.gt(0)
    );
    this.others = this.modules.filter(
      mod =>
        mod.unlocked &&
        this.weapons.findIndex(w => w.id === mod.id) < 0 &&
        this.defences.findIndex(w => w.id === mod.id) < 0 &&
        this.generators.findIndex(w => w.id === mod.id) < 0
    );
  }

  //#region Save and Load
  getSave(): any {
    return {
      d: this.shipDesigns.map(des => des.getSave())
    };
  }
  load(data: any) {
    if ("d" in data) {
      this.shipDesigns = data.d.map(d => {
        const design = new ShipDesign();
        design.load(d);
        return design;
      });
    }
  }
  //#endregion
}
