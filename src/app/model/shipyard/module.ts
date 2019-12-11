import { ZERO } from "../CONSTANTS";
import { ModuleData } from "../data/modules";
import { IUnlockable } from "../iUnlocable";

export class Module implements IUnlockable {
  id = "";
  name = "";
  armor = ZERO;
  shield = ZERO;
  energy = ZERO;
  damage = ZERO;
  armorDamagePercent = 100;
  shieldDamagePercent = 100;
  fire = 1;
  price = ZERO;
  unlocked = false;

  constructor(moduleData: ModuleData) {
    this.id = moduleData.id;
    this.name = moduleData.name;
    if ("armor" in moduleData) this.armor = new Decimal(moduleData.armor);
    if ("shield" in moduleData) this.shield = new Decimal(moduleData.shield);
    if ("energy" in moduleData) this.energy = new Decimal(moduleData.energy);
    if ("damage" in moduleData) this.damage = new Decimal(moduleData.damage);
    if ("price" in moduleData) this.price = new Decimal(moduleData.price);
    if ("armorDamagePercent" in moduleData) {
      this.armorDamagePercent = moduleData.armorDamagePercent;
    }
    if ("shieldDamagePercent" in moduleData) {
      this.shieldDamagePercent = moduleData.shieldDamagePercent;
    }
    if ("fire" in moduleData) this.fire = moduleData.fire;
  }

  unlock(): boolean {
    if (this.unlocked) return false;
    this.unlocked = true;
    return true;
  }
}
