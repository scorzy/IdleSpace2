import { ZERO, ONE } from "../CONSTANTS";
import { Module } from "./module";
import { Game } from "../game";
import { ShipType } from "./ShipType";
import { MainService } from "src/app/main.service";

const PRICE_GROW_RATE = new Decimal(0.3);
const SIZE_MULTI = 0.25;

export class ShipDesign {
  id: number;
  rev = 0;
  name = "";
  type: ShipType;
  totalPoints = 0;
  shipsQuantity = ZERO;
  navalCapPercent: number;
  navalCapPercentUi: number;

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
    levelUi?: string;
    validateStatus?: string;
    errorTip?: string;
  }>();

  reload(errorCheck = false) {
    this.totalArmour = ZERO;
    this.totalShield = ZERO;
    this.totalDamage = ZERO;
    this.price = ZERO;
    this.totalPoints = 0;
    this.energy = ZERO;
    this.modules
      .filter(m => m.module)
      .forEach(m => {
        const sizeMultiplier = m.size + (m.size - 1) * SIZE_MULTI;
        this.totalPoints = this.totalPoints + m.size;
        const statsMulti = ONE.plus(m.level.div(10)).times(sizeMultiplier);
        const priceMulti = statsMulti.times(PRICE_GROW_RATE).times(m.level);

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
    //  Error check
    if (errorCheck) {
      this.modules
        .filter(m => m.module)
        .forEach(mod => {
          mod.errorTip = "";
          mod.validateStatus = "";

          if (mod.level.gt(mod.module.maxLevel)) {
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

  //#region Save and Load
  getSave(): any {
    return {
      i: this.id,
      r: this.rev,
      n: this.name,
      t: this.type.id,
      m: this.modules.map(mod => [mod.module.id, mod.level, mod.size]),
      p: this.navalCapPercent,
      q: this.shipsQuantity
    };
  }
  load(data: any) {
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
          const level = new Decimal(mod[1]);
          const size = mod[2];
          this.modules.push({ module, level, size });
        }
      }
    }
    if ("p" in data) {
      this.navalCapPercent = data.p;
    }
    if ("q" in data) {
      this.shipsQuantity = new Decimal(data.q);
    }
    this.reload();
  }
  //#endregion
}
