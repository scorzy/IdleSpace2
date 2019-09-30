import { IUnitData } from "../data/iUnitData";

export class Unit {
  id = "";
  name = "";
  description = "";

  constructor(unitData: IUnitData) {
    this.id = unitData.id;
    this.name = unitData.name;
    this.description = unitData.description;
  }

  private _quantity = new Decimal();
  public get quantity(): Decimal {
    return this._quantity;
  }
  public set quantity(value: Decimal) {
    this._quantity = value;
  }

  private _perSec = new Decimal();
  public get perSec() {
    return this._perSec;
  }
  public set perSec(value) {
    this._perSec = value;
  }

  private _perSec2 = new Decimal();
  public get perSec2() {
    return this._perSec2;
  }
  public set perSec2(value) {
    this._perSec2 = value;
  }
}
