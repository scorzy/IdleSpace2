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
  COMPONENT_PRESTIGE_MULTI
} from "../CONSTANTS";
import { Game } from "../game";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { MainService } from "src/app/main.service";
import { PrestigePoint } from "./prestigePoint";
import { Bonus } from "../bonus/bonus";

export class PrestigeManager {
  experience = ZERO;
  prestigeMultiplier = ONE;
  nextPrestigeMultiplier = ONE;
  prestigePoints = new Array<PrestigePoint>();
  tabs = new Array<{
    name: string;
    prestige: PrestigePoint[];
  }>();
  constructor() {
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
      p: this.prestigePoints.map((p) => p.getSave())
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
  }
  //#endregion
}
