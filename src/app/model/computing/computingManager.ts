import { BonusStack } from "../bonus/bonusStack";
import { Spell } from "./spell";
import { BASE_COMPUTING } from "../CONSTANTS";
import { WarpSpell } from "./warp";
import { Research } from "../researches/research";
import { ResearchSpell } from "./researchSpell";

export class ComputingManager {
  currentComputing: number = 0;
  computingPerSec: number = 0;
  maxComputing: number = BASE_COMPUTING;
  computingStack = new BonusStack();
  maxComputingStack = new BonusStack();
  spells = new Array<Spell>();
  currentSpells = new Array<Spell>();
  computingPercent = 100;
  constructor() {
    const warpSpell = new WarpSpell();
    const researchSpell = new ResearchSpell();
    this.spells = [warpSpell, researchSpell];
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
    this.computingPercent = Math.floor(
      (100 * this.currentComputing) / this.maxComputing
    );

    const now = Date.now();
    for (let i = 0, n = this.currentSpells.length; i < n; i++) {
      if (this.currentSpells[i].endTime < now)
        this.currentSpells[i].active = false;

      if (this.currentSpells[i].active) {
        this.currentSpells[i].percent = Math.floor(
          100 -
            (100 * (this.currentSpells[i].endTime - now)) /
              this.currentSpells[i].duration
        );
      } else {
        this.currentSpells[i].percent = 100;
      }

      this.currentSpells[i].canAfford =
        !this.currentSpells[i].active &&
        this.currentSpells[i].price <= this.currentComputing;
    }
  }
  addSpell(spell: Spell) {
    if (this.currentSpells.findIndex((s) => s.id === spell.id) > -1)
      return false;
    this.currentSpells.push(spell);
  }

  //#region Save and Load
  getSave(): any {
    return {
      c: this.currentComputing,
      s: this.currentSpells.map((sp) => sp.id)
    };
  }
  load(data: any) {
    if ("c" in data) this.currentComputing = data.c;
    if ("s" in data) {
      for (let i = 0, n = data.s.length; i < n; i++) {
        const spell = this.spells.find((sp) => sp.id === data.s[i]);
        if (spell?.id !== "1") {
          this.currentSpells.push(spell);
        }
      }
    }
  }
  //#endregion
}
