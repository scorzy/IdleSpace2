import { ZERO } from "../CONSTANTS";
import { IAchievementData } from "../data/achievementData";
import { IBase } from "../iBase";

export class Achievement implements IBase {
  quantity: Decimal = ZERO;
  id: string;
  name: string;
  protected _description: string;
  description: string;
  icon: string;
  colorClass: string;
  groupId: string;
  max = 1;
  progress = ZERO;
  total = ZERO;

  constructor(data: IAchievementData) {
    this.id = data.id;
    this.name = data.name;
    this._description = data.description;
    this.description = data.description;
    this.icon = data.icon;
    this.colorClass = data.colorClass;
    this.groupId = data.groupId;
    if (data.max) this.max = data.max;
  }
  complete(): boolean {
    const newQta = this.checkQuantity();
    if (this.quantity.gte(newQta)) return false;

    this.quantity = new Decimal(newQta);
    this.updateDescription();
    return true;
  }
  checkQuantity(): number | Decimal {
    return 0;
  }
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
    this.updateDescription();
  }
  //#endregion
}
