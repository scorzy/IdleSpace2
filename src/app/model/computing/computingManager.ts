import { BonusStack } from "../bonus/bonusStack";
import { Spell } from "./spell";
import { BASE_COMPUTING } from "../CONSTANTS";
import { WarpSpell } from "./warp";

export class ComputingManager {
  currentComputing: number = 0;
  computingPerSec: number = 0;
  maxComputing: number = BASE_COMPUTING;
  computingStack = new BonusStack();
  maxComputingStack = new BonusStack();
  spells = new Array<Spell>();
  currentSpells = new Array<Spell>();
  constructor() {
    const warpSpell = new WarpSpell();
    this.spells = [warpSpell];
    this.currentSpells = [warpSpell];
  }
  update(delta: number) {
    this.maxComputingStack.reloadAdditiveBonus();
    this.maxComputing =
      BASE_COMPUTING + this.maxComputingStack.totalAdditiveBonus.toNumber();

    this.computingStack.reloadAdditiveBonus();
    this.computingPerSec =
      10 + this.computingStack.totalAdditiveBonus.toNumber();
    this.currentComputing += delta * this.computingPerSec;
    this.currentComputing = Math.min(this.currentComputing, this.maxComputing);

    const now = Date.now();
    for (let i = 0, n = this.currentSpells.length; i < n; i++) {
      if (this.currentSpells[i].endTime < now)
        this.currentSpells[i].active = false;

      this.currentSpells[i].canAfford =
        !this.currentSpells[i].active &&
        this.currentSpells[i].price >= this.currentComputing;
    }
  }

  //#region Save and Load
  getSave(): any {
    return { c: this.currentComputing };
  }
  load(data: any) {
    if ("c" in data) this.currentComputing = data.c;
  }
  //#endregion
}
