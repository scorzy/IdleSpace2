import {
  ZERO,
  ONE,
  FLEET_NUMBER,
  BASE_ARMOUR,
  BASE_SHIP_PRICE
} from "../CONSTANTS";
import { Module } from "./module";
import { Game } from "../game";
import { ShipType } from "./ShipType";
import { MainService } from "src/app/main.service";
import { FleetShips } from "./fleetShips";

const PRICE_GROW_RATE = 1.2;
const SIZE_MULTI = 0.25;

export class ShipDesign {
  id: number;
  rev = 0;
  name = "";
  type: ShipType;
  totalPoints = 0;
  old: ShipDesign;

  fleets: FleetShips[];

  totalArmour = 0;
  totalShield = 0;
  totalDamage = 0;
  energy = 0;
  price = ZERO;
  valid = true;

  modules = new Array<{
    module: Module;
    level: number;
    size: number;
    moduleId?: string;
    levelUi?: string;
    validateStatus?: string;
    errorTip?: string;
  }>();

  constructor() {
    this.fleets = new Array<FleetShips>(FLEET_NUMBER);
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.fleets[i] = new FleetShips();
    }
  }
  reload(errorCheck = false) {
    this.totalArmour = BASE_ARMOUR * (this.type.id + 1);
    this.totalShield = 0;
    this.totalDamage = 0;
    this.price = new Decimal(BASE_SHIP_PRICE * (this.type.id + 1));
    this.totalPoints = 0;
    this.energy = 0;
    this.modules
      .filter(m => m.module)
      .forEach(m => {
        const sizeMultiplier = m.size + (m.size - 1) * SIZE_MULTI;
        this.totalPoints = this.totalPoints + m.size;
        const statsMulti = 1 + (m.level * sizeMultiplier) / 10;
        const priceMulti = Decimal.multiply(statsMulti, PRICE_GROW_RATE).times(
          m.level
        );

        this.totalArmour += m.module.armour * statsMulti;
        this.totalShield += m.module.shield * statsMulti;
        this.totalDamage += m.module.damage * statsMulti;

        this.energy += m.module.energy * statsMulti;
        this.price = this.price.plus(priceMulti.times(m.module.price));
      });

    this.valid = this.energy >= 0;
    //  Error check
    if (errorCheck) {
      this.modules
        .filter(m => m.module)
        .forEach(mod => {
          mod.errorTip = "";
          mod.validateStatus = "";

          if (mod.level >= mod.module.maxLevel) {
            mod.errorTip = mod.errorTip + "Level is over max level.";
            mod.validateStatus = "error";
            this.valid = false;
          }
        });
    }
  }
  getCopy() {
    const ret = new ShipDesign();
    ret.name = this.name;
    ret.id = this.id;
    ret.rev = this.rev;
    ret.type = this.type;
    ret.modules = this.modules
      .filter(l => l.module)
      .map(mod => {
        return {
          module: mod.module,
          level: mod.level,
          size: mod.size,
          moduleId: mod.module.id,
          levelUi: MainService.formatPipe.transform(mod.level),
          validateStatus: "",
          errorTip: ""
        };
      });
    ret.reload();
    return ret;
  }
  deleteOutDated() {
    this.old = null;
  }

  //#region Save and Load
  getSave(): any {
    const ret: any = {
      i: this.id,
      r: this.rev,
      n: this.name,
      t: this.type.id,
      m: this.modules.map(mod => [mod.module.id, mod.level, mod.size]),
      f: this.fleets.map(fleet => fleet.getData())
    };
    if (this.old) ret.o = this.old.getSave();
    return ret;
  }
  load(data: any) {
    this.fleets = new Array<FleetShips>(FLEET_NUMBER);
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.fleets[i] = new FleetShips();
    }
    if ("i" in data) this.id = data.i;
    if ("r" in data) this.rev = data.r;
    if ("n" in data) this.name = data.n;
    if ("t" in data) {
      this.type = Game.getGame().shipyardManager.shipTypes.find(
        t => t.id === data.t
      );
    }
    if (!this.type) return false;

    if ("m" in data) {
      for (const mod of data.m) {
        const module = Game.getGame().shipyardManager.modules.find(
          m => m.id === mod[0]
        );

        if (module) {
          const level = mod[1];
          const size = mod[2];
          this.modules.push({ module, level, size });
        }
      }
    }
    if ("f" in data) {
      for (let i = 0, n = Math.min(data.f.length, FLEET_NUMBER); i < n; i++) {
        this.fleets[i].load(data.f[i]);
      }
    }
    if ("o" in data) {
      this.old = new ShipDesign();
      this.old.load(data.o);
    }

    this.reload();
  }
  //#endregion
}
