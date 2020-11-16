import { JobManager } from "../job/jobManager";
import { SpaceStationJob } from "./spaceStationJob";
import { Game } from "../game";
import { SpaceStation } from "../units/spaceStation";
import {
  ONE,
  ZERO
} from "../CONSTANTS";
import { MegaStructure } from "../units/megaStructure";
import { AbstractSpaceStation } from "../units/abstractSpaceStation";
import { CivilianJob } from "./civilianJob";
import { MegaStructureJob } from "./megaStructureJob";
import { Bonus } from "../bonus/bonus";

export class SpaceStationManager extends JobManager {
  toDo = new Array<CivilianJob>();
  done = new Array<CivilianJob>();
  megaInitialPrice = ONE;
  nextMegaPrice = ONE;
  megaBuilt = ZERO;
  commonBonuses: Bonus[];
  stationsBonuses: Bonus[];
  megaBonuses: Bonus[];
  sort = false;
  megastructureQueue: MegaStructure[];
  constructor() {
    super();
    this.megastructureQueue = new Array<MegaStructure>();
    // this.megaInitialPrice = Decimal.pow(SPACE_STATION_GROW, 7).times(
    //   SPACE_STATION_PRICE
    // );
    this.megaInitialPrice = new Decimal(1e12);
    this.nextMegaPrice = this.megaInitialPrice;
    this.commonBonuses = new Array<Bonus>();
    this.stationsBonuses = new Array<Bonus>();
    this.megaBonuses = new Array<Bonus>();
  }
  postUpdate() {
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reloadTotalBonus();
      this.toDo[i].reload();
    }
    this.nextMegaPrice = MegaStructure.getMegaBuildPrice();
  }
  addJob(unit: AbstractSpaceStation): boolean {
    if (!unit) {
      return false;
    }
    let job: CivilianJob;
    if (unit instanceof MegaStructure) {
      job = new MegaStructureJob(unit);
    } else if (unit instanceof SpaceStation) {
      job = new SpaceStationJob(unit);
    } else {
      job = new CivilianJob(unit);
    }

    this.toDo.push(job);
    Game.getGame().reloadWorkPerSec();
    unit.reloadBuildPrice();
    job.reloadTotalBonus();
    job.reload();
    this.sortJobs();

    return true;
  }
  prestige() {
    this.toDo = [];
    this.done = [];
    this.megaInitialPrice = ONE;
    this.nextMegaPrice = ONE;
    this.megaBuilt = ZERO;
  }
  sortJobs() {
    this.toDo = this.toDo.sort((a, b) =>
      a.getRemaining().cmp(b.getRemaining())
    );
  }
  //#region Save and Load
  getSave() {
    const ret: any = {
      t: this.toDo.map((s) => s.getSave()),
      S: this.sort
    };
    if (this.megastructureQueue && this.megastructureQueue.length > 0) {
      ret.mq = this.megastructureQueue.map((m) => m.id);
    }
    return ret;
  }
  load(data: any) {
    if (!("t" in data)) {
      return false;
    }
    if ("S" in data && typeof data.S === "boolean") this.sort = data.S;

    const rs = Game.getGame().resourceManager;
    this.megaBuilt = rs.megastructures.reduce(
      (prev, next) => prev.plus(next.quantity),
      ZERO
    );
    this.megastructureQueue = new Array<MegaStructure>();
    if ("mq" in data) {
      for (const mId of data.mq) {
        const megastructure = rs.megastructures.find((s) => s.id === mId);
        if (megastructure) {
          this.megastructureQueue.push(megastructure);
        }
      }
    }
    data.t.forEach((jobData) => {
      const unit =
        rs.spaceStations.find((s) => s.id === jobData.i) ||
        rs.megastructures.find((s) => s.id === jobData.i);
      if (unit) {
        let job: CivilianJob;
        if (unit instanceof MegaStructure) {
          job = new MegaStructureJob(unit);
        } else if (unit instanceof SpaceStation) {
          job = new SpaceStationJob(unit);
        } else {
          job = new CivilianJob(unit);
        }

        job.load(jobData);
        this.toDo.push(job);
      }
    });
  }
  //#endregion
}
