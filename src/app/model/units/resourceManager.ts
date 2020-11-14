import { Unit } from "./unit";
import { UNITS, UNIT_TYPES } from "../data/units";
import { Production } from "./production";
import {
  ZERO,
  UNIT_PRICE_GROW_RATE,
  SPACE_STATION_PRICE,
  SPACE_STATION_GROW,
  SPACE_STATION_HAB_SPACE,
  ONE,
  STORAGE_DEPARTMENT_MULTI,
  DEPARTMENT_TECH_MULTI,
  BUILDING_PRICE_GROW_RATE,
  EXTRA_DISTRICTS_FROM_STATIONS,
  MEGA_IDS,
  MEGA_SPEED_MULTI,
  SCIENCE_CHALLENGE_LIMIT,
  INFRASTRUCTURE_BONUS,
  SPACE_INFRASTRUCTURE_PRICE
} from "../CONSTANTS";
import { Price } from "../prices/price";
import { Components } from "./components";
import { BonusStack } from "../bonus/bonusStack";
import { Game } from "../game";
import { Worker } from "./worker";
import { Building, Department } from "./building";
import { SpaceStation } from "./spaceStation";
import { Bonus } from "../bonus/bonus";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { MegaStructure } from "./megaStructure";
import { Technology } from "../researches/technology";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Infrastructure } from "./infrastructure";
import { InfraBonusUnit } from "../space/infraBonusUnit";

export class ResourceManager {
  units = new Array<Unit>();
  unlockedUnits = new Array<Unit>();
  materials = new Array<Unit>();
  districts = new Array<Unit>();
  unlockedMaterials = new Array<Unit>();
  unlockedProductionUnits = new Array<Unit>();

  firstEndingUnit: Unit = null;
  maxTime = Number.POSITIVE_INFINITY;

  workers = new Array<Worker>();
  unlockedWorkers = new Array<Worker>();
  buildings = new Array<Building>();
  unlockedBuildings = new Array<Building>();
  spaceStations = new Array<SpaceStation>();
  unlockedSpaceStations = new Array<SpaceStation>();
  megastructures = new Array<MegaStructure>();
  unlockedMegastructures = new Array<MegaStructure>();
  infrastructures = new Array<Infrastructure>();
  unlockedInfrastructures = new Array<Infrastructure>();
  subLists: {
    name: string;
    icon: string;
    units: Unit[];
    expanded: boolean;
  }[] = [];

  //#region Units
  metal: Unit;
  energy: Unit;
  alloy: Unit;
  components: Components;
  science: Unit;
  search: Unit;
  nuke: Unit;

  miner: Worker;
  technician: Worker;
  scientist: Worker;
  metallurgist: Worker;
  worker: Worker;
  searcher: Worker;
  replicator: Worker;
  nukeDrone: Worker;

  mine: Building;
  powerPlant: Building;
  laboratory: Building;
  foundry: Building;
  factory: Building;
  observatory: Building;
  droneFactory: Building;
  nukeFactory: Building;

  batteries: Building;
  droneDepot: Building;
  nukeSilos: Building;

  habitableSpace: Unit;
  miningDistrict: Unit;
  energyDistrict: Unit;
  shipyardWork: Unit;

  megaNaval: MegaStructure;
  gateway: MegaStructure;
  megaComputing: MegaStructure;

