import { BonusStack } from "../bonus/bonusStack";
import { Spell } from "./spell";
import {
  BASE_COMPUTING,
  COMPUTING_TECH_BONUS,
  COMPUTING_MAX_CARD
} from "../CONSTANTS";
import { WarpSpell } from "./warp";
import { Research } from "../researches/research";
import { ResearchSpell } from "./researchSpell";
import { BuilderSpell } from "./builderSpell";
import { WarSpell } from "./warSpell";
import { DroneSpell } from "./droneSpell";
import { Bonus } from "../bonus/bonus";
import { Game } from "../game";

export class ComputingManager {
  currentComputing = 0;
  computingPerSec = 0;
  maxComputing: number = BASE_COMPUTING;
  computingStack = new BonusStack();
  computingStackMulti = new BonusStack();
  maxComputingStack = new BonusStack();
  spells = new Array<Spell>();
  currentSpells = new Array<Spell>();
  computingPercent = 100;
  autoCastResearch1: Research;
  autoCastResearch2: Research;
  autoCastResearch3: Research;
  autoCastResearchFull: Research;
  warpSpell: Spell;
  constructor() {
    this.warpSpell = new WarpSpell();
    const researchSpell = new ResearchSpell();
    const builderSpell = new BuilderSpell();
    const warSpell = new WarSpell();
    const droneSpell = new DroneSpell();
    this.spells = [
      this.warpSpell,
      researchSpell,
      builderSpell,
      warSpell,
      droneSpell
    ];
    this.currentSpells = [this.warpSpell];

    this.computingStackMulti.bonuses.push(
      new Bonus(
        Game.getGame().researchManager.computingTech,
        new Decimal(COMPUTING_TECH_BONUS)
      )
    );
    const rm = Game.getGame().researchManager;
    rm.researches.forEach((res) => {
      if (res.computingPerSec > 0) {
        this.computingStack.bonuses.push(
          new Bonus(res, new Decimal(res.computingPerSec))
        );
      }
    });
    this.autoCastResearch1 = rm.researches.find((res) => res.id === "c");
    this.autoCastResearch2 = rm.researches.find((res) => res.id === "c1");
    this.autoCastResearch3 = rm.researches.find((res) => res.id === "c2");
    this.autoCastResearchFull = rm.researches.find((res) => res.id === "c3");

    this.autoCastResearch1.description = "Unlock auto casting";
    this.autoCastResearch2.description = "Unlock secondary auto casting";
    this.autoCastResearch3.description = "Unlock third auto casting";
    this.autoCastResearchFull.description =
      "Level 1 auto casting start casting on full computing";
  }
  update(delta: number) {
    //#region Computing
    this.maxComputingStack.reloadAdditiveBonus();
    this.maxComputing =
      BASE_COMPUTING + this.maxComputingStack.totalAdditiveBonus.toNumber();
    if (Game.getGame().prestigeManager.moreComputing.active) {
      this.maxComputing += this.maxComputing * COMPUTING_MAX_CARD;
    }

    this.computingStack.reloadAdditiveBonus();
    this.computingStackMulti.reloadBonus();
    this.computingPerSec =
      10 + this.computingStack.totalAdditiveBonus.toNumber();
    this.computingPerSec *= this.computingStackMulti.totalBonus.toNumber();

    this.currentComputing += delta * this.computingPerSec;
    this.currentComputing = Math.min(this.currentComputing, this.maxComputing);
    this.computingPercent = Math.floor(
      (100 * this.currentComputing) / this.maxComputing
    );
    //#endregion
    //#region Update spells status
    const now = Date.now();
    for (let i = 0, n = this.currentSpells.length; i < n; i++) {
      if (this.currentSpells[i].endTime < now) {
        this.currentSpells[i].active = false;
      }

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
    //#endregion
    //#region Auto Cast
    let nextLevelOk = true;
    let oneLv1 =
      this.currentSpells.findIndex(
        (sp) => sp.autoCastPriority === 1 && sp.active
      ) > 0;
    for (let i = 1; i < 5; i++) {
      if (this.currentSpells.findIndex((sp) => sp.autoCastPriority === i) < 0) {
        break;
      }
      for (let k = 0, n = this.currentSpells.length; k < n; k++) {
        if (this.currentSpells[k].autoCastPriority !== i) continue;
        if (
          !this.currentSpells[k].active &&
          (i !== 1 ||
            oneLv1 ||
            this.autoCastResearchFull.level < 1 ||
            this.currentComputing >= this.maxComputing)
        ) {
          this.currentSpells[k].activate();
          if (
            this.currentSpells[k].autoCastPriority === 1 &&
            this.currentSpells[k].active
          ) {
            oneLv1 = true;
          }
        }

        nextLevelOk = nextLevelOk && this.currentSpells[k].active;
      }
      if (!nextLevelOk) break;
    }
    //#endregion
  }
  addSpell(spell: Spell) {
    if (this.currentSpells.findIndex((s) => s.id === spell.id) > -1) {
      return false;
    }
    this.currentSpells.push(spell);
  }
  prestige() {
    const now = Date.now();
    this.currentSpells.forEach((spell) => {
      spell.endTime = now;
      spell.active = false;
    });
    this.currentSpells = [this.warpSpell];
    this.currentComputing = 0;
  }
  //#region Save and Load
  getSave(): any {
    return {
      c: this.currentComputing,
      s: this.currentSpells.map((sp) => sp.getSave())
    };
  }
  load(data: any) {
    if ("c" in data) this.currentComputing = data.c;
    if ("s" in data) {
      for (let i = 0, n = data.s.length; i < n; i++) {
        const spell = this.spells.find((sp) => sp.id === data.s[i]?.i);
        if (spell && this.currentSpells.findIndex((s) => s === spell) < 0) {
          this.currentSpells.push(spell);
          spell.load(data.s[i]);
        }
      }
    }
  }
  //#endregion
}
