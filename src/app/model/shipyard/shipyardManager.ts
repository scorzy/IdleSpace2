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

const MAX_DESIGN = 20;

export class ShipyardManager extends JobManager {
  shipDesigns = new Array<ShipDesign>();
  updatedShipDesigns = new Array<ShipDesign>();
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
    shipDesign.id = 0;
    for (let i = 0, n = this.shipDesigns.length; i < n; i++) {
      if (this.shipDesigns[i].id >= shipDesign.id) {
        shipDesign.id = this.shipDesigns[i].id + 1;
      }
    }

    shipDesign.name = name;
    shipDesign.type = shipType;
    this.shipDesigns.push(shipDesign);
    this.updatedShipDesigns.push(shipDesign);
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

    newDesign.modules = newDesign.modules.filter(line => line.module);
    newDesign.id = oldDesign.id;
    newDesign.rev = oldDesign.rev + 1;
    for (let i = 0; i < FLEET_NUMBER; i++) {
      newDesign.fleets[i].navalCapPercent = oldDesign.fleets[i].navalCapPercent;
    }

    this.shipDesigns.push(newDesign);
    const index = this.updatedShipDesigns.indexOf(oldDesign);
    if (index > -1) this.updatedShipDesigns[index] = newDesign;
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
        }
      } else {
        let prioritySum = 0;
        let remainingNavCap = this.fleetsCapacity[i];
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          prioritySum += this.shipDesigns[k].fleets[i].navalCapPercent;
        }
        prioritySum = Math.max(1, prioritySum);
        for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
          this.shipDesigns[k].fleets[i].wantedShips = Math.floor(
            (this.fleetsCapacity[i] *
              this.shipDesigns[k].fleets[i].navalCapPercent) /
              (prioritySum * this.shipDesigns[k].type.navalCapacity)
          );
          remainingNavCap -=
            this.shipDesigns[k].fleets[i].wantedShips *
            this.shipDesigns[k].type.navalCapacity;
        }
      }
    }
  }
  reinforce() {
    for (let i = 0; i < FLEET_NUMBER; i++) {
      for (let k = 0, n = this.shipDesigns.length; k < n; k++) {
        this.shipDesigns[k].fleets[i].shipsQuantity = Math.min(
          this.shipDesigns[k].fleets[i].shipsQuantity,
          this.shipDesigns[k].fleets[i].wantedShips
        );
        let toBuild =
          this.shipDesigns[k].fleets[i].wantedShips -
          this.shipDesigns[k].fleets[i].shipsQuantity;
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
  }
  getWorkNeeded(): Decimal {
    let work = ZERO;
    for (let i = 0, n = this.toDo.length; i < n; i++) {
      work = work.plus(this.toDo[i].getRemaining());
    }
    return work;
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

    // Remake list of most updated design
    this.shipDesigns.forEach(design => {
      if (this.updatedShipDesigns.findIndex(up => up.id === design.id) < 0) {
        const designList = this.shipDesigns.filter(d => d.id === design.id);
        let mostUp = designList[0];
        designList.forEach(des => {
          if (des.rev > mostUp.rev) {
            mostUp = des;
          }
        });
        this.updatedShipDesigns.push(mostUp);
      }
    });

    if ("t" in data) {
      for (let i = 0, n = data.t.length; i < n; i++) {
        if ("t" in data.t[i] && data.t[i].t === "b") {
          const design = this.shipDesigns.find(d => d.id === data.t[i].d);
          const buildJob = new BuildShipsJob(data.t[i].q, design, data.t[i].n);
          buildJob.load(data.t[i]);
          this.toDo.push(buildJob);
        }
      }
    }
  }
  //#endregion
}
