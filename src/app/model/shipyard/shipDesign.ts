import {
  ZERO,
  FLEET_NUMBER,
  BASE_ARMOUR,
  BASE_SHIP_PRICE,
  BASE_EXPLOSION,
  BASE_THREAT,
  BASE_VELOCITY,
  MIN_THREAT,
  UTILITY_MOD_DECREASE,
  SIZE_MULTI,
  PRICE_GROW_RATE
} from "../CONSTANTS";
import { Game } from "../game";
import { ShipType } from "./ShipType";
import { MainService } from "src/app/main.service";
import { FleetShips } from "./fleetShips";
import { ShipData } from "../battle/shipData";
import { Weapon } from "./weapon";
import { IShipModule } from "./IShipModule";

const BASE_VELOCITY_DECIMAL = new Decimal(BASE_VELOCITY);
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
  velocity = BASE_VELOCITY_DECIMAL;
  acceleration = ZERO;
  valid = true;

  modules = new Array<IShipModule>();
  weapons = Array<Weapon>();

  enemyPriority = 1;
  enemyQuantity = 0;
  threat = BASE_THREAT;
  isDefence = false;

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
    let modSum = 0;
    let points = 0;
    this.weapons = [];
    this.totalArmour = BASE_ARMOUR * (this.type.id + 1);
    const baseArmour = this.totalArmour;
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
    this.velocity = BASE_VELOCITY_DECIMAL;
    this.acceleration = ZERO;
    this.explosionThreshold = BASE_EXPLOSION * (this.type.id + 1);
    this.threat = BASE_THREAT * (this.type.id + 1);
    this.valid = true;
    if (errorCheck) {
      //  Error check
      this.modules
        .filter(m => m.module)
        .forEach(mod => {
          mod.errorTip = "";
          mod.warningTip = "";
          mod.validateStatus = "";

          if (mod.level >= mod.module.maxLevel) {
            mod.errorTip = mod.errorTip + "Level is over max level.";
            mod.validateStatus = "error";
            this.valid = false;
          }
        });
    }
    for (let i = 0, n = this.modules.length; i < n; i++) {
      const m = this.modules[i];
      if (!m.module) continue;

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
      this.velocity = this.velocity.plus(
        Decimal.times(m.module.velocity, statsMulti)
      );
      this.acceleration = this.acceleration.plus(
        Decimal.times(m.module.acceleration, statsMulti)
      );
      this.threat += m.module.threat * statsMulti;
      this.explosionThreshold += m.module.explosion * statsMulti;

      this.energy += m.module.energy * m.size * m.level;
      this.price = this.price.plus(priceMulti.times(m.module.price));
      this.cargo = this.cargo.plus(
        Decimal.multiply(m.module.cargo, statsMulti)
      );

      // Weapons
      if (m.module.damage > 0) {
        this.weapons.push({
          module: m.module,
          level: m.level,
          damage,
          armourPercent: m.module.armourDamagePercent,
          shieldPercent: m.module.shieldDamagePercent,
          defencePercent: m.module.defenceDamagePercent,
          precision: m.module.precision * statsMulti,
          adaptivePrecision: m.module.adaptivePrecision * statsMulti,
          threatMulti: m.module.threatGainMulti
        });
      }
    }
    //#region Utility
    for (let i = 0, n = this.modules.length; i < n; i++) {
      const m = this.modules[i];
      if (!m.module || m.module.damage > 0) continue;

      const statsMulti = ShipDesign.getStatsMulti(m);
      const statsMultiNoLevel = ShipDesign.getStatsMulti(m, true);

      // Weapons
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
        if (m.module.defenceDamagePercent !== 100) {
          weapon.defencePercent *= Math.pow(
            1 + (m.module.defenceDamagePercent * multi) / 100,
            statsMultiNoLevel
          );
        }
        if (m.module.threatGainMulti !== 1) {
          weapon.threatMulti *= Math.pow(
            1 + (m.module.threatGainMulti - 1) * multi,
            statsMultiNoLevel
          );
        }
      });
      // Armour %
      if (m.module.armourPercent > 0) {
        const multiGainMax =
          Math.pow(1 + m.module.armourPercent / 100, statsMultiNoLevel) - 1;
        this.totalArmour += baseArmour * multiGainMax;

        for (let k = 0, n2 = this.modules.length; k < n2; k++) {
          if (!this.modules[k].module || this.modules[k].module.armour <= 0) {
            continue;
          }

          let multi = 1;
          let multiGainReal = multiGainMax;

          if (this.modules[k].level > m.level) {
            multi = Math.pow(
              UTILITY_MOD_DECREASE,
              this.modules[k].level - m.level
            );
            multiGainReal =
              Math.pow(
                1 + (m.module.armourPercent * multi) / 100,
                statsMultiNoLevel
              ) - 1;
            if (errorCheck && this.modules[k].validateStatus !== "error") {
              this.modules[k].warningTip =
                this.modules[k].warningTip +
                (this.modules[k].warningTip !== "" ? "\n" : "") +
                "Level is over " +
                m.module.name +
                " level. Armour % reduced from: " +
                Math.floor(multiGainMax * 1000) / 10 +
                "% to " +
                Math.floor(multiGainReal * 1000) / 10 +
                "%";
              this.modules[k].validateStatus = "warning";
            }
          }
          this.totalArmour += this.modules[k].module.armour * multiGainReal;
        }
      }
      //  Shield %
      if (m.module.shieldPercent > 0) {
        const multiGainMax =
          Math.pow(1 + m.module.shieldPercent / 100, statsMultiNoLevel) - 1;
        this.totalArmour += baseArmour * multiGainMax;

        for (let k = 0, n2 = this.modules.length; k < n2; k++) {
          if (!this.modules[k].module || this.modules[k].module.shield <= 0) {
            continue;
          }

          let multi = 1;
          let multiGainReal = multiGainMax;

          if (this.modules[k].level > m.level) {
            multi = Math.pow(
              UTILITY_MOD_DECREASE,
              this.modules[k].level - m.level
            );
            multiGainReal =
              Math.pow(
                1 + (m.module.shieldPercent * multi) / 100,
                statsMultiNoLevel
              ) - 1;
            if (errorCheck && this.modules[k].validateStatus !== "error") {
              this.modules[k].warningTip =
                this.modules[k].warningTip +
                (this.modules[k].warningTip !== "" ? "\n" : "") +
                "Level is over " +
                m.module.name +
                " level. Shield % reduced from: " +
                Math.floor(multiGainMax * 1000) / 10 +
                "% to " +
                Math.floor(multiGainReal * 1000) / 10 +
                "%";
              this.modules[k].validateStatus = "warning";
            }
          }
          this.totalShield += this.modules[k].module.shield * multiGainReal;
        }
      }
      if (errorCheck) {
        // Armour Damage %
        if (m.module.armourDamagePercent !== 100 && m.module.damage <= 0) {
          const multiGainMax =
            Math.pow(
              1 + m.module.armourDamagePercent / 100,
              statsMultiNoLevel
            ) - 1;

          for (let k = 0, n2 = this.modules.length; k < n2; k++) {
            if (!this.modules[k].module || this.modules[k].module.damage <= 0) {
              continue;
            }

            let multi = 1;
            let multiGainReal = multiGainMax;

            if (this.modules[k].level > m.level) {
              multi = Math.pow(
                UTILITY_MOD_DECREASE,
                this.modules[k].level - m.level
              );
              multiGainReal =
                Math.pow(
                  1 + (m.module.armourDamagePercent * multi) / 100,
                  statsMultiNoLevel
                ) - 1;
              if (this.modules[k].validateStatus !== "error") {
                this.modules[k].warningTip =
                  this.modules[k].warningTip +
                  (this.modules[k].warningTip !== "" ? "\n" : "") +
                  "Level is over " +
                  m.module.name +
                  " level. Extra Armour Damage % reduced from: " +
                  Math.floor(multiGainMax * 1000) / 10 +
                  "% to " +
                  Math.floor(multiGainReal * 1000) / 10 +
                  "%";
                this.modules[k].validateStatus = "warning";
              }
            }
          }
        }
        // Shield Damage %
        if (m.module.shieldDamagePercent !== 100 && m.module.damage <= 0) {
          const multiGainMax =
            Math.pow(
              1 + m.module.shieldDamagePercent / 100,
              statsMultiNoLevel
            ) - 1;

          for (let k = 0, n2 = this.modules.length; k < n2; k++) {
            if (!this.modules[k].module || this.modules[k].module.damage <= 0) {
              continue;
            }

            let multi = 1;
            let multiGainReal = multiGainMax;

            if (this.modules[k].level > m.level) {
              multi = Math.pow(
                UTILITY_MOD_DECREASE,
                this.modules[k].level - m.level
              );
              multiGainReal =
                Math.pow(
                  1 + (m.module.shieldDamagePercent * multi) / 100,
                  statsMultiNoLevel
                ) - 1;
              if (this.modules[k].validateStatus !== "error") {
                this.modules[k].warningTip =
                  this.modules[k].warningTip +
                  (this.modules[k].warningTip !== "" ? "\n" : "") +
                  "Level is over " +
                  m.module.name +
                  " level. Extra Shield Damage % reduced from: " +
                  Math.floor(multiGainMax * 1000) / 10 +
                  "% to " +
                  Math.floor(multiGainReal * 1000) / 10 +
                  "%";
                this.modules[k].validateStatus = "warning";
              }
            }
          }
        }
        // Threat multi %
        if (m.module.threatGainMulti !== 1 && m.module.damage <= 0) {
          const multiGainMax =
            Math.pow(1 + (m.module.threatGainMulti - 1), statsMultiNoLevel) - 1;

          for (let k = 0, n2 = this.modules.length; k < n2; k++) {
            if (!this.modules[k].module || this.modules[k].module.damage <= 0) {
              continue;
            }

            let multi = 1;
            let multiGainReal = multiGainMax;

            if (this.modules[k].level > m.level) {
              multi = Math.pow(
                UTILITY_MOD_DECREASE,
                this.modules[k].level - m.level
              );
              multiGainReal =
                Math.pow(
                  1 + (m.module.threatGainMulti - 1) * multi,
                  statsMultiNoLevel
                ) - 1;
              if (this.modules[k].validateStatus !== "error") {
                this.modules[k].warningTip =
                  this.modules[k].warningTip +
                  (this.modules[k].warningTip !== "" ? "\n" : "") +
                  "Level is over " +
                  m.module.name +
                  " level. Threat multi % reduced from: " +
                  Math.floor(multiGainMax * 1000) / 10 +
                  "% to " +
                  Math.floor(multiGainReal * 1000) / 10 +
                  "%";
                this.modules[k].validateStatus = "warning";
              }
            }
          }
        }
      }
    }
    //#endregion

    this.explosionThreshold = Math.max(this.explosionThreshold, 0);
    this.valid =
      this.valid &&
      (this.energy >= 0 || this.isDefence) &&
      modSum <= this.type.maxModule &&
      points <= this.type.maxPoints;

    // avgModLevel = modSum > 0 ? avgModLevel / modSum : 1;
    // this.threat += this.threat * avgModLevel;
    this.threat = Math.max(MIN_THREAT, this.threat);
  }
  getCopy(errorCheck = true) {
    const ret = new ShipDesign();
    ret.name = this.name;
    ret.id = this.id;
    ret.rev = this.rev;
    ret.type = this.type;
    ret.isDefence = this.isDefence;
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
                levelUi: MainService.formatPipe.transform(mod.level, true),
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
    ret.isDefence = this.isDefence;

    return ret;
  }
  maximize() {
    this.modules.forEach(mod => {
      if (mod.module) mod.level = Math.floor(mod.module.maxLevel - 1);
    });
    this.reload(true);
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
    if (this.isDefence) ret.d = this.isDefence;
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
    if ("d" in data) this.isDefence = data.d;
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
