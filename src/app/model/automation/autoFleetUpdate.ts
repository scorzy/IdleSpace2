import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { Game } from "../game";
import { BuildShipsJob } from "../shipyard/buildShipsJob";
import { PRICE_GROW_RATE, PRICE_GROW_RATE_2 } from "../CONSTANTS";

export class AutoFleetUpdate extends AbstractAutobuyer {
  id = "fu";
  maxRatio = 5;
  automate(): boolean {
    const game = Game.getGame();
    if (!game.resourceManager.worker.unlocked) return false;
    const sm = game.shipyardManager;
    if (sm.designerView) return false;

    const shipWorkPerSec = game.resourceManager.workProduction.prodPerSecFull
      .times(100 - game.civilianWorkPercent)
      .div(100);
    const typesMax: { typeId: number; max: number }[] = [];
    const growRate = !Game.getGame().prestigeManager.lowerModulePrice.active
      ? PRICE_GROW_RATE
      : PRICE_GROW_RATE_2;

    for (let i = 0, n = sm.shipDesigns.length; i < n; i++) {
      const design = sm.shipDesigns[i];
      if (design.old) continue;
      if (!design.fleets.some((fleet) => fleet.shipsQuantity > 0)) continue;

      let maxLevel = 10;
      const typeMax = typesMax.find((tm) => tm.typeId === design.type.id);
      if (!typeMax) {
        const job = new BuildShipsJob(1, design, 1);
        job.reloadTotalBonus();
        job.quantity = 0;
        job.design = null;
        const jobBonus = job.totalBonus;
        maxLevel = Math.floor(
          Decimal.logarithm(
            shipWorkPerSec.times(jobBonus).times(this.maxRatio / 100),
            growRate
          )
        );
        console.log(maxLevel);
        const tMax = { typeId: design.type.id, max: maxLevel };
        typesMax.push(tMax);
      } else {
        maxLevel = typeMax.max;
      }

      let copy = design.getCopy();
      let up = false;
      let newMinMax = Number.POSITIVE_INFINITY;
      copy.modules.forEach((mod) => {
        const max =
          maxLevel > 0
            ? Math.min(mod.module.maxLevel - 1, maxLevel)
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
        if (up && copy.valid) {
          sm.update(design, copy);
        }
      }
    }

    return true;
  }
  //#region Save and Load
  getSave(): any {
    const ret = super.getSave();
    if (this.maxRatio > 0) ret.mr = this.maxRatio;
    return ret;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      if ("mr" in save && typeof save.mr === "number") this.maxRatio = save.mr;
      return true;
    }
  }
  //#endregion
}
