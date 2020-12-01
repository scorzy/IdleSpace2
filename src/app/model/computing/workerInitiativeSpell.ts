import { Spell } from "./spell";
import { Building } from "../units/building";
import { Worker } from "../units/worker";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
export class WorkerInitiativeSpell extends Spell {
  duration = 60 * 5 * 1e3;
  constructor(public worker: Worker, public building: Building) {
    super();
    this.id = this.worker.id + "I";
    this.name = this.worker.name + " initiative";
    this.description =
      worker.name + " yeilds 40% more, +2% per " + building.name;
    this.icon = this.worker.icon;
    this.colorClass = this.worker.colorClass;

    const game = Game.getGame();
    worker.prodEfficiency.bonuses.push(
      new Bonus(this, new Decimal(0.4), null, building, new Decimal(0.02))
    );
  }
}
