import { Module } from "./module";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./ShipType";
import { SHIP_TYPES } from "../data/shipTypes";
import { modules } from "../data/modulesData";
import { JobManager } from "../job/jobManager";
import { Game } from "../game";
import { FLEET_CAPACITY_MULTI, FLEET_NUMBER, ZERO } from "../CONSTANTS";
import { BuildShipsJob } from "./buildShipsJob";
import { Job } from "../job/job";
import { UpdateShipJob } from "./updateShipJob";
import { BattleResult } from "../battle/battleResult";

const MAX_DESIGN = 20;

export class ShipyardManager extends JobManager {
  shipDesigns = new Array<ShipDesign>();
  modules = new Array<Module>();
  shipTypes = new Array<ShipType>();
  fleetsCapacity = new Array<number>(FLEET_NUMBER);

  weapons = new Array<Module>();
  defences = new Array<Module>();
  generators = new Array<Module>();
  others = new Array<Module>();
  groups: { name: string; list: Array<Module> }[];
  toDo = new Array<Job>();

  init() {
    this.shipTypes = SHIP_TYPES.map(s => new ShipType(s));
    this.modules = modules.map(m => new Module(m));
  }
  addDesign(name: string, type: number): number {
    if (this.shipDesigns.length >= MAX_DESIGN) return -1;

    const shipType = this.shipTypes.find(t => t.id === type);
    if (!shipType) return -1;

    const shipDesign = new ShipDesign();
    shipDesign.id = 1;
    for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
      if (this.shipDesigns[i].id >= shipDesign.id) {
        shipDesign.id = this.shipDesigns[i].id + 1;
      }
    }
    if (shipDesign.id !== 1) {
      shipDesign.fleets.forEach(fl => {
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
    let unlocked = false;
    for (let i = 0, n = this.modules.length; i < n; i++) {
      this.modules[i].reloadMaxLevel();
      if (
        !this.modules[i].unlocked &&
        this.modules[i].maxLevel >= this.modules[i].unlockLevel
      ) {
        if (this.modules[i].unlock()) {
          unlocked = true;
        }
      }
    }
    if (unlocked) this.reloadLists();
    for (let i = 0, n = this.toDo.length; i < n; i++) {
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
  }
  reloadLists() {
    this.weapons = this.modules.filter(mod => mod.unlocked && mod.damage > 0);
    this.defences = this.modules.filter(
      mod => mod.unlocked && (mod.armour > 0 || mod.shield > 0)
    );
    this.generators = this.modules.filter(
      mod => mod.unlocked && mod.energy > 0
    );
    this.others = this.modules.filter(
      mod =>
        mod.unlocked &&
        this.weapons.findIndex(w => w.id === mod.id) < 0 &&
        this.defences.findIndex(w => w.id === mod.id) < 0 &&
        this.generators.findIndex(w => w.id === mod.id) < 0
    );
    this.groups = [
      { name: "Weapons", list: this.weapons },
      { name: "Defences", list: this.defences },
      { name: "Generators", list: this.generators },
      { name: "Others", list: this.others }
    ];
  }
  update(oldDesign: ShipDesign, newDesign: ShipDesign): boolean {
    if (!(newDesign && oldDesign)) return false;
    if (oldDesign.old) return false;

    newDesign.modules = newDesign.modules.filter(line => line.module);
    newDesign.id = oldDesign.id;
    newDesign.rev = oldDesign.rev + 1;

    if (
      newDesign.price.lte(oldDesign.price) ||
      oldDesign.fleets.findIndex(fl => fl.shipsQuantity > 0) < 0
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
      }
      newDesign.old = oldDesign;
      for (let i = 0, n = this.toDo.length; i < n; i++) {
        const toDo = this.toDo[i];
        if (toDo instanceof BuildShipsJob && toDo.design === oldDesign) {
          toDo.design = newDesign;
        }
      }
      this.toDo.push(new UpdateShipJob(newDesign));
    }
    oldDesign.old = null;
    const index = this.shipDesigns.indexOf(oldDesign);
    if (index > -1) this.shipDesigns[index] = newDesign;
    return true;
  }
  /**
   * Calculate fleets capacity and num of ships to build
   */
  reloadFleetCapacity() {
    //  Reload Fleet capacity
    let navalCapacity = Game.getGame().navalCapacity;
    for (let i = 0; i < FLEET_NUMBER; i++) {
      navalCapacity /= 1 + i * FLEET_CAPACITY_MULTI;
      this.fleetsCapacity[i] = Math.max(0, Math.floor(navalCapacity));
      navalCapacity -= this.fleetsCapacity[i];
    }

    //  Reload ships number
    for (let i = 0; i < FLEET_NUMBER; i++) {
      if (this.fleetsCapacity[i] < 1) {
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          this.shipDesigns[k].fleets[i].navalCapPercent = 0;
          this.shipDesigns[k].fleets[i].navalCapPercentUi = 0;
        }
      } else {
        let prioritySum = 0;
        let prioritySumUi = 0;
        let remainingNavCap = this.fleetsCapacity[i];
        let remainingNavCapUi = this.fleetsCapacity[i];
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          prioritySum += this.shipDesigns[k].fleets[i].navalCapPercent;
          prioritySumUi += this.shipDesigns[k].fleets[i].navalCapPercentUi;
        }
        prioritySum = Math.max(1, prioritySum);
        prioritySumUi = Math.max(1, prioritySumUi);
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          this.shipDesigns[k].fleets[i].wantedShips = Math.floor(
            (this.fleetsCapacity[i] *
              this.shipDesigns[k].fleets[i].navalCapPercent) /
              (prioritySum * this.shipDesigns[k].type.navalCapacity)
          );
          this.shipDesigns[k].fleets[i].wantedShipsUi = Math.floor(
            (this.fleetsCapacity[i] *
              this.shipDesigns[k].fleets[i].navalCapPercentUi) /
              (prioritySumUi * this.shipDesigns[k].type.navalCapacity)
          );
          remainingNavCap -= Math.floor(
            this.shipDesigns[k].fleets[i].wantedShips *
              this.shipDesigns[k].type.navalCapacity
          );
          remainingNavCapUi -= Math.floor(
            this.shipDesigns[k].fleets[i].wantedShipsUi *
              this.shipDesigns[k].type.navalCapacity
          );
        }
        if (remainingNavCap > 0) {
          const ordered = this.shipDesigns
            .slice(0)
            .sort(
              (a, b) =>
                b.fleets[i].navalCapPercent - a.fleets[i].navalCapPercent
            );
          for (let k = 0, n = ordered.length; k < n; k++) {
            if (ordered[k].type.navalCapacity <= remainingNavCap) {
              const toAdd = Math.floor(
                remainingNavCap / ordered[k].type.navalCapacity
              );
              ordered[k].fleets[i].wantedShips += toAdd;
              remainingNavCap -= toAdd * ordered[k].type.navalCapacity;
            }
          }
        }

        if (remainingNavCapUi > 0) {
          const ordered = this.shipDesigns
            .slice(0)
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
        this.toDo.push(new BuildShipsJob(toBuild, this.shipDesigns[k], i));
      }
    }
  }
  delete(design: ShipDesign) {
    for (let i = this.toDo.length - 1; i > 0; i--) {
      const job = this.toDo[i];
      if (
        (job instanceof BuildShipsJob && job.design === design) ||
        (job instanceof UpdateShipJob && job.design === design)
      ) {
        this.toDo.splice(i, 1);
      }
    }
    this.shipDesigns.splice(
      this.shipDesigns.findIndex(d => d === design),
      1
    );
  }
  onBattleEnd(battleResult: BattleResult, fleetNum: number) {
    for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
      const id = Math.abs(battleResult.playerLost[i].id);
      let design = this.shipDesigns.find(des => des.id === id);
      if (battleResult.playerLost[i].id < 0) {
        design = design.old;
      }
      if (design) {
        design.fleets[fleetNum].shipsQuantity -=
          battleResult.playerLost[i].lost;
        design.fleets[fleetNum].shipsQuantity = Math.floor(
          Math.max(design.fleets[fleetNum].shipsQuantity, 0)
        );
      }
    }
  }

  //#region Save and Load
  getSave(): any {
    return {
      d: this.shipDesigns.map(des => des.getSave()),
      t: this.toDo.map(j => j.getSave())
    };
  }
  load(data: any) {
    if ("d" in data) {
      this.shipDesigns = data.d.map(d => {
        const design = new ShipDesign();
        design.load(d);
        return design;
      });
    }

    if ("t" in data) {
      for (let i = 0, n = data.t.length; i < n; i++) {
        if ("t" in data.t[i]) {
          const design = this.shipDesigns.find(d => d.id === data.t[i].d);

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
  }
  //#endregion
}
