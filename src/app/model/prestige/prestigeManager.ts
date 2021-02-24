import {
  ZERO,
  ONE,
  DRONE_PRESTIGE_PRODUCTION,
  PRESTIGE_PRICE,
  DRONE_PRESTIGE_EFFICIENCY,
  PRESTIGE_MULTI_PER_LEVEL,
  PRESTIGE_MULTI_EXP,
  TECH_PRESTIGE_MULTI,
  DRONE_PRESTIGE_START_OFFER,
  DISTRICT_PRESTIGE_MULTI,
  MATERIAL_PRESTIGE_MULTI,
  COMPONENT_PRESTIGE_MULTI,
  MORE_UP_PRESTIGE,
  PRODUCTION_CARD,
  EFFICIENCY_CARD,
  MORE_DRONES_CARD,
  RECYCLING_CARD,
  COMPONENTS_CARD,
  MATERIALS_CARD,
  DISTRICTS_CARD,
  TECHNOLOGY_CARD,
  COMPUTING_REGENERATION_CARD,
  VELOCITY_PRESTIGE_MULTI,
  PRODUCTION_PEACE_CARD,
  BETTER_SPACE_STATION_PRESTIGE,
  MORE_HAB_FROM_STATIONS,
  KILL_STREAK_SPEED_CARD,
  CHALLENGE_XP_MULTI,
  MOD_LEVEL_PRESTIGE,
  SHIP_JOB_PRESTIGE,
  MEGA_BUILD_SPEED_CARD,
  CIV_JOB_BUILD_SPEED,
  MEGA_JOB_BUILD_SPEED,
  MORE_PRODUCTION,
  SPEED_PRESTIGE,
  ACCELERATION_PRESTIGE,
  COMPUTING_BONUS,
  COMPUTING_SEC_BONUS,
  MAX_MOD_PRESTIGE,
  MAX_DRONES_PRESTIGE,
  FAST_SEARCH,
  ENERGY_PRODUCTION_PRESTIGE,
  ENERGY_STORAGE_PRESTIGE,
  MINING_PRESTIGE,
  PRESTIGE_TECH_UNLOCK,
  MORE_STORAGE_PRESTIGE,
  MORE_STORAGE_CARD,
  FLEET_CAPACITY_CARD,
  DRONE_PRESTIGE_QUANTITY,
  PRESTIGE_PRICE_SUPER,
  FLEET_CAPACITY_PRESTIGE
} from "../CONSTANTS";
import { Game } from "../game";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { MainService } from "src/app/main.service";
import { PrestigePoint } from "./prestigePoint";
import { Bonus } from "../bonus/bonus";
import { PrestigeCard } from "./prestigeCard";
import { PRESTIGE_CARDS } from "../data/prestigeCard";
import { BonusStack } from "../bonus/bonusStack";
import { IBase } from "../iBase";
import { Technology } from "../researches/technology";
import { Module } from "../shipyard/module";
import { Spell } from "../computing/spell";

