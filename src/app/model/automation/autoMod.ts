import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Worker } from "../units/worker";
import { MAX_MOD_PRESET, ZERO } from "../CONSTANTS";

export class AutoMod extends AbstractAutobuyer {
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
      for (let k = 0, n = this.worker.modStack.mods.length; k < n; k++) {
        modRequired = modRequired.plus(this.worker.modStack.mods[k].presets[i]);
      }
      if (
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
      for (let k = 0, n = this.worker.modStack.mods.length; k < n; k++) {
        this.worker.modStack.mods[k].quantity = this.worker.modStack.mods[
          k
        ].presets[preset];
      }
      this.worker.confirmMods(true);
      return true;
    }
    return false;
  }
}
