import { ZERO } from "../CONSTANTS";
import { ModuleData } from "../data/modules";
import { IUnlockable } from "../iUnlocable";
import { ALL_SIZES } from "../data/sizes";

const DEFAULT_PRICE = new Decimal(10);

export class Module implements IUnlockable {
  id = "";
  name = "";
  shape = "";
  armour = ZERO;
  shield = ZERO;
  energy = ZERO;
  damage = ZERO;
  armourDamagePercent = 100;
  shieldDamagePercent = 100;
  fire = 1;
  price = DEFAULT_PRICE;
  explosion = 0;
  unlocked = false;
  sizes = ALL_SIZES;

  constructor(moduleData: ModuleData) {
    this.id = moduleData.id;
    this.name = moduleData.name;
    if ("armour" in moduleData) this.armour = new Decimal(moduleData.armour);
    if ("shield" in moduleData) this.shield = new Decimal(moduleData.shield);
    if ("energy" in moduleData) this.energy = new Decimal(moduleData.energy);
    if ("damage" in moduleData) this.damage = new Decimal(moduleData.damage);
    if ("price" in moduleData) this.price = new Decimal(moduleData.price);
    if ("armourDamagePercent" in moduleData) {
      this.armourDamagePercent = moduleData.armourDamagePercent;
    }
    if ("shieldDamagePercent" in moduleData) {
      this.shieldDamagePercent = moduleData.shieldDamagePercent;
    }
    if ("fire" in moduleData) this.fire = moduleData.fire;
    if ("explosion" in moduleData) this.explosion = moduleData.explosion;
    if ("sizes" in moduleData) this.sizes = moduleData.sizes;
    if ("shape" in moduleData) this.shape = moduleData.shape;
  }

  unlock(): boolean {
    if (this.unlocked) return false;
    this.unlocked = true;
    return true;
  }
}
