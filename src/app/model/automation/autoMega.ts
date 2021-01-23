import { AbstractAutobuyer } from "./abstractAutoBuyer";
import { MegaStructure } from "../units/megaStructure";
import { Game } from "../game";
import isString from "lodash-es/isString";
import isArray from "lodash-es/isArray";
import { MegaStructureJob } from "../space/megaStructureJob";

export class AutoMega extends AbstractAutobuyer {
  megaQueue: Array<{ mega: MegaStructure; quantity: number }>;
  constructor() {
    super();
    this.id = "mQ";
    this.interval = 0.001;
    this.megaQueue = new Array<{ mega: MegaStructure; quantity: number }>();
  }
  /**
   * Queue one megastructure at time.
   */
  automate(): boolean {
    if (!Game.getGame().prestigeManager.megaAutomationCard.active) return false;
    if (this.megaQueue.length < 1) return false;
    if (Game.getGame().resourceManager.unlockedMegastructures.length < 1) {
      return false;
    }

    const sp = Game.getGame().spaceStationManager;
    if (sp.toDo.some((j) => j instanceof MegaStructureJob)) return false;

    let toQueue: MegaStructure;
    for (let i = 0, n = this.megaQueue.length; i < n; i++) {
      if (
        this.megaQueue[i].mega &&
        this.megaQueue[i].mega.quantity.lt(this.megaQueue[i].quantity)
      ) {
        toQueue = this.megaQueue[i].mega;
        break;
      }
    }
    if (toQueue && toQueue.unlocked) {
      return sp.addJob(toQueue);
    } else {
      return false;
    }
  }
  getSave(): any {
    const save = super.getSave();
    save.Q = this.megaQueue
      .filter((m) => m.mega)
      .map((m) => ({
          m: m.mega.id,
          q: m.quantity
        }));
    return save;
  }
  load(save: any): boolean {
    if (super.load(save)) {
      this.megaQueue = [];
      if ("Q" in save && isArray(save.Q)) {
        for (const megaQ of save.Q) {
          if ("m" in megaQ && isString(megaQ.m)) {
            const megaStru = Game.getGame().resourceManager.megastructures.find(
              (m) => m.id === megaQ.m
            );
            const quantity = megaQ?.q ?? 1;
            if (megaStru) {
              this.megaQueue.push({
                mega: megaStru,
                quantity
              });
            }
          }
        }
      }
      return true;
    }
  }
}
