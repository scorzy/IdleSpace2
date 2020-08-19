import { Module } from "./module";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./ShipType";
import { SHIP_TYPES } from "../data/shipTypes";
import { modules } from "../data/modulesData";
import { JobManager } from "../job/jobManager";
import { Game } from "../game";
import { FLEET_NUMBER, FLEET_CAPACITY } from "../CONSTANTS";
import { BuildShipsJob } from "./buildShipsJob";
import { Job } from "../job/job";
import { UpdateShipJob } from "./updateShipJob";
import { BattleResult } from "../battle/battleResult";
import { FIRST_DRONE } from "../data/shipsData";
import sample from "lodash-es/sample";
import { BonusStack } from "../bonus/bonusStack";
import { Bonus } from "../bonus/bonus";

const MAX_DESIGN = 20;

export class ShipyardManager extends JobManager {
  shipDesigns = new Array<ShipDesign>();
  modules = new Array<Module>();
  shipTypes = new Array<ShipType>();
  fleetsCapacity = new Array<number>(FLEET_NUMBER);
  fleetsCapacityUi = new Array<number>(FLEET_NUMBER);
  fleetsPercent = new Array<number>(FLEET_NUMBER);
  fleetNavCapPriority = new Array<number>(FLEET_NUMBER);
  fleetNavCapPriorityUi = new Array<number>(FLEET_NUMBER);
  weapons = new Array<Module>();
  allWeapons = new Array<Module>();
  defences = new Array<Module>();
  allDefences = new Array<Module>();
  generators = new Array<Module>();
  allGenerators = new Array<Module>();
  allOthers = new Array<Module>();
  others = new Array<Module>();
  allThrusters = new Array<Module>();
  thrusters = new Array<Module>();
  groups: {
    name: string;
    list: Array<Module>;
    all: Array<Module>;
    id: number;
  }[];
  toDo = new Array<Job>();
  armour: Module;
  shield: Module;
  designerView = false;
  shipyardPage = false;
  unlockedModules = true;
  velocityBonusStack = new BonusStack();
  accelerationStack = new BonusStack();
  autoReinforce = false;
  constructor() {
    super();
    this.fleetNavCapPriority.fill(0);
    this.fleetNavCapPriority[0] = 100;
    this.fleetNavCapPriorityUi.fill(0);
    this.fleetNavCapPriorityUi[0] = 100;
  }
  init() {
    this.shipTypes = SHIP_TYPES.map((s) => new ShipType(s));
    this.modules = modules.map((m) => {
      const mod = new Module();
      mod.init(m);
      return mod;
    });
    this.armour = this.modules.find((m) => m.id === "A");
    this.shield = this.modules.find((m) => m.id === "s");
    this.allWeapons = this.modules.filter((mod) => mod.damage > 0);
    this.allGenerators = this.modules.filter((mod) => mod.energy > 0);
    this.allDefences = this.modules.filter(
      (mod) =>
        mod.armour > 0 ||
        mod.shield > 0 ||
        mod.armourDamageReduction > 0 ||
        mod.shieldDamageReduction > 0
    );
    this.allThrusters = this.modules.filter(
      (mod) => mod.velocity > 0 || mod.acceleration > 0
    );
    this.allOthers = this.modules.filter(
      (mod) =>
        this.allWeapons.findIndex((w) => w.id === mod.id) < 0 &&
        this.allDefences.findIndex((w) => w.id === mod.id) < 0 &&
        this.allThrusters.findIndex((w) => w.id === mod.id) < 0 &&
        this.allGenerators.findIndex((w) => w.id === mod.id) < 0
    );
    this.reloadLists();
    this.groups.forEach((group) => {
      group.all.forEach((mod) => {
        mod.groupId = group.id;
      });
    });
  }
  afterResearchesInit() {
    const rm = Game.getGame().researchManager;
    rm.researches.forEach((res) => {
      if (res?.speedMulti > 0) {
        this.velocityBonusStack.bonuses.push(
          new Bonus(res, new Decimal(res.speedMulti))
        );
      }
      if (res?.accelerationMulti > 0) {
        this.accelerationStack.bonuses.push(
          new Bonus(res, new Decimal(res.accelerationMulti))
        );
      }
    });
    this.unlockDefaultModules();
  }
  unlockDefaultModules() {
    this.modules.forEach((mod) => {
      if (!mod.research) {
        mod.unlock();
        mod.reloadMaxLevel();
      }
    });
  }
  addDesign(name: string, type: number): number {
    if (this.shipDesigns.length >= MAX_DESIGN) {
      return -1;
    }

    const shipType = this.shipTypes.find((t) => t.id === type);
    if (!shipType) {
      return -1;
    }

    const shipDesign = new ShipDesign();
    shipDesign.id = 1;
    for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
      if (this.shipDesigns[i].id >= shipDesign.id) {
        shipDesign.id = this.shipDesigns[i].id + 1;
      }
    }
    if (shipDesign.id !== 1) {
      shipDesign.fleets.forEach((fl) => {
        fl.navalCapPercent = 0;
        fl.navalCapPercentUi = 0;
      });
    }

