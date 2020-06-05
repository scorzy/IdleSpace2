import { JobManager } from "../job/jobManager";
import { SpaceStationJob } from "./spaceStationJob";
import { Game } from "../game";
import { SpaceStation } from "../units/spaceStation";
import {
  ONE,
  SPACE_STATION_GROW,
  SPACE_STATION_PRICE,
  ZERO
} from "../CONSTANTS";
import { MegaStructure } from "../units/megaStructure";

export class SpaceStationManager extends JobManager {
  toDo = new Array<SpaceStationJob>();
  done = new Array<SpaceStationJob>();
  megaInitialPrice = ONE;
  nextMegaPrice = ONE;
  megaBuilt = ZERO;
  constructor() {
    super();
    this.megaInitialPrice = Decimal.pow(
      SPACE_STATION_GROW,
      Game.getGame().resourceManager.spaceStations.length
    ).times(SPACE_STATION_PRICE);
    this.nextMegaPrice = this.megaInitialPrice;
  }
  postUpdate() {
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reloadTotalBonus();
      this.toDo[i].reload();
    }
    this.nextMegaPrice = MegaStructure.getMegaBuildPrice();
  }
  addJob(unit: SpaceStation) {
    if (!unit) {
      return false;
    }
    const job = new SpaceStationJob(unit);
    this.toDo.push(job);
    Game.getGame().reloadWorkPerSec();
    unit.reloadBuildPrice();
    job.reloadTotalBonus();
    job.reload();
  }
  //#region Save and Load
  getSave() {
    return {
      t: this.toDo.map((s) => s.getSave())
    };
  }
  load(data: any) {
    if (!("t" in data)) {
      return false;
    }
    const rs = Game.getGame().resourceManager;
    data.t.forEach((jobData) => {
      const unit = rs.spaceStations.find((s) => s.id === jobData.i);
      if (unit) {
        const job = new SpaceStationJob(unit);
        job.load(jobData);
        this.toDo.push(job);
      }
    });
    this.megaBuilt = rs.megastructures.reduce(
      (prev, next) => prev.plus(next.quantity),
      ZERO
    );
  }
  //#endregion
}
