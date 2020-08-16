import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Worker } from "../units/worker";
import { MAX_MOD_PRESET, ZERO, ONE } from "../CONSTANTS";
import { Game } from "../game";

export class AutoMod extends AbstractAutobuyer {
  minCompPercent = 0;
  constructor(public worker: Worker) {
    super();
    this.id = "/" + worker.id;
    worker.autoMod = this;
  }
  automate(): boolean {
    if (this.worker.modPage) return false;
    let maxModRequired = ZERO;
    let preset = -1;

    for (let i = 0; i < MAX_MOD_PRESET; i++) {
      let modRequired = ZERO;
      let ok = true;
      for (let k = 0, n = this.worker.modStack.mods.length; k < n; k++) {
        if (
          this.worker.modStack.mods[k].presets[i].abs().gt(this.worker.maxMods)
        ) {
          ok = false;
          break;
        }
        modRequired = modRequired.plus(this.worker.modStack.mods[k].presets[i]);
      }
      if (
        ok &&
        modRequired.gt(0) &&
        modRequired.gt(maxModRequired) &&
        modRequired.lte(this.worker.maxMods) &&
        modRequired.gt(this.worker.modStack.used)
      ) {
        maxModRequired = modRequired;
        preset = i;
      }
    }
    if (preset >= 0) {
      let recycle = this.worker.recycle.plus(Game.getGame().baseRecycling);
      recycle = recycle.min(this.worker.components.times(0.9));
      let componentGain = this.worker.quantity.times(recycle);
      let droneRestart = componentGain
        .div(this.worker.componentsTemp)
        .plus(1)
        .floor();
      droneRestart = droneRestart.min(this.worker.limitTemp.minus(ONE));
      componentGain = componentGain
        .minus(droneRestart.times(this.worker.componentsTemp))
        .max(0);
      const componentTotal = Game.getGame().resourceManager.components.quantity.plus(
        componentGain
      );
      const componentNeed = this.worker.limitTemp
        .minus(droneRestart)
        .times(this.worker.componentsTemp);
      const componentPercent = componentTotal
        .div(componentNeed)
        .times(100)
        .min(100)
        .floor()
        .toNumber();

      if (componentPercent >= this.minCompPercent) {
        for (let k = 0, n = this.worker.modStack.mods.length; k < n; k++) {
          this.worker.modStack.mods[k].quantity = this.worker.modStack.mods[
            k
          ].presets[preset];
        }
        this.worker.confirmMods(true);
        return true;
      }
    }
    return false;
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    ret.mCo = this.minCompPercent;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      this.minCompPercent = save.mCo ?? 0;
      return true;
    }
  }
  //#endregion
}
