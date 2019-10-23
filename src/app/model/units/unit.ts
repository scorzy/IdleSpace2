import { IUnitData } from "../data/iUnitData";
import { Production } from "./production";
import { IBase } from "../iBase";
import { BonusStack } from "../bonus/bonusStack";
import { MultiPrice } from "../prices/multiPrice";
import { ZERO } from "../CONSTANTS";

export class Unit implements IBase {
  id = "";
  name = "";
  description = "";
  unlocked = false;
  icon = "";

  operativity = 100;
  production = new Array<Production>();
  makers = new Array<Production>();

  prodAllBonus = new BonusStack();
  prodEfficiety = new BonusStack();
  prodBy = new BonusStack();

  buyPrice = new MultiPrice();
  manualBought = ZERO;

  endIn = Number.POSITIVE_INFINITY;
  isEnding = false;

  constructor(unitData: IUnitData) {
    this.id = unitData.id;
    this.name = unitData.name;
    this.description = unitData.description;
    if ("startQuantity" in unitData) {
      this.unlocked = true;
      this.quantity = new Decimal(unitData.startQuantity);
    }
    if ("icon" in unitData) this.icon = unitData.icon;
  }

  private _quantity = new Decimal();
  private _quantity_old = this._quantity;
  public get quantity(): Decimal {
    return this._quantity;
  }
  public set quantity(value: Decimal) {
    this._quantity = value;
  }

  private _perSec = new Decimal();
  private _perSec_old = this._perSec;
  public get perSec() {
    return this._perSec;
  }
  public set perSec(value) {
    this._perSec = value;
  }

  private _perSec2 = new Decimal();
  private _perSec2_old = this._perSec2;
  public get perSec2() {
    return this._perSec2;
  }
  public set perSec2(value) {
    this._perSec2 = value;
  }

  public getId(): string {
    return this.id;
  }

  postUpdate() {
    // this.buyPrice.reload(this.manualBought);

    if (this._quantity_old.eq(this._quantity)) {
      this._quantity = this._quantity_old;
    } else {
      this._quantity_old = this._quantity;
    }
    if (this._perSec_old.eq(this._perSec)) {
      this._perSec = this._perSec_old;
    } else {
      this._perSec_old = this._perSec;
    }
    if (this._perSec2_old.eq(this._perSec2)) {
      this._perSec2 = this._perSec2_old;
    } else {
      this._perSec2_old = this._perSec2;
    }
  }

  buy(qantity: Decimal): boolean {
    if (this.buyPrice.buy(qantity, this.manualBought)) {
      this.manualBought = this.manualBought.plus(qantity);
      this.quantity = this.quantity.plus(qantity);
      return true;
    }
    return false;
  }
}
