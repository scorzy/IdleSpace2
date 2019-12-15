import { Unit } from "./unit";
import { UNITS } from "../data/units";
import { Production } from "./production";
import { ZERO, UNIT_PRICE_GROW_RATE } from "../CONSTANTS";
import { solveEquation } from "ant-utils";
import { Price } from "../prices/price";

export class ResourceManager {
  units = new Array<Unit>();
  unlockedUnits = new Array<Unit>();
  materials = new Array<Unit>();
  unlockedMaterials = new Array<Unit>();

  firstEndingUnit: Unit = null;
  maxTime = Number.POSITIVE_INFINITY;

  workers = new Array<Unit>();
  unlockedWorkers = new Array<Unit>();
  buildings = new Array<Unit>();
  unlockedBuildings = new Array<Unit>();

  //  Units
  science: Unit;
  farmer: Unit;
  technician: Unit;
  miner: Unit;
  metallurgist: Unit;
  scientist: Unit;
  worker: Unit;

  constructor() {
    this.makeUnits();
  }

  makeUnits() {
    this.units = new Array<Unit>();
    //  Initialize Units
    this.units = UNITS.map(unitData => new Unit(unitData));
    this.materials = this.units.filter(
      u =>
        u.id === "F" ||
        u.id === "E" ||
        u.id === "M" ||
        u.id === "A" ||
        u.id === "S" ||
        u.id === "W"
    );

    this.science = this.units.find(u => u.id === "S");
    this.farmer = this.units.find(u => u.id === "f");
    this.technician = this.units.find(u => u.id === "e");
    this.miner = this.units.find(u => u.id === "m");
    this.metallurgist = this.units.find(u => u.id === "a");
    this.scientist = this.units.find(u => u.id === "s");
    this.worker = this.units.find(u => u.id === "w");

    //  Production
    this.units.forEach(unit => {
      const unitData = UNITS.find(u => u.id === unit.id);
      if (unitData && unitData.production) {
        unitData.production.forEach(prod => {
          const product = this.units.find(u => u.id === prod[0]);
          const ratio = new Decimal(prod[1]);
          const production = new Production(unit, product, ratio);
          unit.production.push(production);
          product.makers.push(production);
        });
      }
    });

    //  Buy Price
    this.units.forEach(unit => {
      const unitData = UNITS.find(u => u.id === unit.id);
      if (unitData && unitData.prices) {
        unitData.prices.forEach(price => {
          const base = this.units.find(u => u.id === price[0]);
          const cost = new Decimal(price[1]);
          const realPrice = new Price(base, cost, UNIT_PRICE_GROW_RATE);
          unit.buyPrice.prices.push(realPrice);
        });
      }
    });

    this.workers = this.units.filter(
      u =>
        u.id === "f" ||
        u.id === "e" ||
        u.id === "m" ||
        u.id === "e" ||
        u.id === "a" ||
        u.id === "s" ||
        u.id === "w"
    );

    this.reloadLists();
  }

  reloadLists() {
    this.unlockedUnits = this.units.filter(u => u.unlocked);
    this.unlockedMaterials = this.materials.filter(u => u.unlocked);
    this.unlockedWorkers = this.workers.filter(u => u.unlocked);
    // this.unlockedBuildings = this.workers.filter(u => u.unlocked);
  }

  /**
   * Reload production stats
   */
  reloadProduction() {
    //  Reset
    this.firstEndingUnit = null;
    this.maxTime = Number.POSITIVE_INFINITY;
    // const time = performance.now();

    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      this.unlockedUnits[i].perSec = ZERO;
      this.unlockedUnits[i].perSec2 = ZERO;
      this.unlockedUnits[i].endIn = Number.POSITIVE_INFINITY;
      this.unlockedUnits[i].isEnding = false;

      this.unlockedUnits[i].prodAllBonus.reloadBonus();
      this.unlockedUnits[i].prodBy.reloadBonus();
      this.unlockedUnits[i].prodEfficiety.reloadBonus();
    }

    //  Bonus and operativity
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      for (
        let k = 0, n2 = this.unlockedUnits[i].production.length;
        k < n2;
        k++
      ) {
        this.unlockedUnits[i].production[k].reload();
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

        // x^2
        for (
          let i3 = 0,
            n3 = this.unlockedUnits[i].makers[i2].producer.makers.length;
          i3 < n3;
          i3++
        ) {
          const prod2X = this.unlockedUnits[i].makers[i2].producer.makers[
            i3
          ].prodPerSec.times(prodX);
          this.unlockedUnits[i].perSec2 = this.unlockedUnits[i].perSec2.plus(
            prod2X.times(
              this.unlockedUnits[i].makers[i2].producer.makers[i3].producer
                .quantity
            )
          );
        }
      }

      this.unlockedUnits[i].perSec2 = this.unlockedUnits[i].perSec2.div(2);

      if (
        this.unlockedUnits[i].perSec.lt(0) ||
        this.unlockedUnits[i].perSec2.lt(0)
      ) {
        const solution = solveEquation(
          ZERO,
          this.unlockedUnits[i].perSec2,
          this.unlockedUnits[i].perSec,
          this.unlockedUnits[i].quantity
        ).filter(s => s.gte(0));

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
    }

    // const end = performance.now() - time;
    // console.log(end);
  }

  /**
   * Update function.
   * @param seconds time in seconds
   */
  update(seconds: DecimalSource) {
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      this.unlockedUnits[i].quantity = this.unlockedUnits[i].quantity
        .plus(this.unlockedUnits[i].perSec2.times(Decimal.pow(seconds, 2)))
        .plus(this.unlockedUnits[i].perSec.times(seconds));
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
      .filter(m => m.prodPerSec.lt(0))
      .forEach(prod => {
        prod.producer.operativity = 0;
      });

    // ToDo
    // Stop consumers o producers?
  }

  postUpdate() {
    this.unlockedUnits.forEach(unit => {
      unit.postUpdate();
    });
  }

  getSave(): any {
    return {
      l: this.unlockedUnits.map(u => u.getSave())
    };
  }
  load(data: any) {
    if (!("l" in data)) throw new Error("Save not valid! missin units");
    for (const uData of data.l) {
      const unit = this.units.find(u => u.id === uData.i);
      unit.unlocked = true;
      unit.load(uData);
    }
    this.reloadLists();
  }
}
