import { Bonus } from "../bonus/bonus";
import { ONE, ZERO } from "../CONSTANTS";
import { Game } from "../game";
import { IBase } from "../iBase";

export class Spell implements IBase {
  id: string;
  quantity: Decimal;
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
  getBonus(): Decimal {
    if (this.active) return this.bonusQuantity;
    else return ONE;
  }
  getAdditiveBonus(): Decimal {
    if (this.active) return this.bonusQuantity;
    else return ZERO;
  }
}
