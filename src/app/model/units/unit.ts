import { IUnitData } from "../data/iUnitData";
import { Production } from "./production";
import { IBase } from "../iBase";
import { BonusStack } from "../bonus/bonusStack";
import { MultiPrice } from "../prices/multiPrice";
import { ZERO } from "../CONSTANTS";
import { IUnlockable } from "../iUnlocable";
import { Game } from "../game";

export class Unit implements IBase, IUnlockable {
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
  private _quantityOld = this._quantity;
  public get quantity(): Decimal {
    return this._quantity;
  }
  public set quantity(value: Decimal) {
    this._quantity = value;
  }

  private _perSec = new Decimal();
  private _perSecOld = this._perSec;
  public get perSec() {
    return this._perSec;
  }
  public set perSec(value) {
    this._perSec = value;
  }

  private _perSec2 = new Decimal();
  private _perSec2Old = this._perSec2;
  public get perSec2() {
    return this._perSec2;
  }
  public set perSec2(value) {
    this._perSec2 = value;
  }

  public getId(): string {
    return this.id;
  }

  unlock(): boolean {
    if (this.unlocked) return false;
    this.unlocked = true;
    Game.getGame().resourceManager.reloadLists();
  }

  postUpdate() {
    // this.buyPrice.reload(this.manualBought);

    if (this._quantityOld.eq(this._quantity)) {
      this._quantity = this._quantityOld;
    } else {
      this._quantityOld = this._quantity;
    }
    if (this._perSecOld.eq(this._perSec)) {
      this._perSec = this._perSecOld;
    } else {
      this._perSecOld = this._perSec;
    }
    if (this._perSec2Old.eq(this._perSec2)) {
      this._perSec2 = this._perSec2Old;
    } else {
      this._perSec2Old = this._perSec2;
    }
  }

  buy(qantity: Decimal): boolean {
    if (this.buyPrice.buy(qantity, this.manualBought)) {
      this.manualBought = this.manualBought.plus(qantity);
      this.quantity = this.quantity.plus(qantity);
      this.afterBuy();
      return true;
    }
    return false;
  }
  afterBuy(): boolean {
    const rs = Game.getGame().resourceManager;
    switch (this.id) {
      case "f":
      case "e":
      case "m":
        if (
          rs.farmer.quantity.gte(3) &&
          rs.miner.quantity.gte(3) &&
          rs.technician.quantity.gte(3)
        ) {
          rs.scientist.unlock();
          rs.science.unlock();
          rs.reloadLists();
        }
        break;
    }

    return true;
  }

  getSave(): any {
    const ret: any = {};
    ret.i = this.id;
    if (this.operativity !== 100) ret.o = this.operativity;
    if (!this.quantity.eq(0)) ret.q = this.quantity;
    if (!this.manualBought.eq(0)) ret.m = this.manualBought;
    return ret;
  }
  load(save: any) {
    if (!("i" in save) || save.i !== this.id) return false;
    if ("o" in save) this.operativity = save.o;
    if ("q" in save) this.quantity = new Decimal(save.q);
    if ("m" in save) this.manualBought = new Decimal(save.m);
  }
}
