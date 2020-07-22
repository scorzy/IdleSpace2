import { Unit } from "./unit";
import { ModStack } from "./modStack";
import { Game } from "../game";
import {
  ONE,
  ZERO,
  COMPONENT_PRICE,
  MOD_COMPONENTS,
  MOD_RECYCLING,
  MAX_RECYCLING
} from "../CONSTANTS";
import { IUnitData } from "../data/iUnitData";
import { Technology } from "../researches/technology";
import { Research } from "../researches/research";
import { AutoWorker } from "../automation/autoWorker";

export class Worker extends Unit {
  modStack: ModStack;
  maxMods: Decimal = ZERO;
  unusedMods: Decimal = ZERO;
  maxTechMods: { technology: Technology; multi: number }[];
  recycle = ZERO;
  recycleTemp = ZERO;
  assemblyPriority = 50;
  assemblyPriorityEnding = 500;
  modsResearches: Research[];
  autoBuyer: AutoWorker;
  constructor(public unitData: IUnitData) {
    super(unitData);
  }
  reloadComponentPrice() {
    const baseRecycling = Game.getGame().baseRecycling;
    const recyclingMulti = Game.getGame().recyclingMulti.totalBonus;
    this.components = COMPONENT_PRICE;
    this.componentsTemp = COMPONENT_PRICE;
    if (this.modStack && this.modStack.componentsMod) {
      this.components = this.components.minus(
        this.modStack.componentsMod.quantity.times(MOD_COMPONENTS)
      );
      this.componentsTemp = this.componentsTemp.minus(
        this.modStack.componentsMod.uiQuantity.times(MOD_COMPONENTS)
      );
    }
    this.recycle = baseRecycling;
    this.recycleTemp = baseRecycling;
    if (this.modStack && this.modStack.recyclingMod) {
      this.recycle = this.recycle.plus(
        this.modStack.recyclingMod.quantity.times(MOD_RECYCLING)
      );
      this.recycleTemp = this.recycleTemp.plus(
        this.modStack.recyclingMod.uiQuantity.times(MOD_RECYCLING)
      );
    }
    this.recycle = Decimal.min(
      this.recycle.times(recyclingMulti),
      this.components.times(MAX_RECYCLING)
    );
    this.recycleTemp = Decimal.min(
      this.recycleTemp.times(recyclingMulti),
      this.componentsTemp.times(MAX_RECYCLING)
    );
  }
  makeMods() {
    this.modStack = new ModStack(this.id !== "e");
  }
  reloadMaxMods() {
    this.maxMods = ZERO;
    for (let i = 0, n = this.maxTechMods.length; i < n; i++) {
      this.maxMods = this.maxMods.plus(
        this.maxTechMods[i].technology.quantity.times(this.maxTechMods[i].multi)
      );
    }
    let multi = ONE;
    if (this.modsResearches) {
      for (let i = 0, n = this.modsResearches.length; i < n; i++) {
        if (this.modsResearches[i].quantity.gt(0)) {
          for (
            let k = 0, n2 = this.modsResearches[i].modPoints.length;
            k < n2;
            k++
          ) {
            if (this.modsResearches[i].modPoints[k].unit === this) {
              multi = multi.times(
                this.modsResearches[i].quantity.times(
                  1 + this.modsResearches[i].modPoints[k].multi
                )
              );
            }
          }
        }
      }
    }
    this.maxMods = this.maxMods.times(multi).floor();
  }
  confirmMods() {
    let recycle = this.recycle.plus(Game.getGame().baseRecycling);
    recycle = recycle.times(Game.getGame().recyclingMulti.totalBonus);
    recycle = recycle.min(this.components.times(0.9));
    this.quantity = ONE;
    this.modStack.mods.forEach((mod) => {
      mod.quantity = mod.uiQuantity;
    });
    this.manualBought = ZERO;
    this.reloadAll();
    let toAdd = this.quantity.times(recycle);
    let newDrones = toAdd.div(this.components).floor();
    newDrones = newDrones.min(this.limit.minus(ONE));
    toAdd = toAdd.minus(newDrones.times(this.components));

    this.quantity = this.quantity.plus(newDrones);
    const components = Game.getGame().resourceManager.components;
    components.quantity = components.quantity.plus(toAdd);
    Game.getGame().resourceManager.deployComponents();
    Game.getGame().researchManager.robotics.inspire();
    this.reloadAll();
  }
  reloadLimit() {
    if (!super.reloadLimit()) return false;
    if (this.modStack && this.modStack.droneMod) {
      this.limitTemp = this.limit.times(this.modStack.droneMod.totalBonusTemp);
      this.limit = this.limit.times(this.modStack.droneMod.totalBonus);
    }
  }
  reloadAll() {
    this.modStack.reload();
    this.reloadComponentPrice();
    this.production.forEach((prod) => {
      prod.reloadMod();
    });
    this.production.forEach((prod) => {
      prod.reloadMod();
    });
    super.reloadAll();
  }
  reloadNeedComponent() {
    this.needComponents = this.limit
      .minus(this.quantity)
      .times(this.components)
      .minus(this.storedComponents)
      .max(0);
    if (this.components.gt(0)) {
      this.componentPercent = this.storedComponents
        .div(this.components)
        .toNumber();
    } else this.componentPercent = 1;
  }
  postUpdate() {
    super.postUpdate();
    this.reloadNeedComponent();
  }
  prestige() {
    super.prestige();
    this.modStack.mods.forEach((mod) => {
      mod.quantity = ZERO;
    });
    this.modStack.reload();
  }
  getSave(): any {
    const ret = super.getSave();
    if (this.modStack) {
      ret.t = this.modStack.getSave();
    }
    ret.p1 = this.assemblyPriority;
    ret.p2 = this.assemblyPriorityEnding;
    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("t" in save) {
      this.modStack.load(save.t);
    }
    if ("p1" in save) this.assemblyPriority = save.p1;
    if ("p2" in save) this.assemblyPriorityEnding = save.p2;
  }
}
