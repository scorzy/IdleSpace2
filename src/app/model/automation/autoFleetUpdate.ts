import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";

export class AutoFleetUpdate extends AbstractAutobuyer {
  id = "fu";
  maxLevel = 0;
  automate(): boolean {
    if (!Game.getGame().resourceManager.worker.unlocked) return false;
    const sm = Game.getGame().shipyardManager;
    if (sm.designerView) return false;
    let updated = false;

    for (let i = 0, n = sm.shipDesigns.length; i < n; i++) {
      const design = sm.shipDesigns[i];
      if (design.old) continue;

      let copy = design.getCopy();
      let up = false;
      let newMinMax = Number.POSITIVE_INFINITY;
      copy.modules.forEach((mod) => {
        const max =
          this.maxLevel > 0
            ? Math.min(mod.module.maxLevel - 1, this.maxLevel)
            : mod.module.maxLevel - 1;
        if (mod.level < max) {
          mod.level = max;
          up = true;
        }
        if (max < newMinMax) {
          newMinMax = max;
        }
      });
      if (up) {
        copy.reload();
        //  If not valid, try to decrease module level
        if (!copy.valid) {
          copy = design.getCopy();
          up = false;
          copy.modules.forEach((mod) => {
            if (mod.level < newMinMax) {
              up = true;
              mod.level = Math.max(mod.level, newMinMax);
            }
          });
          if (up) copy.reload();
        }

        if (up && copy.valid && sm.update(design, copy)) {
          updated = true;
        }
      }
    }

    return updated;
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    if (this.maxLevel > 0) ret.ma = this.maxLevel;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("ma" in save) this.maxLevel = save.ma;
      return true;
    }
  }
  //#endregion
}
