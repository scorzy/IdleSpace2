import { IUnitData } from "../data/iUnitData";
import { Production } from "./production";
import { IBase } from "../iBase";
import { BonusStack } from "../bonus/bonusStack";

export class Unit implements IBase {
  id = "";
  name = "";
  description = "";

  operativity = 100;
  production = new Array<Production>();
  makers = new Array<Production>();

  prodAllBonus = new BonusStack();
  prodEfficiety = new BonusStack();
  prodBy = new BonusStack();

  endIn = Number.POSITIVE_INFINITY;
  isEnding = false;

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

  public getId(): string {
    return this.id;
  }
}