export class PrestigeManager {
  experience = ZERO;
  prestigeMultiplier = ONE;
  nextPrestigeMultiplier = ONE;
  realNextPrestigeMultiplier = ONE;
  prestigePoints = new Array<PrestigePoint>();
  tabs = new Array<{
    name: string;
    icon: string;
    prestige: PrestigePoint[];
  }>();
  techTabs = new Array<{
    name: string;
    icon: string;
    prestige: PrestigePoint[];
  }>();
  cards = new Array<PrestigeCard>();
  maxCards = 0;
  lockedCars = false;
  minLevelToIncrease = 1;
  ipotetchicalMultiplier = ONE;
  totalSpent = ZERO;
  techPointsUnlocked = false;
  //#region Prestige
  modLevelPrestige: PrestigePoint;
  shipJobPrestige: PrestigePoint;
  maxMods: PrestigePoint;
  moreStorage: PrestigePoint;
  plusOneResearch: PrestigePoint;
  //#endregion
  //#region Special cards
  victoryWarp: PrestigeCard;
  enemyDefeatWarp: PrestigeCard;
  moreWarp: PrestigeCard;
  scienceWarp: PrestigeCard;
  inspiration: PrestigeCard;
  inspirationTechnology: PrestigeCard;
  updateWarp: PrestigeCard;
  longerSpells: PrestigeCard;
  moreExp: PrestigeCard;
  moreDM: PrestigeCard;
  moreComputing: PrestigeCard;
  moreHabSpaceFromStations: PrestigeCard;
  navalCapCard: PrestigeCard;
  doubleModsCard: PrestigeCard;
  doubleDepartmentsCard: PrestigeCard;
  noDecreasePrestige: PrestigeCard;
  extraMiningDistricts: PrestigeCard;
  extraEnergyDistricts: PrestigeCard;
  doubleRepeatableResearches: PrestigeCard;
  battleWarp: PrestigeCard;
  modWarp: PrestigeCard;
  spaceStationWarp: PrestigeCard;
  killStreakGain: PrestigeCard;
  megaBuildSpeed: PrestigeCard;
  challengeMultiplier: PrestigeCard;
  fleetCapCard: PrestigeCard;
  autoPrestigeCard: PrestigeCard;
  autoWarp: PrestigeCard;
  extremeModsCard: PrestigeCard;
  lowerModulePrice: PrestigeCard;
  killStreakWinCard: PrestigeCard;
  megaAutomationCard: PrestigeCard;
  extendedSearchCard: PrestigeCard;
  favouriteModuleCard: PrestigeCard;
  favouriteSpellCard: PrestigeCard;
  achievementMultiplierCard: PrestigeCard;
  //#endregion
  //#region Others
  favouriteModule: Module;
  favouriteSpell: Spell;
  //#endregion
  customBuyString = "100";
  customBuy = new Decimal(100);
  prestigePage = false;
  constructor() {
    this.generateExperience();
    this.generateCards();
  }
  generateExperience() {
    const rm = Game.getGame().resourceManager;
    const sm = Game.getGame().researchManager;
    const sp = Game.getGame().shipyardManager;
    const cm = Game.getGame().spaceStationManager;
    const co = Game.getGame().computingManager;
    const em = Game.getGame().enemyManager;
    //#region Drones
    const dronePrestigeList = new Array<PrestigePoint>();

    //  Starter pack
    const starterPack = new PrestigePoint();
    starterPack.id = "d0";
    starterPack.name = "Starter Pack";
    starterPack.description =
      "Drones yields and consume " +
      DRONE_PRESTIGE_START_OFFER * 100 +
      "% more";
    starterPack.price = new Decimal(PRESTIGE_PRICE / 2);
    starterPack.max = new Decimal(10);
    this.prestigePoints.push(starterPack);
    dronePrestigeList.push(starterPack);

    //  Drones yields and consume more
    const droneMulti = new PrestigePoint();
    droneMulti.id = "d1";
    droneMulti.name = "Drones production prestige";
    droneMulti.description =
      "Drones yields and consume " + DRONE_PRESTIGE_PRODUCTION * 100 + "% more";
    droneMulti.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(droneMulti);
    dronePrestigeList.push(droneMulti);

    //  Drones efficiency
    const droneEff = new PrestigePoint();
    droneEff.id = "d2";
    droneEff.name = "Drones efficiency prestige";
    droneEff.description =
      "Drones yields " + DRONE_PRESTIGE_EFFICIENCY * 100 + "% more";
    droneEff.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(droneEff);
    dronePrestigeList.push(droneEff);

    //  Drones quantity
    const droneQty = new PrestigePoint();
    droneQty.id = "d3";
    droneQty.name = "Drones quantity prestige";
    droneQty.description =
      "+" + DRONE_PRESTIGE_QUANTITY * 100 + "% more drones";
    droneQty.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(droneQty);
    dronePrestigeList.push(droneQty);

    this.tabs.push({
      name: "Drones",
      icon: "my:vintage-robot",
      prestige: dronePrestigeList
    });
    const startBon = new Bonus(
      starterPack,
      new Decimal(DRONE_PRESTIGE_START_OFFER)
    );
    const prodBon = new Bonus(
      droneMulti,
      new Decimal(DRONE_PRESTIGE_PRODUCTION)
    );
    const effBon = new Bonus(droneEff, new Decimal(DRONE_PRESTIGE_EFFICIENCY));
    const qtyBon = new Bonus(droneQty, DRONE_PRESTIGE_QUANTITY);
    rm.workers.forEach((w) => {
      w.prodAllBonus.bonuses.push(startBon);
      w.prodAllBonus.bonuses.push(prodBon);
      w.prodEfficiency.bonuses.push(effBon);
      w.limitStackMulti.bonuses.push(qtyBon);
    });
    //#endregion
    //#region Science
    const scienceList = new Array<PrestigePoint>();
    this.tabs.push({
      name: "Science",
      icon: "fa-s:flask",
      prestige: scienceList
    });
    //  Tech Multi
    const techMulti = new PrestigePoint();
    techMulti.id = "s1";
    techMulti.name = "Increase technology gain";
    techMulti.description =
      "All technologies increase " + TECH_PRESTIGE_MULTI * 100 + "% faster";
    techMulti.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(techMulti);
    scienceList.push(techMulti);
    sm.technologies.forEach((tech) => {
      tech.technologyBonus.bonuses.push(
        new Bonus(techMulti, new Decimal(TECH_PRESTIGE_MULTI))
      );
    });
    //  +1 researches
    this.plusOneResearch = new PrestigePoint();
    this.plusOneResearch.id = "s2";
    this.plusOneResearch.name = "Research +1";
    this.plusOneResearch.description =
      "Repeatable researches can be repeated one time more";
    this.plusOneResearch.price = new Decimal(PRESTIGE_PRICE_SUPER);
    this.prestigePoints.push(this.plusOneResearch);
    scienceList.push(this.plusOneResearch);
    this.plusOneResearch.onBuy = (qty: Decimal) => {
      Game.getGame().researchManager.researches.forEach((r) => r.loadMax());
    };

    //#endregion
    //#region War
    const warList = new Array<PrestigePoint>();
    this.tabs.push({
      name: "War",
      icon: "my:strafe",
      prestige: warList
    });
    const distMulti = new PrestigePoint();
    distMulti.id = "w1";
    distMulti.name = "More Districts";
    distMulti.description =
      "Gain " + DISTRICT_PRESTIGE_MULTI * 100 + "% more district from enemies";
    distMulti.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(distMulti);
    warList.push(distMulti);
    rm.districts.forEach((dis) => {
      dis.battleGainMulti.bonuses.push(
        new Bonus(distMulti, new Decimal(DISTRICT_PRESTIGE_MULTI))
      );
    });

    const matMulti = new PrestigePoint();
    matMulti.id = "w2";
    matMulti.name = "More Materials";
    matMulti.description =
      "Gain " + MATERIAL_PRESTIGE_MULTI * 100 + "% more materials from enemies";
    matMulti.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(matMulti);
    warList.push(matMulti);
    rm.materials.forEach((dis) => {
      dis.battleGainMulti.bonuses.push(
        new Bonus(matMulti, new Decimal(MATERIAL_PRESTIGE_MULTI))
      );
    });

    const compMulti = new PrestigePoint();
    compMulti.id = "w3";
    compMulti.name = "More Components";
    compMulti.description =
      "Gain " +
      COMPONENT_PRESTIGE_MULTI * 100 +
      "% more components from enemies";
    compMulti.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(compMulti);
    warList.push(compMulti);
    rm.components.battleGainMulti.bonuses.push(
      new Bonus(compMulti, new Decimal(COMPONENT_PRESTIGE_MULTI))
    );

    const speedMulti = new PrestigePoint();
    speedMulti.id = "w4";
    speedMulti.name = "More Velocity and Acceleration";
    speedMulti.description =
      "+" + VELOCITY_PRESTIGE_MULTI * 100 + "% ship speed";
    speedMulti.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(speedMulti);
    warList.push(speedMulti);
    const speedBonus = new Bonus(
      speedMulti,
      new Decimal(VELOCITY_PRESTIGE_MULTI)
    );
    sp.velocityBonusStack.bonuses.push(speedBonus);
    sp.accelerationStack.bonuses.push(speedBonus);
    //#endregion
    //#region Misc
    const miscList = new Array<PrestigePoint>();
    this.tabs.push({
      name: "Misc",
      icon: "my:cube",
      prestige: miscList
    });
    const moreIdle = new PrestigePoint();
    moreIdle.id = "m1";
    moreIdle.name = "More Idle time";
    moreIdle.description =
      "+" +
      MORE_UP_PRESTIGE * 100 +
      "% idle gain when idling for 6 or more hours";
    moreIdle.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(moreIdle);
    miscList.push(moreIdle);
    Game.getGame().idleTimeMultipliers.bonuses.push(
      new Bonus(moreIdle, new Decimal(MORE_UP_PRESTIGE))
    );

    const moreSpaceStationSpace = new PrestigePoint();
    moreSpaceStationSpace.id = "m2";
    moreSpaceStationSpace.name = "Better Space Stations";
    moreSpaceStationSpace.description =
      "+" +
      BETTER_SPACE_STATION_PRESTIGE * 100 +
      "% habitable space from space stations";
    moreSpaceStationSpace.price = new Decimal(PRESTIGE_PRICE);
    this.prestigePoints.push(moreSpaceStationSpace);
    miscList.push(moreSpaceStationSpace);
    Game.getGame().resourceManager.spaceStations.forEach((spaceStation) => {
      spaceStation.habSpaceStack.bonuses.push(
        new Bonus(moreSpaceStationSpace, new Decimal(MORE_UP_PRESTIGE))
      );
    });

    this.moreStorage = new PrestigePoint();
    this.moreStorage.id = "m3";
    this.moreStorage.name = "More Storage";
    this.moreStorage.description =
      "+" +
      MORE_STORAGE_PRESTIGE * 100 +
      "% more energy, components and nuke storage.";
    this.prestigePoints.push(this.moreStorage);
    miscList.push(this.moreStorage);
    const moreStorageBonus = new Bonus(
      this.moreStorage,
      new Decimal(MORE_STORAGE_PRESTIGE)
    );
    Game.getGame().resourceManager.energy.limitStackMulti.bonuses.push(
      moreStorageBonus
    );
    Game.getGame().resourceManager.components.limitStackMulti.bonuses.push(
      moreStorageBonus
    );
    Game.getGame().resourceManager.nuke.limitStackMulti.bonuses.push(
      moreStorageBonus
    );

    //#endregion
    //#region Technologies
    const tecPrestiges = new Array<{
      tec: Technology;
      prestiges: PrestigePoint[];
    }>();
    //#region Military
    this.modLevelPrestige = new PrestigePoint();
    this.modLevelPrestige.id = "Y1";
    this.modLevelPrestige.name = "Higher modules level";
    this.modLevelPrestige.description =
      "Increases all ships module level by " + MOD_LEVEL_PRESTIGE * 100 + "%";

    this.shipJobPrestige = new PrestigePoint();
    this.shipJobPrestige.id = "Y2";
    this.shipJobPrestige.name = "Faster ship construction";
    this.shipJobPrestige.description =
      "Increases ships build and upgrade speed by " +
      SHIP_JOB_PRESTIGE * 100 +
      "%";
    sp.shipsProductionBonuses.push(
      new Bonus(this.shipJobPrestige, new Decimal(SHIP_JOB_PRESTIGE))
    );

    tecPrestiges.push({
      tec: sm.militaryEngTech,
      prestiges: [this.modLevelPrestige, this.shipJobPrestige]
    });
    //#endregion
    //#region Civilian
    const civBuildPrestige = new PrestigePoint();
    civBuildPrestige.id = "C1";
    civBuildPrestige.name = "Faster civilian construction";
    civBuildPrestige.description =
      "Increase all civilian job build speed by " + CIV_JOB_BUILD_SPEED + "%";
    cm.commonBonuses.push(
      new Bonus(civBuildPrestige, new Decimal(CIV_JOB_BUILD_SPEED))
    );

    const megaPrestige = new PrestigePoint();
    megaPrestige.id = "C2";
    megaPrestige.name = "Faster mega structure construction";
    megaPrestige.description =
      "Increase all mega structure build speed by " +
      MEGA_JOB_BUILD_SPEED +
      "%";
    cm.megaBonuses.push(
      new Bonus(civBuildPrestige, new Decimal(CIV_JOB_BUILD_SPEED))
    );

    const moreWork = new PrestigePoint();
    moreWork.id = "C3";
    moreWork.name = "More Work";
    moreWork.description =
      "Workers yeild and consume " + MORE_PRODUCTION + "% more";
    rm.worker.prodAllBonus.bonuses.push(
      new Bonus(moreWork, new Decimal(MORE_PRODUCTION))
    );

    tecPrestiges.push({
      tec: sm.civilEngTech,
      prestiges: [moreWork, civBuildPrestige, megaPrestige]
    });
    //#endregion
    //#region Physics
    const moreScience = new PrestigePoint();
    moreScience.id = "H1";
    moreScience.name = "More Science";
    moreScience.description =
      "Scientist yeild and consume " + MORE_PRODUCTION * 100 + "% more";
    rm.scientist.prodAllBonus.bonuses.push(
      new Bonus(moreScience, new Decimal(MORE_PRODUCTION))
    );

    tecPrestiges.push({
      tec: sm.physicsTech,
      prestiges: [moreScience]
    });
    //#endregion
    //#region Materials
    const moreAlloy = new PrestigePoint();
    moreAlloy.id = "A1";
    moreAlloy.name = "More Alloy";
    moreAlloy.description =
      "Metallurgists yeild and consume " + MORE_PRODUCTION * 100 + "% more";
    rm.metallurgist.prodAllBonus.bonuses.push(
      new Bonus(moreAlloy, new Decimal(MORE_PRODUCTION))
    );

    tecPrestiges.push({
      tec: sm.materialsTech,
      prestiges: [moreAlloy]
    });
    //#endregion
    //#region Propulsion
    const speed = new PrestigePoint();
    speed.id = "P1";
    speed.name = "Higher Speed";
    speed.description =
      "Increase ships speed " + SPEED_PRESTIGE * 100 + "% more";
    sp.velocityBonusStack.bonuses.push(
      new Bonus(speed, new Decimal(SPEED_PRESTIGE))
    );

    const acceleration = new PrestigePoint();
    acceleration.id = "P2";
    acceleration.name = "Higher Acceleration";
    acceleration.description =
      "Increase ships acceleration " + ACCELERATION_PRESTIGE * 100 + "% more";
    sp.accelerationStack.bonuses.push(
      new Bonus(acceleration, new Decimal(ACCELERATION_PRESTIGE))
    );
    tecPrestiges.push({
      tec: sm.propulsionTech,
      prestiges: [speed, acceleration]
    });
    //#endregion
    //#region Computing
    const maxComputing = new PrestigePoint();
    maxComputing.id = "U1";
    maxComputing.name = "Max Computing";
    maxComputing.description = "Increase max computing by " + COMPUTING_BONUS;
    co.maxComputingStack.bonuses.push(
      new Bonus(maxComputing, new Decimal(COMPUTING_BONUS))
    );

    const moreComputing = new PrestigePoint();
    moreComputing.id = "U2";
    moreComputing.name = "Computing Regeneration";
    moreComputing.description =
      "Increase computing regeneration by " + COMPUTING_SEC_BONUS * 100 + "%";
    co.computingStack.bonuses.push(
      new Bonus(moreComputing, new Decimal(COMPUTING_SEC_BONUS))
    );

    tecPrestiges.push({
      tec: sm.computingTech,
      prestiges: [maxComputing, moreComputing]
    });
    //#endregion
    //#region Robotics
    this.maxMods = new PrestigePoint();
    this.maxMods.id = "R1";
    this.maxMods.name = "More Mod points";
    this.maxMods.description =
      "Increase max mod points by " + MAX_MOD_PRESTIGE * 100 + "%";

    const maxDrones = new PrestigePoint();
    maxDrones.id = "R2";
    maxDrones.name = "Max Drones prestige";
    maxDrones.description =
      "Increase max drones by " + MAX_DRONES_PRESTIGE * 100 + "%";

    const maxDroneBonus = new Bonus(
      maxDrones,
      new Decimal(MAX_DRONES_PRESTIGE)
    );
    rm.workers.forEach((w) => {
      w.limitStackMulti.bonuses.push(maxDroneBonus);
    });

    tecPrestiges.push({
      tec: sm.roboticsTech,
      prestiges: [maxDrones, this.maxMods]
    });
    //#endregion
    //#region Naval
    const fleetCapacity = new PrestigePoint();
    fleetCapacity.id = "W1";
    fleetCapacity.name = "Fleet capacity";
    fleetCapacity.price = new Decimal(100);
    fleetCapacity.description =
      "+" + FLEET_CAPACITY_PRESTIGE + " fleet capacity";
    Game.getGame().shipyardManager.additiveFleetCapStack.bonuses.push(
      new Bonus(fleetCapacity, FLEET_CAPACITY_PRESTIGE)
    );

    tecPrestiges.push({
      tec: sm.navalCapTech,
      prestiges: [fleetCapacity]
    });
    //#endregion
    //#region Search
    const fastSearch = new PrestigePoint();
    fastSearch.id = "S1";
    fastSearch.name = "Optimised Search";
    fastSearch.description =
      "Increase searching speed by " + FAST_SEARCH * 100 + "%";

    em.searchBonuses.push(new Bonus(fastSearch, new Decimal(FAST_SEARCH)));

    tecPrestiges.push({
      tec: sm.searchTech,
      prestiges: [fastSearch]
    });
    //#endregion
    //#region Energy
    const energyProduction = new PrestigePoint();
    energyProduction.id = "E1";
    energyProduction.name = "Energy Production";
    energyProduction.description =
      "Technicians yeild " + ENERGY_PRODUCTION_PRESTIGE * 100 + "% more";

    const energyStorage = new PrestigePoint();
    energyStorage.id = "E2";
    energyStorage.name = "Energy Storage";
    energyStorage.description =
      "Increase energy storage by " + ENERGY_STORAGE_PRESTIGE * 100 + "%";

    rm.technician.prodEfficiency.bonuses.push(
      new Bonus(energyProduction, new Decimal(ENERGY_PRODUCTION_PRESTIGE))
    );
    rm.energy.limitStackMulti.bonuses.push(
      new Bonus(energyStorage, new Decimal(ENERGY_STORAGE_PRESTIGE))
    );

    tecPrestiges.push({
      tec: sm.energyTech,
      prestiges: [energyProduction, energyStorage]
    });
    //#endregion
    //#region Mining
    const moreMining = new PrestigePoint();
    moreMining.id = "M1";
    moreMining.name = "More Metal";
    moreMining.description =
      "Miners yeild and consume " + MINING_PRESTIGE * 100 + "% more";

    rm.miner.prodAllBonus.bonuses.push(
      new Bonus(moreMining, new Decimal(MINING_PRESTIGE))
    );

    tecPrestiges.push({
      tec: sm.miningTech,
      prestiges: [moreMining]
    });
    //#endregion
    tecPrestiges.forEach((tp) => {
      this.techTabs.push({
        name: tp.tec.name,
        icon: tp.tec.icon,
        prestige: tp.prestiges
      });
      const techMulti2 = new PrestigePoint();
      techMulti2.id = tp.tec.id + "-";
      techMulti2.name = "Faster " + tp.tec.name;
      techMulti2.description =
        tp.tec.name + " increases " + TECH_PRESTIGE_MULTI * 100 + "% faster";
      techMulti2.price = new Decimal(PRESTIGE_PRICE);
      tp.prestiges.forEach((pre) => {
        pre.requiredPoint = techMulti2;
      });
      tp.prestiges.unshift(techMulti2);
      tp.tec.technologyBonus.bonuses.push(
        new Bonus(techMulti2, new Decimal(TECH_PRESTIGE_MULTI))
      );
      tp.prestiges.forEach((point) => this.prestigePoints.push(point));
    });
    //#endregion

    this.prestigePoints.forEach((point) => {
      if (point.requiredPoint) {
        point.requiredPoint.dependantPoints =
          point.requiredPoint.dependantPoints || [];
        point.requiredPoint.dependantPoints.push(point);
      }
    });
  }
  generateCards() {
    const rm = Game.getGame().resourceManager;
    const sm = Game.getGame().researchManager;
    const cm = Game.getGame().computingManager;
    const sy = Game.getGame().shipyardManager;
    const sp = Game.getGame().spaceStationManager;
    this.cards = PRESTIGE_CARDS.map((data) => new PrestigeCard(data));
    //#region Drones
    const prodCard = this.cards.find((card) => card.id === "0");
    const effCard = this.cards.find((card) => card.id === "1");
    const moreDrones = this.cards.find((card) => card.id === "2");
    const recycling = this.cards.find((card) => card.id === "3");
    const peaceCard = this.cards.find((card) => card.id === "4");
    this.doubleModsCard = this.cards.find((card) => card.id === "5");
    this.extremeModsCard = this.cards.find((card) => card.id === "6");
    const storageCard = this.cards.find((card) => card.id === "7");
    Game.getGame().recyclingMulti.bonuses.push(
      new Bonus(recycling, new Decimal(RECYCLING_CARD))
    );

    const isInWar: IBase = {
      id: "inWar",
      name: "In War",
      typeIcon: "",
      get quantity() {
        return Game.getGame().enemyManager.currentEnemy ? ZERO : ONE;
      }
    };

    rm.workers.forEach((w) => {
      w.prodAllBonus.bonuses.push(
        new Bonus(prodCard, new Decimal(PRODUCTION_CARD))
      );
      w.prodEfficiency.bonuses.push(
        new Bonus(peaceCard, new Decimal(PRODUCTION_PEACE_CARD), isInWar)
      );
      w.prodEfficiency.bonuses.push(
        new Bonus(effCard, new Decimal(EFFICIENCY_CARD))
      );
      if (!w.limitStackMulti) w.limitStackMulti = new BonusStack();
      w.limitStackMulti.bonuses.push(
        new Bonus(moreDrones, new Decimal(MORE_DRONES_CARD))
      );
    });

    const moreStorageBonus = new Bonus(
      storageCard,
      new Decimal(MORE_STORAGE_CARD)
    );
    Game.getGame().resourceManager.energy.limitStackMulti.bonuses.push(
      moreStorageBonus
    );
    Game.getGame().resourceManager.components.limitStackMulti.bonuses.push(
      moreStorageBonus
    );
    Game.getGame().resourceManager.nuke.limitStackMulti.bonuses.push(
      moreStorageBonus
    );
    //#endregion
    //#region Science
    const technology = this.cards.find((card) => card.id === "r0");
    this.inspiration = this.cards.find((card) => card.id === "r1");
    this.inspirationTechnology = this.cards.find((card) => card.id === "r2");
    this.doubleRepeatableResearches = this.cards.find(
      (card) => card.id === "r3"
    );
    sm.technologies.forEach((tech) => {
      tech.technologyBonus.bonuses.push(
        new Bonus(technology, new Decimal(TECHNOLOGY_CARD))
      );
    });
    //#endregion
    //#region War
    const districts = this.cards.find((card) => card.id === "w0");
    const materials = this.cards.find((card) => card.id === "w1");
    const components = this.cards.find((card) => card.id === "w2");
    this.victoryWarp = this.cards.find((card) => card.id === "w3");
    this.enemyDefeatWarp = this.cards.find((card) => card.id === "w4");
    this.navalCapCard = this.cards.find((card) => card.id === "w5");
    const killStreakSpeed = this.cards.find((card) => card.id === "w6");
    this.killStreakGain = this.cards.find((card) => card.id === "w7");
    this.fleetCapCard = this.cards.find((card) => card.id === "w8");
    this.lowerModulePrice = this.cards.find((card) => card.id === "w9");
    this.killStreakWinCard = this.cards.find((card) => card.id === "w10");
    this.favouriteModuleCard = this.cards.find((card) => card.id === "w11");

    const killStreak: IBase = {
      id: "kiS",
      name: "Kill Streak",
      typeIcon: "",
      get quantity() {
        return new Decimal(Game.getGame().enemyManager.killStreak);
      }
    };

    const districtsBon = new Bonus(districts, new Decimal(DISTRICTS_CARD));
    rm.districts.forEach((dis) => {
      dis.battleGainMulti.bonuses.push(districtsBon);
    });

    const matBon = new Bonus(materials, new Decimal(MATERIALS_CARD));
    rm.materials.forEach((dis) => {
      dis.battleGainMulti.bonuses.push(matBon);
    });

    const compBon = new Bonus(components, new Decimal(COMPONENTS_CARD));
    rm.components.battleGainMulti.bonuses.push(compBon);

    const killStreakBonus = new Bonus(
      killStreakSpeed,
      new Decimal(KILL_STREAK_SPEED_CARD),
      killStreak
    );
    sy.velocityBonusStack.bonuses.push(killStreakBonus);
    sy.accelerationStack.bonuses.push(killStreakBonus);

    sy.additiveFleetCapStack.bonuses.push(
      new Bonus(this.fleetCapCard, new Decimal(FLEET_CAPACITY_CARD))
    );
    Game.getGame().multiNavalCapStack.bonuses.push(
      new Bonus(this.navalCapCard, ONE)
    );

    //#endregion
    //#region Warp
    this.moreWarp = this.cards.find((card) => card.id === "p0");
    this.scienceWarp = this.cards.find((card) => card.id === "p1");
    this.updateWarp = this.cards.find((card) => card.id === "p2");
    this.battleWarp = this.cards.find((card) => card.id === "p3");
    this.modWarp = this.cards.find((card) => card.id === "p4");
    this.spaceStationWarp = this.cards.find((card) => card.id === "p5");
    this.autoWarp = this.cards.find((card) => card.id === "p6");
    //#endregion
    //#region Computing
    this.longerSpells = this.cards.find((card) => card.id === "s0");
    const computingRegeneration = this.cards.find((card) => card.id === "s1");
    this.moreComputing = this.cards.find((card) => card.id === "s2");
    this.favouriteSpellCard = this.cards.find((card) => card.id === "s3");
    cm.computingStackMulti.bonuses.push(
      new Bonus(computingRegeneration, new Decimal(COMPUTING_REGENERATION_CARD))
    );
    //#endregion
    //#region Misc
    this.moreExp = this.cards.find((card) => card.id === "m0");
    this.moreDM = this.cards.find((card) => card.id === "m1");
    this.moreHabSpaceFromStations = this.cards.find((card) => card.id === "m2");
    this.doubleDepartmentsCard = this.cards.find((card) => card.id === "m3");
    this.noDecreasePrestige = this.cards.find((card) => card.id === "m4");
    this.extraMiningDistricts = this.cards.find((card) => card.id === "m5");
    this.extraEnergyDistricts = this.cards.find((card) => card.id === "m6");
    this.megaBuildSpeed = this.cards.find((card) => card.id === "m7");
    this.autoPrestigeCard = this.cards.find((card) => card.id === "m8");
    this.megaAutomationCard = this.cards.find((card) => card.id === "m9");
    const moreHabBonus = new Bonus(
      this.moreHabSpaceFromStations,
      new Decimal(MORE_HAB_FROM_STATIONS)
    );
    rm.spaceStations.forEach((spaceStation) => {
      spaceStation.habSpaceStack.bonuses.push(moreHabBonus);
    });
    sp.megaBonuses.push(
      new Bonus(this.megaBuildSpeed, new Decimal(MEGA_BUILD_SPEED_CARD))
    );
    //#endregion
    //#region multipliers
    this.challengeMultiplier = this.cards.find((card) => card.id === "c0");
    this.achievementMultiplierCard = this.cards.find((card) => card.id === "A");
    //#endregion
    //#region Search
    this.extendedSearchCard = this.cards.find((card) => card.id === "k0");
    //#endregion
  }
  addExperience(quantity: Decimal) {
    this.experience = this.experience.plus(quantity);
    Game.getGame().notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.EXPERIENCE,
        "EXP: " + MainService.formatPipe.transform(quantity, true)
      )
    );
  }
  loadNextMultiplier() {
    if (Game.getGame().challengeManager.noMultiplierChallenge.isActive) {
      this.realNextPrestigeMultiplier = ONE;
      this.nextPrestigeMultiplier = ONE;
      this.ipotetchicalMultiplier = ONE;
      return true;
    }
    const maxEnemyLevel = Game.getGame().enemyManager.maxLevel;
    let realNextPrestigeMultiplier = ONE.plus(
      maxEnemyLevel * PRESTIGE_MULTI_PER_LEVEL
    ).pow(PRESTIGE_MULTI_EXP);
    const nonMultiplied = realNextPrestigeMultiplier;

    //  Challenges
    const completedChallenges = Game.getGame()
      .challengeManager.completed.times(CHALLENGE_XP_MULTI)
      .toNumber();
    if (this.challengeMultiplier.active) {
      realNextPrestigeMultiplier = realNextPrestigeMultiplier.times(
        1 + completedChallenges
      );
    }

    //  Challenges
    if (this.achievementMultiplierCard.active) {
      realNextPrestigeMultiplier = realNextPrestigeMultiplier.times(
        1 + Game.getGame().achievementManager.quantity / 100
      );
    }

    let nextPrestigeMultiplier = ONE;
    if (this.noDecreasePrestige.active) {
      nextPrestigeMultiplier = this.prestigeMultiplier.max(
        realNextPrestigeMultiplier
      );
    } else {
      nextPrestigeMultiplier = realNextPrestigeMultiplier;
    }

    if (!this.realNextPrestigeMultiplier.eq(realNextPrestigeMultiplier)) {
      this.realNextPrestigeMultiplier = realNextPrestigeMultiplier;
    }
    if (!this.nextPrestigeMultiplier.eq(nextPrestigeMultiplier)) {
      this.nextPrestigeMultiplier = nextPrestigeMultiplier;
    }

    //  Next multiplier
    if (this.prestigePage) {
      let currentMultiplierNoMulti = this.prestigeMultiplier;
      if (this.challengeMultiplier.active) {
        currentMultiplierNoMulti = currentMultiplierNoMulti.div(
          1 + completedChallenges
        );
      }
      if (this.achievementMultiplierCard.active) {
        currentMultiplierNoMulti = currentMultiplierNoMulti.div(
          1 + Game.getGame().achievementManager.quantity / 100
        );
      }
      currentMultiplierNoMulti = Decimal.max(
        currentMultiplierNoMulti,
        currentMultiplierNoMulti
      );

      this.minLevelToIncrease = Math.ceil(
        Decimal.times(
          10,
          Decimal.minus(currentMultiplierNoMulti, 1).pow(1 / 1.2)
        ).toNumber()
      );

      this.ipotetchicalMultiplier = ONE.plus(
        this.minLevelToIncrease * PRESTIGE_MULTI_PER_LEVEL
      ).pow(PRESTIGE_MULTI_EXP);
      if (this.challengeMultiplier.active) {
        this.ipotetchicalMultiplier = this.ipotetchicalMultiplier.times(
          1 + completedChallenges
        );
      }
      if (this.achievementMultiplierCard.active) {
        this.ipotetchicalMultiplier = this.ipotetchicalMultiplier.times(
          1 + Game.getGame().achievementManager.quantity / 100
        );
      }
    }
  }
  reloadSpentPoints() {
    this.totalSpent = ZERO;
    for (let i = 0, n = this.prestigePoints.length; i < n; i++) {
      this.totalSpent = this.totalSpent.plus(
        this.prestigePoints[i].realQuantity
      );
    }
    this.techPointsUnlocked = this.totalSpent.gte(PRESTIGE_TECH_UNLOCK);
  }

  //#region Save and Load
  getSave() {
    const save: any = {
      e: this.experience,
      m: this.prestigeMultiplier,
      p: this.prestigePoints.map((p) => p.getSave()),
      c: this.cards.filter((c) => c.active).map((c) => c.id),
      a: this.maxCards,
      l: this.lockedCars
    };
    if (this.favouriteModule) save.M = this.favouriteModule.id;
    if (this.favouriteSpell) save.S = this.favouriteSpell.id;
    return save;
  }
  load(data: any) {
    if ("e" in data) this.experience = new Decimal(data.e);
    if ("m" in data) this.prestigeMultiplier = new Decimal(data.m);
    if ("p" in data) {
      for (const pointData of data.p) {
        const point = this.prestigePoints.find((p) => p.id === pointData.i);
        if (point) {
          point.load(pointData);
        }
      }
    }
    if ("c" in data) {
      for (const cardId of data.c) {
        const card = this.cards.find((c) => c.id === cardId);
        if (card) {
          card.active = true;
        }
      }
    }
    if ("a" in data) this.maxCards = data.a;
    if ("l" in data) this.lockedCars = data.l;
    if ("M" in data) {
      this.favouriteModule = Game.getGame().shipyardManager.modules.find(
        (mod) => mod.id === data.M
      );
    }
    if ("S" in data) {
      this.favouriteSpell = Game.getGame().computingManager.spells.find(
        (sp) => sp.id === data.S
      );
    }

    this.reloadSpentPoints();
    this.prestigePoints.forEach((point) => {
      point.checkLock();
    });
  }
  //#endregion
}