  infraBonusUnit: InfraBonusUnit;
  //#endregion
  constructor() {}
  makeUnits() {
    this.units = new Array<Unit>();
    //  Initialize Units
    UNITS.forEach((unitData) => {
      if (unitData.id === "x") {
        this.components = new Components(unitData);
        this.units.push(this.components);
      } else {
        switch (unitData.unitType) {
          case UNIT_TYPES.WORKER:
            const w = new Worker(unitData);
            this.workers.push(w);
            this.units.push(w);
            break;
          case UNIT_TYPES.BUILDING:
            const b = new Building(unitData);
            this.buildings.push(b);
            this.units.push(b);
            break;
          case UNIT_TYPES.SPACE_STATION:
            const s = new SpaceStation(unitData);
            this.spaceStations.push(s);
            this.units.push(s);
            break;
          case UNIT_TYPES.INFRASTRUCTURE:
            const p = new Infrastructure(unitData);
            this.infrastructures.push(p);
            this.units.push(p);
            break;
          case UNIT_TYPES.MEGASTRUCTURE:
            const m = new MegaStructure(unitData);
            this.megastructures.push(m);
            this.units.push(m);
            break;
          default:
            const unit = new Unit(unitData);
            this.units.push(unit);
            break;
        }
      }
    });
    this.shipyardWork = this.units.find((u) => u.id === "W");
    this.metal = this.units.find((u) => u.id === "M");
    this.alloy = this.units.find((u) => u.id === "A");
    this.science = this.units.find((u) => u.id === "S");
    this.search = this.units.find((u) => u.id === "R");
    this.technician = this.workers.find((u) => u.id === "e");
    this.miner = this.workers.find((u) => u.id === "m");
    this.metallurgist = this.workers.find((u) => u.id === "a");
    this.scientist = this.workers.find((u) => u.id === "s");
    this.worker = this.workers.find((u) => u.id === "w");
    this.searcher = this.workers.find((u) => u.id === "r");
    this.replicator = this.workers.find((u) => u.id === "X");
    this.nukeDrone = this.workers.find((u) => u.id === "B");
    this.energy = this.units.find((u) => u.id === "E");
    this.habitableSpace = this.units.find((u) => u.id === "j");
    this.miningDistrict = this.units.find((u) => u.id === "P");
    this.energyDistrict = this.units.find((u) => u.id === "k");
    this.nuke = this.units.find((u) => u.id === "b");

    this.mine = this.buildings.find((u) => u.id === "1");
    this.powerPlant = this.buildings.find((u) => u.id === "2");
    this.laboratory = this.buildings.find((u) => u.id === "3");
    this.foundry = this.buildings.find((u) => u.id === "4");
    this.factory = this.buildings.find((u) => u.id === "5");
    this.observatory = this.buildings.find((u) => u.id === "6");
    this.droneFactory = this.buildings.find((u) => u.id === "7");
    this.nukeFactory = this.buildings.find((u) => u.id === "10");

    this.batteries = this.buildings.find((u) => u.id === "8");
    this.droneDepot = this.buildings.find((u) => u.id === "9");
    this.nukeSilos = this.buildings.find((u) => u.id === "11");

    this.megaNaval = this.megastructures.find(
      (u) => u.id === MEGA_IDS.MegaNaval
    );
    this.gateway = this.megastructures.find((u) => u.id === MEGA_IDS.Gateway);
    this.megaComputing = this.megastructures.find(
      (u) => u.id === MEGA_IDS.MegaComputing
    );

    //  Production
    this.workers.forEach((unit) => {
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
      if (unit.unitData && unit.unitData.prices) {
        unit.unitData.prices.forEach((price) => {
          const base = this.units.find((u) => u.id === price[0]);
          const cost = new Decimal(price[1]);
          const realPrice = new Price(
            base,
            cost,
            unit instanceof Worker
              ? UNIT_PRICE_GROW_RATE
              : BUILDING_PRICE_GROW_RATE
          );
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

    //  Space Stations
    for (let i = 0, n = this.spaceStations.length; i < n; i++) {
      const station = this.spaceStations[i];
      station.level = i;
      station.habSpaceStack = new BonusStack();
      station.buildPrice = Decimal.pow(SPACE_STATION_GROW, i + 1).times(
        SPACE_STATION_PRICE
      );
      station.buildPriceNext = station.buildPrice;
      station.habSpaceOriginal = Decimal.mul(i + 1, SPACE_STATION_GROW).times(
        SPACE_STATION_HAB_SPACE
      );
      station.habSpace = station.habSpaceOriginal;
    }

    //  Infrastructure
    for (let i = 0, n = this.infrastructures.length; i < n; i++) {
      const infrastructure = this.infrastructures[i];
      infrastructure.level = i;
      infrastructure.speedStack = new BonusStack();
      infrastructure.buildPrice = Decimal.pow(
        SPACE_STATION_GROW,
        i * 2 + 3
      ).times(SPACE_INFRASTRUCTURE_PRICE);
      infrastructure.buildPriceNext = infrastructure.buildPrice;
      infrastructure.speedOriginal = Decimal.mul(
        Math.pow(2, i),
        INFRASTRUCTURE_BONUS
      );
      infrastructure.speedBonus = infrastructure.speedOriginal;
    }

    this.materials.forEach((u) => {
      u.exponentialLimit = true;
      u.battleGainMulti = new BonusStack();
    });
    this.districts.forEach((u) => (u.battleGainMulti = new BonusStack()));

    this.units.forEach((u) => u.setRelations());

    //  Mods
    this.workers.forEach((w) => w.makeMods());

    this.subLists.push({
      name: "Materials",
      units: this.unlockedMaterials,
      icon: "my:cube",
      expanded: true
    });
    this.subLists.push({
      name: "Workers",
      units: this.unlockedWorkers,
      icon: "my:vintage-robot",
      expanded: true
    });
    this.subLists.push({
      name: "Districts",
      units: this.districts,
      icon: "fa-s:globe",
      expanded: true
    });

    this.reloadLists();
  }
  reloadLists() {
    this.unlockedUnits = this.units.filter((u) => u.unlocked);
    this.unlockedMaterials = this.materials.filter((u) => u.unlocked);
    this.unlockedWorkers = this.workers.filter((u) => u.unlocked);
    this.unlockedBuildings = this.buildings.filter((u) => u.unlocked);
    this.unlockedSpaceStations = this.spaceStations.filter((u) => u.unlocked);
    this.unlockedInfrastructures = this.infrastructures.filter(
      (u) => u.unlocked
    );
    this.unlockedMegastructures = this.megastructures.filter((u) => u.unlocked);
    this.unlockedProductionUnits = this.unlockedUnits.filter(
      (u) => u.production.length > 0 || u.makers.length > 0
    );
    this.subLists[0].units = this.unlockedMaterials;
    this.subLists[1].units = this.unlockedWorkers;
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

    for (let i = 0, n = this.unlockedProductionUnits.length; i < n; i++) {
      this.unlockedProductionUnits[i].perSec = ZERO;
      this.unlockedProductionUnits[i].endIn = Number.POSITIVE_INFINITY;
      this.unlockedProductionUnits[i].fullIn = Number.POSITIVE_INFINITY;
      this.unlockedProductionUnits[i].isEnding = false;

      this.unlockedProductionUnits[i].prodAllBonus.reloadBonus();
      this.unlockedProductionUnits[i].prodBy.reloadBonus();
      this.unlockedProductionUnits[i].prodEfficiency.reloadBonus();
    }

    //  Bonus and operativity
    for (let i = 0, n = this.unlockedProductionUnits.length; i < n; i++) {
      const isLimited =
        this.unlockedProductionUnits[i].id !== "e" &&
        this.unlockedProductionUnits[i].production.some(
          (pro) =>
            pro.ratio.gt(0) &&
            (pro.product.limit.lte(Number.EPSILON) ||
              pro.product.quantity.gte(pro.product.limit))
        );
      this.unlockedProductionUnits[i].isLimited = isLimited;

      for (
        let k = 0, n2 = this.unlockedProductionUnits[i].production.length;
        k < n2;
        k++
      ) {
        this.unlockedProductionUnits[i].production[k].reload();
        if (isLimited) {
          this.unlockedProductionUnits[i].production[k].prodPerSec = ZERO;
        }
      }
    }

    //  Calculate times
    for (let i = 0, n = this.unlockedProductionUnits.length; i < n; i++) {
      // x
      for (
        let i2 = 0, n2 = this.unlockedProductionUnits[i].makers.length;
        i2 < n2;
        i2++
      ) {
        const prodX = this.unlockedProductionUnits[i].makers[i2].prodPerSec;
        this.unlockedProductionUnits[i].perSec = this.unlockedProductionUnits[
          i
        ].perSec.plus(
          prodX.times(
            this.unlockedProductionUnits[i].makers[i2].producer.quantity
          )
        );
      }

      if (Game.getGame().challengeManager.scienceChallenge.isActive) {
        this.science.perSec = this.science.perSec.min(SCIENCE_CHALLENGE_LIMIT);
      }

      // End times
      if (this.unlockedProductionUnits[i].perSec.lt(0)) {
        const min = this.unlockedProductionUnits[i].quantity
          .div(this.unlockedProductionUnits[i].perSec)
          .times(-1);
        this.unlockedProductionUnits[i].endIn = Math.min(
          min.toNumber(),
          this.unlockedProductionUnits[i].endIn
        );
        this.unlockedProductionUnits[i].isEnding = true;
        if (this.unlockedProductionUnits[i].endIn < this.maxTime) {
          this.maxTime = this.unlockedProductionUnits[i].endIn;
          this.firstEndingUnit = this.unlockedProductionUnits[i];
        }
      }
      // }

      // Full time
      if (
        this.unlockedProductionUnits[i].limit.lt(Decimal.MAX_VALUE) &&
        this.unlockedProductionUnits[i].perSec.gt(0)
      ) {
        const sol = this.unlockedProductionUnits[i].limit
          .minus(this.unlockedProductionUnits[i].quantity)
          .div(this.unlockedProductionUnits[i].perSec);
        if (sol.gt(0)) {
          this.unlockedProductionUnits[i].fullIn = sol.toNumber();
          if (this.unlockedProductionUnits[i].fullIn < this.maxTime) {
            this.maxTime = this.unlockedProductionUnits[i].fullIn;
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
    for (let i = 0, n = this.unlockedProductionUnits.length; i < n; i++) {
      this.unlockedProductionUnits[i].quantity = this.unlockedProductionUnits[
        i
      ].quantity.plus(this.unlockedProductionUnits[i].perSec.times(seconds));
    }
    for (let i = 0, n = this.unlockedProductionUnits.length; i < n; i++) {
      this.unlockedProductionUnits[i].quantity = this.unlockedProductionUnits[
        i
      ].quantity.max(0);
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

    Game.getGame().notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.MATERIAL_ENDED,
        this.firstEndingUnit.name + " Ended"
      )
    );

    if (OptionsService.instance.prodStopNoti) {
      MainService.instance.modal.closeAll();
      MainService.instance.modal.warning({
        nzTitle: "Production stopped",
        nzContent:
          "<p>" +
          this.firstEndingUnit.name +
          " has ended, all consumers have been stopped. You can reactivate them with the slider.</p>" +
          "<p>This message can be disabled in the ui options section.</p>"
      });
    }
  }
  postUpdate() {
    for (let i = 0, n = this.unlockedUnits.length; i < n; i++) {
      this.unlockedUnits[i].postUpdate();
    }
    this.deployComponents();
    let habSpaceStation = ZERO;
    let extraMining = ZERO;
    let extraEnergy = ZERO;
    const game = Game.getGame();
    for (let i = 0, n = this.spaceStations.length; i < n; i++) {
      this.spaceStations[i].reloadHabSpace();
    }
    for (let i = 0, n = this.spaceStations.length; i < n; i++) {
      const space = this.spaceStations[i].habSpace.times(
        this.spaceStations[i].quantity
      );
      habSpaceStation = habSpaceStation.plus(space);
      if (game.prestigeManager.extraMiningDistricts.active) {
        extraMining = extraMining.plus(
          space.times(EXTRA_DISTRICTS_FROM_STATIONS)
        );
      }
      if (game.prestigeManager.extraEnergyDistricts.active) {
        extraEnergy = extraEnergy.plus(
          space.times(EXTRA_DISTRICTS_FROM_STATIONS)
        );
      }
    }

    let habTotal = this.habitableSpace.quantity;
    let miningTotal = this.miningDistrict.quantity;
    let energyTotal = this.energyDistrict.quantity;

    for (let i = 0, n = this.buildings.length; i < n; i++) {
      const price = this.buildings[i].buyPrice.prices[
        this.buildings[i].buyPrice.prices.length - 1
      ];
      const spent = Decimal.sumGeometricSeries(
        this.buildings[i].quantity,
        price.cost,
        price.growRate,
        1
      );
      switch (price.spendable) {
        case game.resourceManager.habitableSpace:
          habTotal = habTotal.plus(spent);
          break;
        case game.resourceManager.miningDistrict:
          miningTotal = miningTotal.plus(spent);
          break;
        case game.resourceManager.energyDistrict:
          energyTotal = energyTotal.plus(spent);
          break;
      }
    }

    game.resourceManager.habitableSpace.spaceStationPercent = habSpaceStation
      .div(habTotal)
      .toNumber();
    game.resourceManager.miningDistrict.spaceStationPercent = extraMining
      .div(miningTotal)
      .toNumber();
    game.resourceManager.energyDistrict.spaceStationPercent = extraEnergy
      .div(energyTotal)
      .toNumber();

    //  Infrastructures
    for (let i = 0, n = this.infrastructures.length; i < n; i++) {
      this.infrastructures[i].reloadBonus();
    }
    this.infraBonusUnit.reloadQuantity();
  }
  deployComponents() {
    if (this.components.quantity.lte(0.1)) {
      return false;
    }
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
      if (
        this.unlockedWorkers[i].quantity
          .minus(this.unlockedWorkers[i].limit)
          .gt(Number.EPSILON)
      ) {
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
  makeUnitsMods() {
    const rm = Game.getGame().researchManager;
    this.workers.forEach((unit) => {
      if ("mods" in unit.unitData) {
        unit.maxTechMods = [];
        for (const row of unit.unitData.mods) {
          const technology = rm.technologies.find(
            (t) => t.id === row.technologyId
          );
          if (technology) {
            unit.maxTechMods.push({
              technology,
              multi: row.multi
            });
          }
        }
      }
    });
  }
  makeDepartments() {
    this.buildings.forEach((building) => {
      if (building.unitData.departments) {
        building.departments = [];
        const rm = Game.getGame().researchManager;
        let worker: Worker;
        let tech: Technology;
        switch (building.id) {
          case "1":
            worker = this.miner;
            tech = rm.miningTech;
            break;
          case "2":
            worker = this.technician;
            tech = rm.energyTech;
            break;
          case "3":
            worker = this.scientist;
            tech = rm.physicsTech;
            break;
          case "4":
            worker = this.metallurgist;
            tech = rm.materialsTech;
            break;
          case "5":
            worker = this.worker;
            tech = rm.civilEngTech;
            break;
          case "6":
            worker = this.searcher;
            tech = rm.searchTech;
            break;
          case "7":
            worker = this.replicator;
            tech = rm.roboticsTech;
            break;
          case "10":
            worker = this.nukeDrone;
            tech = rm.militaryEngTech;
            break;
        }
        building.unitData.departments.forEach((dep) => {
          const department = new Department(dep);
          switch (department.id) {
            case "r": //  R&D
              this.scientist.limitStack.bonuses.push(
                new Bonus(building, ONE, department)
              );
              if (tech) {
                tech.technologyBonus.bonuses.push(
                  new Bonus(building, DEPARTMENT_TECH_MULTI, department)
                );
                department.description +=
                  "; +" +
                  DEPARTMENT_TECH_MULTI.times(100).toString() +
                  "% " +
                  tech.name +
                  " tech. increase speed";
              }
              break;
            case "s": //  Storage
              if (building.id === "2") {
                department.description =
                  "+ " + STORAGE_DEPARTMENT_MULTI * 100 + "% energy storage";
                if (!this.energy.limitStackMulti) {
                  this.energy.limitStackMulti = new BonusStack();
                }
                this.energy.limitStackMulti.bonuses.push(
                  new Bonus(
                    building,
                    new Decimal(STORAGE_DEPARTMENT_MULTI),
                    department
                  )
                );
              } else if (building.id === "7") {
                department.description =
                  "+ " +
                  STORAGE_DEPARTMENT_MULTI * 100 +
                  "% components storage";
                if (!this.components.limitStackMulti) {
                  this.components.limitStackMulti = new BonusStack();
                }
                this.components.limitStackMulti.bonuses.push(
                  new Bonus(
                    building,
                    new Decimal(STORAGE_DEPARTMENT_MULTI),
                    department
                  )
                );
              } else if (building.id === "10") {
                department.description =
                  "+ " + STORAGE_DEPARTMENT_MULTI * 100 + "% nuke storage";
                if (!this.nuke.limitStackMulti) {
                  this.nuke.limitStackMulti = new BonusStack();
                }
                this.nuke.limitStackMulti.bonuses.push(
                  new Bonus(
                    building,
                    new Decimal(STORAGE_DEPARTMENT_MULTI),
                    department
                  )
                );
              }
              break;
            case "p": // Production
              worker.limitStack.bonuses.push(
                new Bonus(building, new Decimal(2), department)
              );
              worker.prodEfficiency.bonuses.push(
                new Bonus(building, new Decimal(0.01), department)
              );
              break;
            case "m": // Drones
              this.replicator.limitStack.bonuses.push(
                new Bonus(building, new Decimal(2), department)
              );
              break;
          }

          building.departments.push(department);
        });
      }
    });
  }
  setRelations() {
    const sm = Game.getGame().shipyardManager; //  Gateway
    sm.accelerationStack.bonuses.push(
      new Bonus(this.gateway, new Decimal(MEGA_SPEED_MULTI))
    );
    this.infraBonusUnit = new InfraBonusUnit();
    const infraBonus = new Bonus(this.infraBonusUnit, ONE);
    sm.velocityBonusStack.bonuses.push(infraBonus);
    sm.accelerationStack.bonuses.push(infraBonus);
  }
  prestige() {
    this.units.forEach((u) => u.prestige());
    this.reloadLists();
  }
  //#region Save and Load
  getSave(): any {
    return {
      l: this.units.map((u) => u.getSave())
    };
  }
  load(data: any) {
    if (!("l" in data)) {
      throw new Error("Save not valid! missing units");
    }
    for (const uData of data.l) {
      const unit = this.units.find((u) => u.id === uData.i);
      unit.load(uData);
      if (unit.quantity.gt(0)) unit.unlocked = true;
    }
    if (this.scientist.unlocked) {
      this.science.unlock();
    }
    if (this.metallurgist.unlocked) {
      this.alloy.unlock();
    }
    if (this.worker.unlocked) {
      this.shipyardWork.unlock();
    }
    if (this.searcher.unlocked) {
      this.search.unlock();
    }
    if (this.replicator.unlocked) {
      this.components.unlock();
    }
    if (this.nukeDrone.unlocked) {
      this.nuke.unlock();
    }
    this.reloadLists();
  }
  //#endregion
}
