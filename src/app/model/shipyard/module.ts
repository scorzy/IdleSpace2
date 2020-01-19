import { ZERO, DEFAULT_MODULE_PRICE } from "../CONSTANTS";
import { ModuleData } from "../data/modulesData";
import { IUnlockable } from "../iUnlocable";
import { ALL_SIZES } from "../data/sizes";
import { Technology } from "../researches/technology";
import { Game } from "../game";

export class Module implements IUnlockable {
  id = "";
  name = "";
  shape = "";
  armour = 0;
  shield = 0;
  energy = 0;
  armourDamageReduction = 0;
  shieldDamageReduction = 0;
  damage = 0;
  cargo = 0;
  armourDamagePercent = 100;
  shieldDamagePercent = 100;
  fire = 1;
  price = DEFAULT_MODULE_PRICE;
  explosion = 0;
  explosionDamage = 0;
  unlocked = false;
  sizes = ALL_SIZES;
  maxLevel = 0;
  technologies: { technology: Technology; multi: number }[];
  unlockLevel = 0;

  constructor(moduleData: ModuleData) {
    this.id = moduleData.id;
    this.name = moduleData.name;
    if ("armour" in moduleData) this.armour = moduleData.armour;
    if ("shield" in moduleData) this.shield = moduleData.shield;
    if ("energy" in moduleData) this.energy = moduleData.energy;
    if ("shieldDamageReduction" in moduleData)
      this.shieldDamageReduction = moduleData.shieldDamageReduction;
    if ("armourDamageReduction" in moduleData)
      this.armourDamageReduction = moduleData.armourDamageReduction;
    if ("damage" in moduleData) this.damage = moduleData.damage;
    if ("price" in moduleData) this.price = moduleData.price;
    if ("cargo" in moduleData) this.cargo = moduleData.cargo;
    if ("armourDamagePercent" in moduleData) {
      this.armourDamagePercent = moduleData.armourDamagePercent;
    }
    if ("shieldDamagePercent" in moduleData) {
      this.shieldDamagePercent = moduleData.shieldDamagePercent;
    }
    if ("fire" in moduleData) this.fire = moduleData.fire;
    if ("explosion" in moduleData) this.explosion = moduleData.explosion;
    if ("explosionDamage" in moduleData)
      this.explosionDamage = moduleData.explosionDamage;
    if ("sizes" in moduleData) this.sizes = moduleData.sizes;
    if ("shape" in moduleData) this.shape = moduleData.shape;
    if ("unlockLevel" in moduleData) {
      this.unlockLevel = moduleData.unlockLevel;
    }
    if ("technologies" in moduleData) {
      this.technologies = moduleData.technologies.map(tec => {
        return {
          technology: Game.getGame().researchManager.technologies.find(
            t => t.id === tec.technologyId
          ),
          multi: tec.multi
        };
      });
    }
  }
  reloadMaxLevel() {
    this.maxLevel = 0;
    for (let i = 0, n = this.technologies.length; i < n; i++) {
      this.maxLevel += this.technologies[i].technology.quantity
        .times(this.technologies[i].multi)
        .toNumber();
    }
    this.maxLevel = Math.floor(this.maxLevel);
  }
  unlock(): boolean {
    if (this.unlocked) return false;
    this.unlocked = true;
    return true;
  }
}
