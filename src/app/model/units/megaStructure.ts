import { SpaceStation } from "./spaceStation";
import { Game } from "../game";
import { MEGA_PRICE_MULTI } from "../CONSTANTS";
import { UNIT_TYPES } from "../data/units";
import { Worker } from "./worker";
import { IUnitData } from "../data/iUnitData";
import { Bonus } from "../bonus/bonus";
import { BonusStack } from "../bonus/bonusStack";

export class MegaStructure extends SpaceStation {
  workerMulti?: { worker: Worker; multi: number }[];
  effMulti?: { worker: Worker; multi: number }[];
  constructor(public unitData: IUnitData) {
    super(unitData);
    const rm = Game.getGame().resourceManager;
    if ("workerMulti" in unitData) {
      this.workerMulti = [];
      for (let wm of unitData.workerMulti) {
        const worker = rm.workers.find((w) => w.id === wm.workerId);
        this.workerMulti.push({ worker, multi: wm.multi });
        if (!worker.limitStackMulti) {
          worker.limitStackMulti = new BonusStack();
        }
        worker.limitStackMulti.bonuses.push(
          new Bonus(this, new Decimal(wm.multi))
        );
      }
    }
    if ("effMulti" in unitData) {
      this.effMulti = [];
      for (let ef of unitData.effMulti) {
        const worker = rm.workers.find((w) => w.id === ef.workerId);
        this.effMulti.push({ worker, multi: ef.multi });
        worker.prodEfficiency.bonuses.push(
          new Bonus(this, new Decimal(ef.multi))
        );
      }
    }
  }
  static getMegaBuildPrice(index = Number.POSITIVE_INFINITY): Decimal {
    const toDoList = Game.getGame().spaceStationManager.toDo;
    let queued = 0;

    if (toDoList.length > 0) {
      for (let i = 0, n = Math.min(index, toDoList.length); i < n; i++) {
        if (
          toDoList[i].spaceStation.unitData.unitType ===
          UNIT_TYPES.MEGASTRUCTURE
        ) {
          queued++;
        }
      }
    }
    const sm = Game.getGame().spaceStationManager;
    return Decimal.pow(MEGA_PRICE_MULTI, sm.megaBuilt.plus(queued))
      .times(sm.megaInitialPrice)
      .floor();
  }

  getBuildPrice(index = Number.POSITIVE_INFINITY): Decimal {
    return MegaStructure.getMegaBuildPrice(index);
  }
}
