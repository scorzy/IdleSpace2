import { DEFAULT_MODULE_PRICE } from "../CONSTANTS";
import { ModuleData } from "../data/modulesData";
import { IUnlockable } from "../iUnlocable";
import { ALL_SIZES } from "../data/sizes";
import { Technology } from "../researches/technology";
import { Game } from "../game";
import forOwn from "lodash-es/forOwn";

export class Module implements IUnlockable {
  id = "";
  name = "";
  shape = "";
  armour = 0;
  shield = 0;
  armourPercent = 0;
  shieldPercent = 0;
  energy = 0;
  armourDamageReduction = 0;
  shieldDamageReduction = 0;
  damage = 0;
  cargo = 0;
  armourDamagePercent = 100;
  shieldDamagePercent = 100;
  defenceDamagePercent = 100;
  fire = 1;
  price = DEFAULT_MODULE_PRICE;
  explosion = 0;
  explosionDamage = 0;
  unlocked = false;
  sizes = ALL_SIZES;
  maxLevel = 0;
  technologies: { technology: Technology; multi: number }[];
  unlockLevel = 0;
  shieldRecharge = 0;
  velocity = 0;
  acceleration = 0;
  threat = 0;
  precision = 0;
  adaptivePrecision = 0;
  threatGainMulti = 1;

  constructor() {}
  init(moduleData: ModuleData) {
    forOwn(
      this,
      function(value: any, key: string) {
        if (
          moduleData.hasOwnProperty(key) &&
          typeof moduleData[key] === typeof this[key]
        ) {
          this[key] = moduleData[key];
        }
      }.bind(this)
    );

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
    if (this.unlocked) { return false; }
    this.unlocked = true;
    return true;
  }
}
