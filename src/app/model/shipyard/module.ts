import { ZERO } from "../CONSTANTS";
import { ModuleData } from "../data/modulesData";
import { IUnlockable } from "../iUnlocable";
import { ALL_SIZES } from "../data/sizes";
import { Technology } from "../researches/technology";
import { Game } from "../game";

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
  maxLevel = ZERO;
  technologies: { technology: Technology; multi: number }[];
  unlockLevel = ZERO;

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
    if ("unlockLevel" in moduleData) {
      this.unlockLevel = new Decimal(moduleData.unlockLevel);
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
    let newMax = ZERO;
    for (let i = 0, n = this.technologies.length; i < n; i++) {
      newMax = newMax.plus(
        this.technologies[i].technology.quantity.times(
          this.technologies[i].multi
        )
      );
    }
    if (!newMax.eq(this.maxLevel)) this.maxLevel = newMax;
  }
  unlock(): boolean {
    if (this.unlocked) return false;
    this.unlocked = true;
    return true;
  }
}
