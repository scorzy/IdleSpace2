import { Unit } from "./unit";
import { UNITS, UNIT_TYPES } from "../data/units";
import { Production } from "./production";
import {
  ZERO,
  UNIT_PRICE_GROW_RATE,
  SPACE_STATION_PRICE,
  SPACE_STATION_GROW,
  SPACE_STATION_HAB_SPACE,
} from "../CONSTANTS";
import { solveEquation } from "ant-utils";
import { Price } from "../prices/price";
import { Components } from "./components";
import { BonusStack } from "../bonus/bonusStack";

export class ResourceManager {
  units = new Array<Unit>();
  unlockedUnits = new Array<Unit>();
  materials = new Array<Unit>();
  districts = new Array<Unit>();
  unlockedMaterials = new Array<Unit>();

  firstEndingUnit: Unit = null;
  maxTime = Number.POSITIVE_INFINITY;

  workers = new Array<Unit>();
  unlockedWorkers = new Array<Unit>();
  buildings = new Array<Unit>();
  unlockedBuildings = new Array<Unit>();

  spaceStations = new Array<Unit>();
  unlockedSpaceStations = new Array<Unit>();
  megastructures = new Array<Unit>();
  unlockedMegastructures = new Array<Unit>();

  //#region Units
  metal: Unit;
  energy: Unit;
  alloy: Unit;
  components: Components;
  science: Unit;
  nuke: Unit;
  technician: Unit;
  miner: Unit;
  metallurgist: Unit;
  scientist: Unit;
  laboratory: Unit;
  worker: Unit;
  search: Unit;
  searcher: Unit;
  habitableSpace: Unit;
  miningDistrict: Unit;
  energyDistrict: Unit;
  shipyardWork: Unit;
  //#endregion

  constructor() {}

  makeUnits() {
    this.units = new Array<Unit>();
    //  Initialize Units
    this.units = UNITS.map((unitData) => {
      switch (unitData.id) {
        case "x":
          this.components = new Components(unitData);
          return this.components;
        default:
          return new Unit(unitData);
      }
    });
    this.shipyardWork = this.units.find((u) => u.id === "W");
    this.metal = this.units.find((u) => u.id === "M");
    this.alloy = this.units.find((u) => u.id === "A");
    this.science = this.units.find((u) => u.id === "S");
    this.search = this.units.find((u) => u.id === "R");
    this.technician = this.units.find((u) => u.id === "e");
    this.miner = this.units.find((u) => u.id === "m");
    this.metallurgist = this.units.find((u) => u.id === "a");
    this.scientist = this.units.find((u) => u.id === "s");
    this.worker = this.units.find((u) => u.id === "w");
    this.searcher = this.units.find((u) => u.id === "r");
    this.energy = this.units.find((u) => u.id === "E");
    this.habitableSpace = this.units.find((u) => u.id === "j");
    this.miningDistrict = this.units.find((u) => u.id === "P");
    this.energyDistrict = this.units.find((u) => u.id === "k");
    this.nuke = this.units.find((u) => u.id === "b");
    this.laboratory = this.units.find((u) => u.id === "3");

    //  Production
    this.units.forEach((unit) => {
      const unitData = UNITS.find((u) => u.id === unit.id);
      if (unitData && unitData.production) {
        unitData.production.forEach((prod) => {
          const product = this.units.find((u) => u.id === prod[0]);
          const ratio = new Decimal(prod[1]);
          const production = new Production(unit, product, ratio);
          unit.production.push(production);
          product.makers.push(production);
        });
      }
    });

    //  Buy Price
    this.units.forEach((unit) => {
      const unitData = UNITS.find((u) => u.id === unit.id);
      if (unitData && unitData.prices) {
        unitData.prices.forEach((price) => {
          const base = this.units.find((u) => u.id === price[0]);
          const cost = new Decimal(price[1]);
          const realPrice = new Price(base, cost, UNIT_PRICE_GROW_RATE);
          unit.buyPrice.prices.push(realPrice);
        });
      }
    });

    // Lists
    this.materials = this.units.filter(
      (u) => u.unitData.unitType === UNIT_TYPES.MATERIAL
    );
    this.districts = this.units.filter(
      (u) => u.unitData.unitType === UNIT_TYPES.DISTRICT
    );
    this.workers = this.units.filter(
      (u) => u.unitData.unitType === UNIT_TYPES.WORKER
    );
    this.buildings = this.units.filter(
      (u) => u.unitData.unitType === UNIT_TYPES.BUILDING
    );
    this.spaceStations = this.units.filter(
      (u) => u.unitData.unitType === UNIT_TYPES.SPACE_STATION
    );
    this.megastructures = this.units.filter(
      (u) => u.unitData.unitType === UNIT_TYPES.MEGASTRUCTURE
    );

    //  Space Stations
    for (let i = 0, n = this.spaceStations.length; i < n; i++) {
      const station = this.spaceStations[i];
      station.buildPrice = Decimal.pow(i + 1, SPACE_STATION_GROW).times(
        SPACE_STATION_PRICE
      );
      station.buildPriceNext = station.buildPrice;
      station.habSpace = Decimal.pow(i + 1, SPACE_STATION_GROW).times(
        SPACE_STATION_HAB_SPACE
      );
    }

    this.units.forEach((u) => u.setRelations());

    //  Mods
    this.workers.forEach((w) => w.makeMods());

    this.materials.forEach((u) => (u.battleGainMulti = new BonusStack()));
    this.districts.forEach((u) => (u.battleGainMulti = new BonusStack()));

    this.reloadLists();
  }
  reloadLists() {
    this.unlockedUnits = this.units.filter((u) => u.unlocked);
    this.unlockedMaterials = this.materials.filter((u) => u.unlocked);
    this.unlockedWorkers = this.workers.filter((u) => u.unlocked);
    this.unlockedBuildings = this.buildings.filter((u) => u.unlocked);
    this.unlockedSpaceStations = this.spaceStations.filter((u) => u.unlocked);
    this.unlockedMegastructures = this.megastructures.filter((u) => u.unlocked);
  }
  /**
   * Reload production stats
   */
  reloadProduction() {
    //  Reset
    this.firstEndingUnit = null;
    this.maxTime = Number.POSITIVE_INFINITY;
    this.components.reloadLimit();
    this.energy.reloadLimit();

    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      this.unlockedUnits[i].perSec = ZERO;
      // this.unlockedUnits[i].perSec2 = ZERO;
      this.unlockedUnits[i].endIn = Number.POSITIVE_INFINITY;
      this.unlockedUnits[i].fullIn = Number.POSITIVE_INFINITY;
      this.unlockedUnits[i].isEnding = false;

      this.unlockedUnits[i].prodAllBonus.reloadBonus();
      this.unlockedUnits[i].prodBy.reloadBonus();
      this.unlockedUnits[i].prodEfficiency.reloadBonus();
    }

