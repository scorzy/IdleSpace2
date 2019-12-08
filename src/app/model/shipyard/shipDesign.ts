import { ZERO, ONE } from "../CONSTANTS";
import { Module } from "./module";
import { Game } from "../game";
import { ShipType } from "./ShipType";

const PRICE_GROW_RATE = new Decimal(1.1);

export class ShipDesign {
  id: number;
  name = "";
  type: ShipType;

  totalArmor = ZERO;
  totalShield = ZERO;
  totalDamage = ZERO;
  energy = ZERO;
  price = ZERO;
  valid = true;

  modules = new Array<{ module: Module; level: Decimal }>();

  reload() {
    this.totalArmor = ZERO;
    this.totalShield = ZERO;
    this.totalDamage = ZERO;
    this.modules.forEach(m => {
      const statsMulti = ONE.plus(m.level.div(10));
      const priceMulti = PRICE_GROW_RATE.pow(m.level);

      this.totalArmor = this.totalArmor.plus(m.module.armor.times(statsMulti));
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

  //#region Save and Load
  getSave(): any {
    return {
      n: this.name,
      t: this.type.id,
      m: this.modules.map(mod => [mod.module.id, mod.level])
    };
  }
  load(data: any) {
    if ("n" in data) this.name = data.n;
    if ("t" in data) {
      this.type = Game.getGame().shipyardManager.shipTypes.find(
        t => t.id == data.id
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
          this.modules.push({ module, level });
        }
      }
    }
    this.reload();
  }
  //#endregion
}
