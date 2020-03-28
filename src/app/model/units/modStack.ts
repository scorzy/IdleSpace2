import { Mod } from "./mod";
import {
  EFFICIENCY_MOD,
  PRODUCTION_MOD,
  ENERGY_MOD,
  COMPONENTS_MOD,
  DRONE_MOD
} from "../data/mods";
import {
  MOD_EFFICIENCY_MULTI,
  MOD_PROD_MULTI,
  MOD_ENERGY_MULTI
} from "../CONSTANTS";

export class ModStack {
  efficiencyMod: Mod;
  prodMultiMod: Mod;
  energyMod: Mod;
  componentsMod: Mod;
  droneMod: Mod;

  mods: Mod[] = [];

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
    this.droneMod = new Mod(DRONE_MOD);
    this.mods.push(this.componentsMod, this.droneMod);
    this.mods.forEach(m => m.reloadBonus());
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
    this.mods.forEach(m => m.reloadBonus());
  }
}
