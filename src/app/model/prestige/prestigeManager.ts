import {
  ZERO,
  ONE,
  DRONE_PRESTIGE_PRODUCTION,
  PRESTIGE_PRICE,
  DRONE_PRESTIGE_EFFICIENCY
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
  prestigePoints = new Array<PrestigePoint>();
  tabs = new Array<{
    name: string;
    prestige: PrestigePoint[];
  }>();
  constructor() {
    const rm = Game.getGame().resourceManager;
    //#region Drones
    const dronePrestigeList = new Array<PrestigePoint>();
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

    this.tabs.push({
      name: "Drones",
      prestige: dronePrestigeList
    });
    rm.workers.forEach((w) => {
      w.prodAllBonus.bonuses.push(
        new Bonus(droneMulti, new Decimal(DRONE_PRESTIGE_EFFICIENCY))
      );
      w.prodEfficiency.bonuses.push(
        new Bonus(droneMulti, new Decimal(DRONE_PRESTIGE_EFFICIENCY))
      );
    });
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
