import { Mod } from "./mod";
import {
  EFFICIENCY_MOD,
  PRODUCTION_MOD,
  ENERGY_MOD,
  COMPONENTS_MOD,
  DRONE_MOD,
  RECYCLABLE_MOD
} from "../data/mods";
import {
  MOD_EFFICIENCY_MULTI,
  MOD_PROD_MULTI,
  MOD_ENERGY_MULTI,
  MOD_COMPONENTS,
  MOD_RECYCLING,
  ZERO
} from "../CONSTANTS";

export class ModStack {
  efficiencyMod: Mod;
  prodMultiMod: Mod;
  energyMod: Mod;
  componentsMod: Mod;
  droneMod: Mod;
  recyclingMod: Mod;

  mods: Mod[] = [];
  used = ZERO;
  usedTemp = ZERO;

  constructor(energyMods = true) {
    //  Initialize common mods
    this.efficiencyMod = new Mod(EFFICIENCY_MOD);
    this.efficiencyMod.bonusValue = MOD_EFFICIENCY_MULTI;
    this.mods.push(this.efficiencyMod);
    if (energyMods) {
      this.prodMultiMod = new Mod(PRODUCTION_MOD);
      this.prodMultiMod.bonusValue = MOD_PROD_MULTI;
      this.energyMod = new Mod(ENERGY_MOD);
      this.energyMod.bonusValue = MOD_ENERGY_MULTI;
      this.mods.push(this.prodMultiMod, this.energyMod);
    }
    this.componentsMod = new Mod(COMPONENTS_MOD);
    this.componentsMod.bonusValue = MOD_COMPONENTS;
    this.droneMod = new Mod(DRONE_MOD);
    this.recyclingMod = new Mod(RECYCLABLE_MOD);
    this.recyclingMod.bonusValue = MOD_RECYCLING;
    this.mods.push(this.componentsMod, this.recyclingMod, this.droneMod);
    this.mods.forEach((m) => m.reloadBonus());
  }
  reload() {
    this.used = ZERO;
    this.usedTemp = ZERO;
    for (let i = 0, n = this.mods.length; i < n; i++) {
      this.mods[i].reloadBonus();
      this.used = this.used.plus(this.mods[i].quantity);
      this.usedTemp = this.usedTemp.plus(this.mods[i].uiQuantity);
    }
  }
  getSave(): any {
    const ret: any = {};
    if (this.efficiencyMod) {
      if (!this.efficiencyMod.quantity.eq(0)) {
        ret.e = this.efficiencyMod.quantity;
      }
      ret.ep = this.efficiencyMod.presets;
    }
    if (this.prodMultiMod) {
      if (!this.prodMultiMod.quantity.eq(0)) {
        ret.p = this.prodMultiMod.quantity;
      }
      ret.pp = this.prodMultiMod.presets;
    }
    if (this.energyMod) {
      if (!this.energyMod.quantity.eq(0)) {
        ret.q = this.energyMod.quantity;
      }
      ret.qp = this.energyMod.presets;
    }
    if (this.componentsMod) {
      if (!this.componentsMod.quantity.eq(0)) {
        ret.c = this.componentsMod.quantity;
      }
      ret.cp = this.componentsMod.presets;
    }
    if (this.droneMod) {
      if (!this.droneMod.quantity.eq(0)) {
        ret.d = this.droneMod.quantity;
      }
      ret.dp = this.droneMod.presets;
    }
    if (this.recyclingMod) {
      if (!this.recyclingMod.quantity.eq(0)) {
        ret.r = this.recyclingMod.quantity;
      }
      ret.rp = this.recyclingMod.presets;
    }
    return ret;
  }
  load(data: any) {
    if ("e" in data && this.efficiencyMod) {
      this.efficiencyMod.quantity = new Decimal(data.e);
    }
    if ("ep" in data && this.efficiencyMod) {
      this.efficiencyMod.loadPresets(data.ep);
    }

    if ("p" in data && this.prodMultiMod) {
      this.prodMultiMod.quantity = new Decimal(data.p);
    }
    if ("pp" in data && this.prodMultiMod) {
      this.prodMultiMod.loadPresets(data.pp);
    }

    if ("q" in data && this.energyMod) {
      this.energyMod.quantity = new Decimal(data.q);
    }
    if ("qp" in data && this.energyMod) {
      this.energyMod.loadPresets(data.qp);
    }

    if ("c" in data && this.componentsMod) {
      this.componentsMod.quantity = new Decimal(data.c);
    }
    if ("cp" in data && this.componentsMod) {
      this.componentsMod.loadPresets(data.cp);
    }

    if ("d" in data && this.droneMod) {
      this.droneMod.quantity = new Decimal(data.d);
    }
    if ("dp" in data && this.droneMod) {
      this.droneMod.loadPresets(data.dp);
    }

    if ("r" in data && this.recyclingMod) {
      this.recyclingMod.quantity = new Decimal(data.r);
    }
    if ("rp" in data && this.recyclingMod) {
      this.recyclingMod.loadPresets(data.rp);
    }

    this.mods.forEach((m) => {
      m.uiQuantity = new Decimal(m.quantity);
    });
    this.reload();
    this.mods.forEach((m) => m.reloadBonus());
  }
}
