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
import { formatISO9075 } from "date-fns";

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
    this.mods.forEach(m => m.reloadBonus());
  }
  reload() {
    this.used = ZERO;
    this.usedTemp = ZERO;
    for (let i = 0, n = this.mods.length; i < n; i++) {
      this.used = this.used.plus(this.used.plus(this.mods[i].quantity));
      this.usedTemp = this.usedTemp.plus(this.mods[i].uiQuantity);
    }
  }
  getSave(): any {
    const ret: any = {};
    if (this.efficiencyMod && !this.efficiencyMod.quantity.eq(0)) {
      ret.e = this.efficiencyMod.quantity;
    }
    if (this.prodMultiMod && !this.prodMultiMod.quantity.eq(0)) {
      ret.p = this.prodMultiMod.quantity;
    }
    if (this.energyMod && !this.energyMod.quantity.eq(0)) {
      ret.q = this.energyMod.quantity;
    }
    if (this.componentsMod && !this.componentsMod.quantity.eq(0)) {
      ret.c = this.componentsMod.quantity;
    }
    if (this.droneMod && !this.droneMod.quantity.eq(0)) {
      ret.d = this.droneMod.quantity;
    }
    if (this.recyclingMod && !this.recyclingMod.quantity.eq(0)) {
      ret.c = this.recyclingMod.quantity;
    }
    return ret;
  }
  load(data: any) {
    if ("e" in data && this.efficiencyMod) {
      this.efficiencyMod.quantity = new Decimal(data.e);
    }
    if ("p" in data && this.prodMultiMod) {
      this.prodMultiMod.quantity = new Decimal(data.p);
    }
    if ("q" in data && this.energyMod) {
      this.energyMod.quantity = new Decimal(data.q);
    }
    if ("c" in data && this.componentsMod) {
      this.componentsMod.quantity = new Decimal(data.c);
    }
    if ("d" in data && this.droneMod) {
      this.droneMod.quantity = new Decimal(data.d);
    }
    if ("c" in data && this.recyclingMod) {
      this.recyclingMod.quantity = new Decimal(data.d);
    }
    this.reload();
    this.mods.forEach(m => m.reloadBonus());
  }
}
