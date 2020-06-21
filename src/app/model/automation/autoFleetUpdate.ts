import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";

export class AutoFleetUpdate extends AbstractAutobuyer {
  automate(): boolean {
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
        if (mod.level < mod.module.maxLevel - 1) {
          mod.level = mod.module.maxLevel - 1;
          up = true;
          if (mod.module.maxLevel - 1 < newMinMax)
            newMinMax = mod.module.maxLevel - 1;
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
}