    //  Bonus and operativity
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      const isLimited =
        this.unlockedUnits[i].id !== "e" &&
        this.unlockedUnits[i].production.findIndex(
          (pro) =>
            pro.ratio.gt(0) &&
            (pro.product.limit.lte(Number.EPSILON) ||
              pro.product.quantity.gte(pro.product.limit))
        ) > -1;

      for (
        let k = 0, n2 = this.unlockedUnits[i].production.length;
        k < n2;
        k++
      ) {
        if (!isLimited) this.unlockedUnits[i].production[k].reload();
        else this.unlockedUnits[i].production[k].prodPerSec = ZERO;
      }
    }

    //  Calculate times
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      // x
      for (
        let i2 = 0, n2 = this.unlockedUnits[i].makers.length;
        i2 < n2;
        i2++
      ) {
        const prodX = this.unlockedUnits[i].makers[i2].prodPerSec;
        this.unlockedUnits[i].perSec = this.unlockedUnits[i].perSec.plus(
          prodX.times(this.unlockedUnits[i].makers[i2].producer.quantity)
        );
      }

      // End times
      if (
        this.unlockedUnits[i].perSec.lt(0)
        // || this.unlockedUnits[i].perSec2.lt(0)
      ) {
        const solution = solveEquation(
          ZERO,
          ZERO, // this.unlockedUnits[i].perSec2,
          this.unlockedUnits[i].perSec,
          this.unlockedUnits[i].quantity
        ).filter((s) => s.gte(0));

        if (solution.length > 0) {
          const min = solution.reduce(
            (p, c) => p.min(c),
            new Decimal(Number.POSITIVE_INFINITY)
          );
          this.unlockedUnits[i].endIn = Math.min(
            min.toNumber(),
            this.unlockedUnits[i].endIn
          );
          this.unlockedUnits[i].isEnding = true;

          if (this.unlockedUnits[i].endIn < this.maxTime) {
            this.maxTime = this.unlockedUnits[i].endIn;
            this.firstEndingUnit = this.unlockedUnits[i];
          }
        }
      }

      // Full time
      if (
        this.unlockedUnits[i].limit.lt(Decimal.MAX_VALUE) &&
        this.unlockedUnits[i].perSec.gt(0)
      ) {
        const sol = this.unlockedUnits[i].limit
          .minus(this.unlockedUnits[i].quantity)
          .div(this.unlockedUnits[i].perSec);

        if (sol.gt(0)) {
          this.unlockedUnits[i].fullIn = sol.toNumber();
          if (this.unlockedUnits[i].fullIn < this.maxTime) {
            this.maxTime = this.unlockedUnits[i].fullIn;
            this.firstEndingUnit = null;
          }
        }
      }
    }
  }

  /**
   * Update function.
   * @param seconds time in seconds
   */
  update(seconds: DecimalSource) {
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      this.unlockedUnits[i].quantity = this.unlockedUnits[i].quantity.plus(
        this.unlockedUnits[i].perSec.times(seconds)
      );
    }
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      this.unlockedUnits[i].quantity = this.unlockedUnits[i].quantity.max(0);
    }
  }

  /**
   * Stop Resources if needed
   */
  stopResources() {
    if (!this.firstEndingUnit) {
      return false;
    }

    //  Stop consumers
    this.firstEndingUnit.makers
      .filter((m) => m.prodPerSec.lt(0))
      .forEach((prod) => {
        prod.producer.operativity = 0;
      });
  }
  postUpdate() {
    this.unlockedUnits.forEach((unit) => {
      unit.postUpdate();
    });
    this.deployComponents();
  }
  deployComponents() {
    if (this.components.quantity.lte(0.1)) return false;
    let sum = 0;
    let added = ZERO;
    for (let i = 0, n = this.unlockedWorkers.length; i < n; i++) {
      if (this.unlockedWorkers[i].quantity.lt(this.unlockedWorkers[i].limit)) {
        sum +=
          this.unlockedWorkers[i].production.findIndex(
            (p) => p.ratio.gt(0) && p.product.isEnding
          ) > -1
            ? this.unlockedWorkers[i].assemblyPriorityEnding
            : this.unlockedWorkers[i].assemblyPriority;
      }
    }
    for (let i = 0, n = this.unlockedWorkers.length; i < n; i++) {
      if (this.unlockedWorkers[i].quantity.lt(this.unlockedWorkers[i].limit)) {
        const worker = this.unlockedWorkers[i];
        worker.reloadNeedComponent();
        const toAdd = this.components.quantity
          .times(
            worker.production.findIndex(
              (p) => p.ratio.gt(0) && p.product.isEnding
            ) > -1
              ? this.unlockedWorkers[i].assemblyPriorityEnding
              : this.unlockedWorkers[i].assemblyPriority
          )
          .div(sum);
        worker.storedComponents = worker.storedComponents.plus(toAdd);

        added = added.plus(toAdd);
        if (worker.storedComponents.gte(worker.components)) {
          const built = worker.storedComponents
            .div(worker.components)
            .floor()
            .max(1);
          worker.quantity = worker.quantity.plus(built);
          if (worker.quantity.gte(worker.limit)) {
            const diff = worker.quantity.minus(worker.limit);
            worker.quantity = worker.limit;
            added = added.minus(diff.times(worker.components));
            worker.storedComponents = ZERO;
          } else {
            worker.storedComponents = worker.storedComponents.minus(
              built.times(worker.components)
            );
          }
          worker.reloadNeedComponent();
        }
      }
    }
    this.components.quantity = this.components.quantity.minus(added).max(0);
    this.components.reloadLimit();
  }
  reloadMods() {
    for (let i = 0, n = this.workers.length; i < n; i++) {
      this.workers[i].reloadMaxMods();
      this.workers[i].reloadComponentPrice();
    }
  }
  //#region Save and Load
  getSave(): any {
    return {
      l: this.unlockedUnits.map((u) => u.getSave()),
    };
  }
  load(data: any) {
    if (!("l" in data)) throw new Error("Save not valid! missin units");
    for (const uData of data.l) {
      const unit = this.units.find((u) => u.id === uData.i);
      unit.unlocked = true;
      unit.load(uData);
    }
    this.reloadLists();
  }
  //#endregion
}
