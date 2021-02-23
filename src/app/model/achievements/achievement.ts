import { convertToRoman } from "ant-utils";
import { ACHIEVEMENT_ICON, ZERO } from "../CONSTANTS";
import { IAchievementData } from "../data/achievementData";
import { Game } from "../game";
import { IBase } from "../iBase";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { IGroupParent } from "./iGroupParent";

export abstract class Achievement implements IBase {
  quantity: Decimal = ZERO;
  id: string;
  name: string;
  protected _description: string;
  description: string;
  icon: string;
  colorClass: string;
  groupId: string;
  max = 1;
  progress: Decimal | number = 0;
  total = ZERO;
  parent: IGroupParent;
  levels: number[];
  percent = 100;
  typeIcon = ACHIEVEMENT_ICON;

  constructor(data: IAchievementData) {
    this.id = data.id;
    this.name = data.name;
    this._description = data.description;
    this.description = data.description;
    this.icon = data.icon;
    this.colorClass = data.colorClass;
    this.groupId = data.groupId;
    if (data.max) this.max = data.max;
    if ("levels" in data) {
      this.levels = data.levels;
      this.max = this.levels.length;
    }
  }
  complete(): boolean {
    const newQta = this.checkQuantity();
    if (this.quantity.gte(newQta)) return false;

    this.quantity = new Decimal(newQta);
    this.updateDescription();
    this.parent.reloadNumber();
    this.reloadPercent();

    Game.getGame().notificationManager.addNotification(
      new MyNotification(
        NotificationTypes.ACHIEVEMENT,
        this.name +
          (this.quantity.gt(1) ? " " + convertToRoman(this.quantity) : "")
      )
    );
    return true;
  }
  reloadPercent() {
    this.percent =
      100 - Math.floor(this.quantity.div(this.max).toNumber() * 100);
  }
  abstract checkQuantity(): number | Decimal;
  abstract getCurrentLevel(): number | Decimal;
  updateDescription() {}
  //#region Save and Load
  getSave(): any {
    const ret: any = {
      i: this.id
    };
    if (this.quantity.gt(0)) ret.q = this.quantity;
    return ret;
  }
  load(data: any) {
    if (!("i" in data) || data.i !== this.id) return false;
    if ("q" in data) this.quantity = new Decimal(data.q);
    this.complete();
    this.updateDescription();
    this.reloadPercent();
  }
  //#endregion
}
