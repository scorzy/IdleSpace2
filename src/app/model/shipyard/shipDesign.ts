import {
  ZERO,
  ONE,
  FLEET_NUMBER,
  BASE_ARMOUR,
  BASE_SHIP_PRICE,
  BASE_EXPLOSION,
  BASE_THREAT,
  BASE_VELOCITY,
  MIN_THREAT,
  UTILITY_MOD_DECREASE
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
export interface IShipModule {
  module: Module;
  level: number;
  size: number;
  moduleId?: string;
  levelUi?: string;
  validateStatus?: string;
  errorTip?: string;
}

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
  armourReduction = 0;
  shieldReduction = 0;
  totalDamage = 0;
  explosionThreshold = BASE_EXPLOSION;
  explosionDamage = 0;
  energy = 0;
  price = ZERO;
  cargo = ZERO;
  shieldRecharge = 0;
  velocity = BASE_VELOCITY;
  acceleration = 0;
  valid = true;

  modules = new Array<IShipModule>();
  weapons = Array<Weapon>();

  enemyPriority = 1;
  enemyQuantity = 0;
  threat = BASE_THREAT;

  constructor() {
    this.fleets = new Array<FleetShips>(FLEET_NUMBER);
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.fleets[i] = new FleetShips();
    }
  }
  static getStatsMulti(m: any, noLevel = false): number {
    const sizeMultiplier = m.size + (m.size - 1) * SIZE_MULTI;
    if (noLevel) return sizeMultiplier;
    return (1 + 0.1 * (m.level - 1)) * sizeMultiplier;
  }
  reload(errorCheck = false) {
    let avgModLevel = 0;
    let modSum = 0;
    let points = 0;
    this.weapons = [];
    this.totalArmour = BASE_ARMOUR * (this.type.id + 1);
    this.totalShield = 0;
    this.totalDamage = 0;
    this.armourReduction = 0;
    this.shieldReduction = 0;
    this.price = new Decimal(BASE_SHIP_PRICE * (this.type.id + 1));
    this.cargo = ZERO;
    this.totalPoints = 0;
    this.energy = 0;
    this.explosionDamage = 0;
    this.shieldRecharge = 0;
    this.velocity = BASE_VELOCITY;
    this.acceleration = 0;
    this.threat = 0;
    for (let i = 0, n = this.modules.length; i < n; i++) {
      const m = this.modules[i];
      if (!m.module) continue;

      avgModLevel += m.level;
      points += m.size;
      modSum++;
      this.totalPoints = this.totalPoints + m.size;
      const statsMulti = ShipDesign.getStatsMulti(m);
      const priceMulti = Decimal.pow(m.level, PRICE_GROW_RATE).times(
        statsMulti
      );

      this.totalArmour += m.module.armour * statsMulti;
      this.totalShield += m.module.shield * statsMulti;
      this.armourReduction += m.module.armourDamageReduction * statsMulti;
      this.shieldReduction += m.module.shieldDamageReduction * statsMulti;
      const damage = m.module.damage * statsMulti;
      this.totalDamage += damage;
      this.explosionDamage += m.module.explosionDamage * statsMulti;
      this.shieldRecharge += m.module.shieldRecharge * statsMulti;
      this.velocity += m.module.velocity * statsMulti;
      this.acceleration += m.module.acceleration * statsMulti;
      this.threat += m.module.threat * statsMulti;

      this.energy += m.module.energy * m.size * m.level;
      this.price = this.price.plus(priceMulti.times(m.module.price));
      this.cargo = this.cargo.plus(
        Decimal.multiply(m.module.cargo, statsMulti)
      );

      if (m.module.damage > 0) {
        this.weapons.push({
          module: m.module,
          level: m.level,
          damage,
          armourPercent: m.module.armourDamagePercent,
          shieldPercent: m.module.shieldDamagePercent,
          precision: m.module.precision * statsMulti,
          adaptivePrecision: m.module.adaptivePrecision * statsMulti,
          threatMulti: m.module.threatGainMulti
        });
      }
    }
    // Utility
    for (let i = 0, n = this.modules.length; i < n; i++) {
      const m = this.modules[i];
      if (!m || m.module.damage > 0) continue;
      const statsMulti = ShipDesign.getStatsMulti(m);
      const statsMultiNoLevel = ShipDesign.getStatsMulti(m, true);
      this.weapons.forEach(weapon => {
        weapon.precision += m.module.precision * statsMulti;
        weapon.adaptivePrecision += m.module.adaptivePrecision * statsMulti;
        let multi = 1;
        if (weapon.level > m.level) {
          multi = Math.pow(UTILITY_MOD_DECREASE, weapon.level - m.level);
        }
        if (m.module.armourDamagePercent !== 100) {
          weapon.armourPercent *= Math.pow(
            1 + (m.module.armourDamagePercent * multi) / 100,
            statsMultiNoLevel
          );
        }
        if (m.module.shieldDamagePercent !== 100) {
          weapon.shieldPercent *= Math.pow(
            1 + (m.module.shieldDamagePercent * multi) / 100,
            statsMultiNoLevel
          );
        }
      });
    }

    this.valid =
      this.energy >= 0 &&
      modSum <= this.type.maxModule &&
      points <= this.type.maxPoints;

    avgModLevel = modSum > 0 ? avgModLevel / modSum : 1;
    this.threat += this.threat * avgModLevel;
    this.threat = Math.max(MIN_THREAT, this.threat);

    if (errorCheck) {
      //  Error check
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
  getCopy(errorCheck = true) {
    const ret = new ShipDesign();
    ret.name = this.name;
    ret.id = this.id;
    ret.rev = this.rev;
    ret.type = this.type;
    ret.modules =
      this.modules.length === 0
        ? []
        : this.modules
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
    ret.reload(errorCheck);
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
    ret.armourReduction = this.armourReduction;
    ret.shieldReduction = this.shieldReduction;
    ret.threat = this.threat;
    ret.explosionThreshold = this.explosionThreshold;
    ret.explosionDamage = this.explosionDamage;
    ret.weapons = this.weapons;
    ret.shieldRecharge = this.shieldRecharge;

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
