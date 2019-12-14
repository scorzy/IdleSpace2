import { ZERO, ONE } from "../CONSTANTS";
import { Module } from "./module";
import { Game } from "../game";
import { ShipType } from "./ShipType";

const PRICE_GROW_RATE = new Decimal(1.1);
const SIZE_MULTI = 0.1; // or 0.25?

export class ShipDesign {
  id: number;
  name = "";
  type: ShipType;
  totalPoints = 0;

  totalArmour = ZERO;
  totalShield = ZERO;
  totalDamage = ZERO;
  energy = ZERO;
  price = ZERO;
  valid = true;

  modules = new Array<{
    module: Module;
    level: Decimal;
    size: number;
    moduleId?: string;
  }>();

  reload() {
    this.totalArmour = ZERO;
    this.totalShield = ZERO;
    this.totalDamage = ZERO;
    this.totalPoints = 0;
    this.modules
      .filter(m => m.module)
      .forEach(m => {
        const sizeMultiplier = m.size + (m.size - 1) * SIZE_MULTI;
        this.totalPoints = this.totalPoints + m.size;
        const statsMulti = ONE.plus(m.level.div(10)).times(sizeMultiplier);
        const priceMulti = PRICE_GROW_RATE.pow(m.level);

        this.totalArmour = this.totalArmour.plus(
          m.module.armour.times(statsMulti)
        );
        this.totalShield = this.totalShield.plus(
          m.module.shield.times(statsMulti)
        );
        this.totalDamage = this.totalDamage.plus(
          m.module.damage.times(statsMulti)
        );
        this.energy = this.energy.plus(m.module.energy.times(statsMulti));
        this.price = this.price.plus(m.module.price.times(priceMulti));
      });
    this.valid = this.energy.gte(0);
  }
  getCopy() {
    const ret = new ShipDesign();
    ret.name = this.name;
    ret.id = this.id;
    ret.type = this.type;
    ret.modules = this.modules.map(mod => {
      return {
        module: mod.module,
        level: mod.level,
        size: mod.size,
        moduleId: mod.module.id
      };
    });
    ret.reload();
    return ret;
  }

  //#region Save and Load
  getSave(): any {
    return {
      n: this.name,
      t: this.type.id,
      m: this.modules.map(mod => [mod.module.id, mod.level, mod.size])
    };
  }
  load(data: any) {
    if ("n" in data) this.name = data.n;
    if ("t" in data) {
      this.type = Game.getGame().shipyardManager.shipTypes.find(
        t => t.id === data.id
      );
    }
    if (!this.type) return false;

    if ("m" in data) {
      for (const mod of data.m) {
        const module = Game.getGame().shipyardManager.modules.find(
          m => m.id === mod[0]
        );

        if (module) {
          const level = new Decimal(mod[1]);
          const size = mod[2];
          this.modules.push({ module, level, size });
        }
      }
    }
    this.reload();
  }
  //#endregion
}
