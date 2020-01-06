import {
  ZERO,
  ONE,
  FLEET_NUMBER,
  BASE_ARMOUR,
  BASE_SHIP_PRICE,
  BASE_EXPLOSION
} from "../CONSTANTS";
import { Module } from "./module";
import { Game } from "../game";
import { ShipType } from "./ShipType";
import { MainService } from "src/app/main.service";
import { FleetShips } from "./fleetShips";
import { ShipData, WeaponData } from "../battle/shipData";
import { Weapon } from "./weapon";

const PRICE_GROW_RATE = 1.05;
const SIZE_MULTI = 0.2;

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
  explosionChance = BASE_EXPLOSION;
  energy = 0;
  price = ZERO;
  cargo = ZERO;
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
  weapons = Array<Weapon>();

  enemyPriority = 1;
  enemyQuantity = 0;
  threat = 1;

  constructor() {
    this.fleets = new Array<FleetShips>(FLEET_NUMBER);
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.fleets[i] = new FleetShips();
    }
  }
  static getStatsMulti(m: any): number {
    const sizeMultiplier = m.size + (m.size - 1) * SIZE_MULTI;
    return (1 + 0.1 * (m.level - 1)) * sizeMultiplier;
  }
  reload(errorCheck = false) {
    this.weapons = [];
    this.totalArmour = BASE_ARMOUR * (this.type.id + 1);
    this.totalShield = 0;
    this.totalDamage = 0;
    this.price = new Decimal(BASE_SHIP_PRICE * (this.type.id + 1));
    this.cargo = ZERO;
    this.totalPoints = 0;
    this.energy = 0;
    this.modules
      .filter(m => m.module)
      .forEach(m => {
        this.totalPoints = this.totalPoints + m.size;
        const statsMulti = ShipDesign.getStatsMulti(m);
        const priceMulti = Decimal.pow(PRICE_GROW_RATE, m.level).times(
          statsMulti
        );

        this.totalArmour += m.module.armour * statsMulti;
        this.totalShield += m.module.shield * statsMulti;
        const damage = m.module.damage * statsMulti;
        this.totalDamage += damage;

        this.energy += m.module.energy * statsMulti;
        this.price = this.price.plus(priceMulti.times(m.module.price));
        this.cargo = this.cargo.plus(
          Decimal.multiply(m.module.cargo, statsMulti)
        );

        if (m.module.damage > 0) {
          this.weapons.push({
            module: m.module,
            damage: damage,
            armourPercent: m.module.armourDamagePercent,
            shieldPercent: m.module.shieldDamagePercent,
            aliveThreatGain: 0,
            armourThreatGain: 0,
            shieldThreatGain: 0
          });
        }
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
  getShipData(): ShipData {
    const ret = new ShipData();
    ret.designId = this.id;
    ret.name = this.name;
    ret.totalArmour = this.totalArmour;
    ret.totalShield = this.totalShield;
    ret.threat = this.threat;
    ret.explosionChance = this.explosionChance / 100;
    ret.weapons = this.weapons;
    return ret;
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

  getEnemySave(): any {
    return {
      n: this.name,
      t: this.type.id,
      m: this.modules.map(mod => [mod.module.id, mod.level, mod.size]),
      q: this.enemyQuantity
    };
  }
  loadEnemy(data: any): any {
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
    if ("q" in data) this.enemyQuantity = data.q;
    this.reload();
  }
  //#endregion
}
