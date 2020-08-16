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
  MORE_HAB_FROM_STATIONS
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

export class PrestigeManager {
  experience = ZERO;
  prestigeMultiplier = ONE;
  nextPrestigeMultiplier = ONE;
  prestigePoints = new Array<PrestigePoint>();
  tabs = new Array<{
    name: string;
    prestige: PrestigePoint[];
  }>();
  cards = new Array<PrestigeCard>();
  maxCards = 0;
  lockedCars = false;
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
  //#endregion
  constructor() {
    this.generateExperience();
    this.generateCards();
  }
  generateExperience() {
    const rm = Game.getGame().resourceManager;
    const sm = Game.getGame().researchManager;
    const sp = Game.getGame().shipyardManager;
    //#region Drones
    const dronePrestigeList = new Array<PrestigePoint>();
    //  Drones yields and consume more
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

    this.tabs.push({
      name: "Drones",
      prestige: dronePrestigeList
    });
    rm.workers.forEach((w) => {
      w.prodAllBonus.bonuses.push(
        new Bonus(starterPack, new Decimal(DRONE_PRESTIGE_START_OFFER))
      );
      w.prodAllBonus.bonuses.push(
        new Bonus(droneMulti, new Decimal(DRONE_PRESTIGE_PRODUCTION))
      );
      w.prodEfficiency.bonuses.push(
        new Bonus(droneEff, new Decimal(DRONE_PRESTIGE_EFFICIENCY))
      );
    });
    //#endregion
    //#region Science
    const scienceList = new Array<PrestigePoint>();
    this.tabs.push({
      name: "Science",
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
    //#endregion
    //#region War
    const warList = new Array<PrestigePoint>();
    this.tabs.push({
      name: "War",
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
    sp.velocityBonusStack.bonuses.push(
      new Bonus(speedMulti, new Decimal(VELOCITY_PRESTIGE_MULTI))
    );
    //#endregion
    //#region Misc
    const miscList = new Array<PrestigePoint>();
    this.tabs.push({
      name: "Misc",
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

    //#endregion
  }
  generateCards() {
    const rm = Game.getGame().resourceManager;
    const sm = Game.getGame().researchManager;
    const cm = Game.getGame().computingManager;
    //#region Drones
    this.cards = PRESTIGE_CARDS.map((data) => new PrestigeCard(data));
    const prodCard = this.cards.find((card) => card.id === "0");
    const effCard = this.cards.find((card) => card.id === "1");
    const moreDrones = this.cards.find((card) => card.id === "2");
    const recycling = this.cards.find((card) => card.id === "3");
    const peaceCard = this.cards.find((card) => card.id === "4");
    this.doubleModsCard = this.cards.find((card) => card.id === "5");
    Game.getGame().recyclingMulti.bonuses.push(
      new Bonus(recycling, new Decimal(RECYCLING_CARD))
    );

    const isInWar: IBase = {
      id: "inWar",
      name: "In War",
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
    //#endregion
    //#region Science
    const technology = this.cards.find((card) => card.id === "r0");
    this.inspiration = this.cards.find((card) => card.id === "r1");
    this.inspirationTechnology = this.cards.find((card) => card.id === "r2");
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

    rm.districts.forEach((dis) => {
      dis.battleGainMulti.bonuses.push(
        new Bonus(districts, new Decimal(DISTRICTS_CARD))
      );
    });
    rm.materials.forEach((dis) => {
      dis.battleGainMulti.bonuses.push(
        new Bonus(materials, new Decimal(MATERIALS_CARD))
      );
    });
    rm.components.battleGainMulti.bonuses.push(
      new Bonus(components, new Decimal(COMPONENTS_CARD))
    );

    //#endregion
    //#region Warp
    this.moreWarp = this.cards.find((card) => card.id === "p0");
    this.scienceWarp = this.cards.find((card) => card.id === "p1");
    this.updateWarp = this.cards.find((card) => card.id === "p2");
    //#endregion
    //#region Computing
    this.longerSpells = this.cards.find((card) => card.id === "s0");
    const computingRegeneration = this.cards.find((card) => card.id === "s1");
    this.moreComputing = this.cards.find((card) => card.id === "s2");
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
    const moreHabBonus = new Bonus(
      this.moreHabSpaceFromStations,
      new Decimal(MORE_HAB_FROM_STATIONS)
    );
    rm.spaceStations.forEach((spaceStation) => {
      spaceStation.habSpaceStack.bonuses.push(moreHabBonus);
    });
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
    const maxEnemyLevel = Game.getGame().enemyManager.maxLevel;

    const newNextPrestigeMultiplier = ONE.plus(
      maxEnemyLevel * PRESTIGE_MULTI_PER_LEVEL
    ).pow(PRESTIGE_MULTI_EXP);

    if (this.noDecreasePrestige.active) {
      this.nextPrestigeMultiplier = this.prestigeMultiplier.max(
        newNextPrestigeMultiplier
      );
    } else {
      this.nextPrestigeMultiplier = newNextPrestigeMultiplier;
    }
  }

  //#region Save and Load
  getSave() {
    return {
      e: this.experience,
      m: this.prestigeMultiplier,
      p: this.prestigePoints.map((p) => p.getSave()),
      c: this.cards.filter((c) => c.active).map((c) => c.id),
      a: this.maxCards,
      l: this.lockedCars
    };
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
    // this.experience = new Decimal(200);
  }
  //#endregion
}
