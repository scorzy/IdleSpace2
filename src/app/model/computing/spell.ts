import { Bonus } from "../bonus/bonus";
import { ONE, ZERO } from "../CONSTANTS";
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
    this.endTime = Date.now() + this.duration;
  }
  onActivate() {}

  get quantity(): Decimal {
    if (this.active) return this.bonusQuantity;
    else return ZERO;
  }
  getAdditiveBonus(): Decimal {
    if (this.active) return this.bonusQuantity;
    else return ZERO;
  }
  getSave(): any {
    return { i: this.id, a: this.autoCastPriority };
  }
  load(data: any) {
    if (!("i" in data && data.i === this.id)) return false;
    if ("a" in data) this.autoCastPriority = data.a;
  }
}