    shipDesign.name = name;
    shipDesign.type = shipType;
    shipDesign.reload();
    this.shipDesigns.push(shipDesign);
    return shipDesign.id;
  }
  postUpdate() {
    let oldSpeed = this.velocityBonusStack.totalBonus;
    let oldAcc = this.accelerationStack.totalBonus;
    this.velocityBonusStack.reloadBonus();
    this.accelerationStack.reloadBonus();
    if (
      !oldSpeed.eq(this.velocityBonusStack.totalBonus) ||
      !oldAcc.eq(this.accelerationStack.totalBonus)
    ) {
      for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
        this.shipDesigns[i].reload();
      }
    }
    this.reloadFleetPercent();
    if (this.unlockedModules) {
      this.reloadLists();
      this.unlockedModules = false;
    }
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      this.toDo[i].reloadTotalBonus();
      this.toDo[i].reload();
    }
    for (let i = this.toDo.length - 1; i > 0; i--) {
      const job = this.toDo[i];
      if (
        (job instanceof BuildShipsJob && job.quantity < 1) ||
        (job instanceof UpdateShipJob && (job.toUpdate < 1 || !job.design.old))
      ) {
        this.toDo.splice(i, 1);
      }
    }
    for (let i = 0, n = this.modules.length; i < n; i++) {
      this.modules[i].reloadMaxLevel();
    }
    for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
      this.shipDesigns[i].reload(false);
    }
    if (this.autoReinforce) {
      this.reinforceAll();
    }
  }
  reloadLists() {
    this.weapons = this.allWeapons.filter((mod) => mod.unlocked);
    this.defences = this.allDefences.filter((mod) => mod.unlocked);
    this.generators = this.allGenerators.filter((mod) => mod.unlocked);
    this.thrusters = this.allThrusters.filter((m) => m.unlocked);
    this.others = this.allOthers.filter((mod) => mod.unlocked);
    this.groups = [
      { name: "Weapons", list: this.weapons, id: 1, all: this.allWeapons },
      { name: "Defences", list: this.defences, id: 2, all: this.allDefences },
      {
        name: "Generators",
        list: this.generators,
        id: 3,
        all: this.allGenerators
      },
      {
        name: "Thrusters",
        list: this.thrusters,
        id: 4,
        all: this.allThrusters
      },
      { name: "Others", list: this.others, id: 5, all: this.allOthers }
    ];
  }
  update(oldDesign: ShipDesign, newDesign: ShipDesign): boolean {
    if (!(newDesign && oldDesign)) {
      return false;
    }
    if (oldDesign.old) {
      return false;
    }

    newDesign.modules = newDesign.modules.filter((line) => line.module);
    newDesign.id = oldDesign.id;
    newDesign.rev = oldDesign.rev + 1;
    newDesign.next = oldDesign.next;
    oldDesign.next = null;

    newDesign.reloadAvailability();
    if (!newDesign.available) {
      this.deleteJobs(oldDesign);
      this.deleteJobs(newDesign);
    }

    if (
      newDesign.price.lte(oldDesign.price) ||
      oldDesign.fleets.findIndex((fl) => fl.shipsQuantity > 0) < 0
    ) {
      //  Lower price
      //  Instant update
      newDesign.fleets = oldDesign.fleets;
    } else {
      //  Higher price
      //  Regular update
      for (let i = 0; i < FLEET_NUMBER; i++) {
        newDesign.fleets[i].navalCapPercent =
          oldDesign.fleets[i].navalCapPercent;
        newDesign.fleets[i].navalCapPercentUi =
          oldDesign.fleets[i].navalCapPercentUi;
      }
      newDesign.old = oldDesign;
      for (let i = 0, n = this.toDo.length; i < n; i++) {
        const toDo = this.toDo[i];
        if (toDo instanceof BuildShipsJob && toDo.design === oldDesign) {
          toDo.design = newDesign;
        }
      }
      const upJob = new UpdateShipJob(newDesign);
      this.toDo.push(upJob);
      if (this.toDo.length === 1) {
        Game.getGame().reloadWorkPerSec();
      }
      upJob.reload();
      upJob.reloadTotalBonus();
    }
    oldDesign.old = null;
    const index = this.shipDesigns.indexOf(oldDesign);
    if (index > -1) {
      this.shipDesigns[index] = newDesign;
    }

    this.shipDesigns.forEach((des) => {
      if (des.next && des.next.id === newDesign.id) {
        des.next = newDesign;
      }
    });

    return true;
  }
  /**
   * Calculate fleets capacity and num of ships to build
   */
  reloadFleetCapacity() {
    for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
      this.shipDesigns[k].reloadAvailability();
    }
    //#region Reload ships number
    //  Reload Fleet capacity
    const navalCapacity = Game.getGame().navalCapacity;
    let sum = 0;
    for (let i = 0; i < FLEET_NUMBER; i++) {
      sum += Math.max(this.fleetNavCapPriority[i], 0);
    }
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.fleetsCapacity[i] =
        (navalCapacity * Math.max(this.fleetNavCapPriority[i], 0)) / sum;
    }

    for (let i = 0; i < FLEET_NUMBER; i++) {
      if (this.fleetsCapacity[i] < 1) {
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          this.shipDesigns[k].fleets[i].wantedShips = 0;
        }
      } else {
        let prioritySum = 0;
        let remainingNavCap = this.fleetsCapacity[i];
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          prioritySum +=
            this.shipDesigns[k].available &&
            (!this.shipDesigns[k].next || !this.shipDesigns[k].next.available)
              ? Math.max(0, this.shipDesigns[k].fleets[i].navalCapPercent)
              : 0;
        }
        prioritySum = Math.max(1, prioritySum);
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          if (
            this.shipDesigns[k].available &&
            (!this.shipDesigns[k].next || !this.shipDesigns[k].next.available)
          ) {
            this.shipDesigns[k].fleets[i].wantedShips = Math.floor(
              (this.fleetsCapacity[i] *
                this.shipDesigns[k].fleets[i].navalCapPercent) /
                (prioritySum * this.shipDesigns[k].type.navalCapacity)
            );
          } else {
            this.shipDesigns[k].fleets[i].wantedShips = 0;
          }
          remainingNavCap -= Math.floor(
            this.shipDesigns[k].fleets[i].wantedShips *
              this.shipDesigns[k].type.navalCapacity
          );
        }
        if (remainingNavCap > 0) {
          const ordered = this.shipDesigns
            .filter(
              (s) =>
                s.fleets[i].navalCapPercent > 0 &&
                s.available &&
                !(s.next && s.next.available)
            )
            .sort(
              (a, b) =>
                b.fleets[i].navalCapPercent - a.fleets[i].navalCapPercent
            );
          for (let z = 0, n2 = ordered.length; z < n2; z++) {
            if (ordered[z].type.navalCapacity <= remainingNavCap) {
              const toAdd = Math.floor(
                remainingNavCap / ordered[z].type.navalCapacity
              );
              ordered[z].fleets[i].wantedShips += toAdd;
              remainingNavCap -= toAdd * ordered[z].type.navalCapacity;
            }
          }
        }
      }
      for (let p = 0, n = this.shipDesigns.length; p < n; p++) {
        this.shipDesigns[p].fleets[i].shipsQuantity = Math.min(
          this.shipDesigns[p].fleets[i].shipsQuantity,
          this.shipDesigns[p].fleets[i].wantedShips
        );
      }
    }
    //#endregion
    //#region Ui temp
    if (!this.shipyardPage) return;
    sum = 0;
    for (let i = 0; i < FLEET_NUMBER; i++) {
      sum += Math.min(
        FLEET_CAPACITY,
        Math.max(this.fleetNavCapPriorityUi[i], 0)
      );
    }

    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.fleetsCapacityUi[i] =
        (navalCapacity * Math.max(this.fleetNavCapPriorityUi[i], 0)) / sum;
    }
    //  Reload ships number
    for (let i = 0; i < FLEET_NUMBER; i++) {
      if (this.fleetsCapacityUi[i] < 1) {
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          this.shipDesigns[k].fleets[i].wantedShipsUi = 0;
        }
      } else {
        let prioritySumUi = 0;
        let remainingNavCapUi = this.fleetsCapacityUi[i];
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          prioritySumUi +=
            this.shipDesigns[k].available &&
            (!this.shipDesigns[k].next || !this.shipDesigns[k].next.available)
              ? Math.max(0, this.shipDesigns[k].fleets[i].navalCapPercentUi)
              : 0;
        }
        prioritySumUi = Math.max(1, prioritySumUi);
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          if (
            this.shipDesigns[k].available &&
            (!this.shipDesigns[k].next || !this.shipDesigns[k].next.available)
          ) {
            this.shipDesigns[k].fleets[i].wantedShipsUi = Math.floor(
              (this.fleetsCapacityUi[i] *
                Math.max(0, this.shipDesigns[k].fleets[i].navalCapPercentUi)) /
                (prioritySumUi * this.shipDesigns[k].type.navalCapacity)
            );
          } else {
            this.shipDesigns[k].fleets[i].wantedShipsUi = 0;
          }
          remainingNavCapUi -= Math.floor(
            this.shipDesigns[k].fleets[i].wantedShipsUi *
              this.shipDesigns[k].type.navalCapacity
          );
        }
        if (remainingNavCapUi > 0) {
          const ordered = this.shipDesigns
            .filter(
              (s) =>
                s.fleets[i].navalCapPercentUi > 0 &&
                s.available &&
                !(s.next && s.next.available)
            )
            .sort(
              (a, b) =>
                b.fleets[i].navalCapPercentUi - a.fleets[i].navalCapPercentUi
            );
          for (let k = 0, n = ordered.length; k < n; k++) {
            if (ordered[k].type.navalCapacity <= remainingNavCapUi) {
              const toAdd = Math.floor(
                remainingNavCapUi / ordered[k].type.navalCapacity
              );
              ordered[k].fleets[i].wantedShipsUi += toAdd;
              remainingNavCapUi -= toAdd * ordered[k].type.navalCapacity;
            }
          }
        }
      }
    }
    //#endregion
  }
  reinforceAll() {
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.reinforce(i);
    }
  }
  reinforce(fleetNum: number) {
    const i = fleetNum;
    for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
      this.shipDesigns[k].fleets[i].shipsQuantity = Math.min(
        this.shipDesigns[k].fleets[i].shipsQuantity,
        this.shipDesigns[k].fleets[i].wantedShips
      );
      if (this.shipDesigns[k].old) {
        this.shipDesigns[k].old.fleets[i].shipsQuantity = Math.max(
          Math.min(
            this.shipDesigns[k].old.fleets[i].shipsQuantity,
            this.shipDesigns[k].fleets[i].wantedShips -
              this.shipDesigns[k].fleets[i].shipsQuantity
          ),
          0
        );
      }

      let toBuild =
        this.shipDesigns[k].fleets[i].wantedShips -
        this.shipDesigns[k].fleets[i].shipsQuantity;
      if (this.shipDesigns[k].old) {
        toBuild -= this.shipDesigns[k].old.fleets[i].shipsQuantity;
      }
      for (let h = 0, l = this.toDo.length; h < l; h++) {
        const job = this.toDo[h];
        if (
          job instanceof BuildShipsJob &&
          job.fleetNum === i &&
          job.design === this.shipDesigns[k]
        ) {
          toBuild -= job.quantity - job.built;
        }
      }
      if (toBuild > 0) {
        let job: BuildShipsJob;
        if (this.toDo.length > 0) {
          const sameJob = this.toDo.find(
            (j) =>
              j instanceof BuildShipsJob &&
              j.design === this.shipDesigns[k] &&
              j.fleetNum === fleetNum &&
              j.progress.lte(1)
          );
          if (sameJob && sameJob instanceof BuildShipsJob) {
            job = sameJob;
            job.quantity += toBuild;
          }
        }
        if (!job) {
          job = new BuildShipsJob(toBuild, this.shipDesigns[k], i);
          this.toDo.push(job);
        }

        if (this.toDo.length === 1) {
          Game.getGame().reloadWorkPerSec();
        }
        job.reload();
        job.reloadTotalBonus();
      }
    }
  }
  delete(design: ShipDesign) {
    this.deleteJobs(design);
    this.shipDesigns.splice(
      this.shipDesigns.findIndex((d) => d === design),
      1
    );
  }
  deleteJobs(design: ShipDesign) {
    for (let i = this.toDo.length - 1; i >= 0; i--) {
      const job = this.toDo[i];
      if (
        (job instanceof BuildShipsJob && job.design === design) ||
        (job instanceof UpdateShipJob && job.design === design)
      ) {
        this.toDo.splice(i, 1);
      }
    }
  }
  onBattleEnd(battleResult: BattleResult, fleetNum: number) {
    for (let i = 0, n = battleResult.playerLost.length; i < n; i++) {
      const id = Math.abs(battleResult.playerLost[i].id);
      let design = this.shipDesigns.find((des) => des.id === id);
      const designNoOld = design;
      let lost = battleResult.playerLost[i].lost;
      if (battleResult.playerLost[i].id < 0) {
        design = design.old;
      }
      if (design) {
        design.fleets[fleetNum].shipsQuantity -= lost;
        if (design.fleets[fleetNum].shipsQuantity < 0) {
          lost = Math.abs(design.fleets[fleetNum].shipsQuantity);
          designNoOld.fleets[fleetNum].shipsQuantity -= lost;
          designNoOld.fleets[fleetNum].shipsQuantity = Math.floor(
            Math.max(designNoOld.fleets[fleetNum].shipsQuantity, 0)
          );
        }
        design.fleets[fleetNum].shipsQuantity = Math.floor(
          Math.max(design.fleets[fleetNum].shipsQuantity, 0)
        );
      }
    }
  }
  reloadFleetPercent() {
    for (let fleet = 0; fleet < FLEET_NUMBER; fleet++) {
      let total = 0;
      let used = 0;
      for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
        const navCap = this.shipDesigns[i].type.navalCapacity;
        total += this.shipDesigns[i].fleets[fleet].wantedShips * navCap;
        used += this.shipDesigns[i].fleets[fleet].shipsQuantity * navCap;
        if (this.shipDesigns[i].old) {
          // total += this.shipDesigns[i].old.fleets[fleet].wantedShips * navCap;
          used += this.shipDesigns[i].old.fleets[fleet].shipsQuantity * navCap;
        }
      }
      this.fleetsPercent[fleet] = 100 * (total > 0 ? used / total : 0);
    }
  }
  addDefaultDesign() {
    this.addDesign("Drone", 1);
    const design = this.shipDesigns[0];
    FIRST_DRONE.modules.forEach((mod) => {
      const modId =
        typeof mod.moduleID === "string" ? mod.moduleID : sample(mod.moduleID);
      const module = this.modules.find((m) => m.id === modId);
      design.modules.push({
        module,
        level: 10,
        size: mod.size
      });
    });
  }
  prestige() {
    this.modules.forEach((mod) => (mod.unlocked = false));
    this.shipTypes.forEach((type) => {
      type.unlocked = false;
    });
    this.shipTypes[0].unlocked = true;
    this.unlockedModules = true;
    this.unlockDefaultModules();
    this.toDo = [];
    this.shipDesigns.forEach((des) => {
      des.old = null;
      des.modules.forEach((mod) => {
        mod.level = 10;
        mod.levelUi = "10";
      });
      des.reload(true);
      des.fleets.forEach((fl) => {
        fl.shipsQuantity = 0;
      });
    });
    this.shipDesigns.forEach((des) => {
      des.reloadRecursive();
    });
  }
  //#region Save and Load
  getSave(): any {
    return {
      d: this.shipDesigns.map((des) => des.getSave()),
      t: this.toDo.map((j) => j.getSave()),
      n: this.fleetNavCapPriority,
      r: this.autoReinforce
    };
  }
  load(data: any) {
    if ("d" in data) {
      this.shipDesigns = data.d.map((d) => {
        const design = new ShipDesign();
        design.load(d);
        return design;
      });
      for (const d of data.d) {
        if ("x" in d) {
          const design = this.shipDesigns.find((des) => des.id === d.i);
          const next = this.shipDesigns.find((des) => des.id === d.x);
          if (design && next) {
            design.next = next;
          }
        }
      }
    }

    if ("n" in data) {
      for (let i = 0; i < data.n.length; i++) {
        this.fleetNavCapPriority[i] = data.n[i];
        this.fleetNavCapPriorityUi[i] = data.n[i];
      }
    }

    if ("t" in data) {
      for (let i = 0, n = data.t.length; i < n; i++) {
        if ("t" in data.t[i]) {
          const design = this.shipDesigns.find((d) => d.id === data.t[i].d);

          //  Build ship Job
          if (data.t[i].t === "b") {
            const buildJob = new BuildShipsJob(
              data.t[i].q,
              design,
              data.t[i].n
            );
            buildJob.load(data.t[i]);
            this.toDo.push(buildJob);

            // Update Job
          } else if (data.t[i].t === "u") {
            const upJob = new UpdateShipJob(design);
            upJob.load(data.t[i]);
            this.toDo.push(upJob);
          }
        }
      }
    }
    this.autoReinforce = data?.r ?? false;
  }
  //#endregion
}
