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
        u.id === "S"
    );

    this.science = this.units.find(u => u.id === "S");
    this.farmer = this.units.find(u => u.id === "f");
    this.technician = this.units.find(u => u.id === "e");
    this.miner = this.units.find(u => u.id === "m");
    this.metallurgist = this.units.find(u => u.id === "a");
    this.scientist = this.units.find(u => u.id === "s");

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
        u.id === "s"
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

    this.unlockedUnits.forEach(unit => {
      unit.perSec = ZERO;
      unit.perSec2 = ZERO;
      unit.endIn = Number.POSITIVE_INFINITY;
      unit.isEnding = false;

      unit.prodAllBonus.reloadBonus();
      unit.prodBy.reloadBonus();
      unit.prodEfficiety.reloadBonus();
    });

    //  Bonus and operativity
    this.unlockedUnits.forEach(unit => {
      unit.production.forEach(prod => prod.reload());
    });

    //  Calculate times
    this.unlockedUnits.forEach(unit => {
      // x
      unit.makers.forEach(prod1 => {
        const prodX = prod1.prodPerSec;
        unit.perSec = unit.perSec.plus(prodX.times(prod1.producer.quantity));

        // x^2
        prod1.producer.makers.forEach(prod2 => {
          const prod2X = prod2.prodPerSec.times(prodX);
          unit.perSec2 = unit.perSec2.plus(
            prod2X.times(prod2.producer.quantity)
          );
        });
      });

      unit.perSec2 = unit.perSec2.div(2);

      if (unit.perSec.lt(0) || unit.perSec2.lt(0)) {
        const solution = solveEquation(
          ZERO,
          unit.perSec2,
          unit.perSec,
          unit.quantity
        ).filter(s => s.gte(0));

        if (solution.length > 0) {
          const min = solution.reduce(
            (p, c) => p.min(c),
            new Decimal(Number.POSITIVE_INFINITY)
          );
          unit.endIn = Math.min(min.toNumber(), unit.endIn);
          unit.isEnding = true;

          if (unit.endIn < this.maxTime) {
            this.maxTime = unit.endIn;
            this.firstEndingUnit = unit;
          }
        }
      }
    });
  }

  /**
   * Update function.
   * @param seconds time in seconds
   */
  update(seconds: DecimalSource) {
    this.unlockedUnits.forEach(u => {
      u.quantity = u.quantity
        .plus(u.perSec2.times(Decimal.pow(seconds, 2)))
        .plus(u.perSec.times(seconds));
    });
    this.unlockedUnits.forEach(u => {
      u.quantity = u.quantity.max(0);
    });
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
}
