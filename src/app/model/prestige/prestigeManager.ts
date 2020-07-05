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
  COMPUTING_REGENERATION_CARD
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
  //#region
  constructor() {
    this.generateExperience();
    this.generateCards();
  }
  generateExperience() {
    const rm = Game.getGame().resourceManager;
    const sm = Game.getGame().researchManager;
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
    starterPack.price = new Decimal(PRESTIGE_PRICE);
    starterPack.max = new Decimal(5);
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
        new Bonus(droneMulti, new Decimal(DRONE_PRESTIGE_EFFICIENCY))
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
    Game.getGame().recyclingMulti.bonuses.push(
      new Bonus(recycling, new Decimal(RECYCLING_CARD))
    );

    rm.workers.forEach((w) => {
      w.prodAllBonus.bonuses.push(
        new Bonus(prodCard, new Decimal(PRODUCTION_CARD))
      );
      w.prodAllBonus.bonuses.push(
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
    //#endregion
  }
  addExperience(quantity: Decimal) {
    this.experience = this.experience.plus(quantity);
    Game.getGame().notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.EXPERIENCE,
        MainService.formatPipe.transform(quantity, true)
      )
    );
  }
  loadNextMultiplier() {
    const maxEnemyLevel = Game.getGame().enemyManager.maxLevel;
    this.nextPrestigeMultiplier = ONE.plus(
      maxEnemyLevel * PRESTIGE_MULTI_PER_LEVEL
    ).pow(PRESTIGE_MULTI_EXP);
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
        const card = this.cards.find((card) => card.id === cardId);
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
