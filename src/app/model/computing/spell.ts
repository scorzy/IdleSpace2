import { ONE, ZERO, SPELL_DURATION_CARD } from "../CONSTANTS";
import { Game } from "../game";
import { IBase } from "../iBase";

export class Spell implements IBase {
  id: string;
  icon: string;
  colorClass: string;
  name: string;
  description: string;
  endTime: number;
  active = false;
  bonusQuantity = ONE;
  price = 1000;
  canAfford = false;
  duration = 30;
  percent = 0;
  autoCastPriority = 0;
  activate() {
    if (this.active) return false;
    const cp = Game.getGame().computingManager;
    if (cp.currentComputing < this.price) return false;
    cp.currentComputing -= this.price;
    this.onActivate();
    this.active = true;
    this.endTime = Date.now() + this.getDuration();
  }
  getDuration(): number {
    return (
      this.duration *
      (Game.getGame().prestigeManager.longerSpells.active
        ? 1 + SPELL_DURATION_CARD
        : 1)
    );
  }
  onActivate() {}

  get quantity(): Decimal {
    if (this.active && !Game.getGame().firstUpdate) return this.bonusQuantity;
    else return ZERO;
  }
  getAdditiveBonus(): Decimal {
    if (this.active) return this.bonusQuantity;
    else return ZERO;
  }
  getSave(): any {
    return { i: this.id, a: this.autoCastPriority, p: this.percent };
  }
  load(data: any) {
    if (!("i" in data && data.i === this.id)) return false;
    if ("a" in data) this.autoCastPriority = data.a;
    if ("p" in data) {
      this.active = true;
      this.endTime = Date.now() + (this.getDuration() * (100 - data.p)) / 100;
    }
  }
}
