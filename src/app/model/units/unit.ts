import { IUnitData } from "../data/iUnitData";
import { Production } from "./production";
import { IBase } from "../iBase";
import { MultiPrice } from "../prices/multiPrice";
import {
  ZERO,
  ONE,
  COMPONENT_PRICE

} from "../CONSTANTS";
import { IUnlockable } from "../iUnlocable";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import { BonusStack } from '../bonus/bonusStack';

export class Unit implements IBase, IUnlockable {
  id = "";
  name = "";
  description = "";
  unlocked = false;
  icon = "";
  colorClass = "";
  showUiLimit = false;
  operativity = 100;
  production = new Array<Production>();
  makers = new Array<Production>();
  prodAllBonus = new BonusStack();
  prodEfficiency = new BonusStack();
  prodBy = new BonusStack();
  buyPrice = new MultiPrice();
  manualBought = ZERO;
  endIn = Number.POSITIVE_INFINITY;
  fullIn = Number.POSITIVE_INFINITY;
  isEnding = false;
  limit = Decimal.MAX_VALUE;
  limitTemp = Decimal.MAX_VALUE;
  private _oldLimit = Decimal.MAX_VALUE;
  limitStack: BonusStack;
  limitStackMulti: BonusStack;
  storedComponents = ZERO;
  needComponents = ZERO;
  components = COMPONENT_PRICE;
  componentsTemp = COMPONENT_PRICE;

  quantity = new Decimal();
  private _quantityOld = this.quantity;
  perSec = new Decimal();
  private _perSecOld = this.perSec;

  battleGainMulti: BonusStack;
  workers = new Array<Unit>();
  constructor(public unitData: IUnitData) {
    this.id = unitData.id;
    this.name = unitData.name;
    this.description = unitData.description;
    if ("startQuantity" in unitData) {
      this.unlocked = true;
      this.quantity = new Decimal(unitData.startQuantity);
    }
    if ("icon" in unitData) {
      this.icon = unitData.icon;
    }
    if ("colorClass" in unitData) {
      this.colorClass = unitData.colorClass;
    }
    if ("showUiLimit" in unitData) {
      this.showUiLimit = unitData.showUiLimit;
    }
  }
  public get uiLimit() {
    return this.limit;
  }
  setRelations() {
    const rm = Game.getGame().resourceManager;
    if ("limits" in this.unitData) {
      this.limitStack = new BonusStack();
      this.unitData.limits.forEach((limit) => {
        const other = rm.units.find((u) => u.id === limit.buildingLimit);
        this.limitStack.bonuses.push(
          new Bonus(other, new Decimal(limit.buildingLimitQuantity))
        );
        other.workers.push(this);
      });
    }
  }
  public getId(): string {
    return this.id;
  }
  unlock(): boolean {
    if (this.unlocked) {
      return false;
    }
    this.unlocked = true;
    if (this.unitData.unlockQuantity) {
      this.quantity = new Decimal(this.unitData.unlockQuantity);
    }
    Game.getGame().resourceManager.reloadLists();
  }
  postUpdate() {
    this.reloadLimit();

    if (this._quantityOld.eq(this.quantity)) {
      this.quantity = this._quantityOld;
    } else {
      this._quantityOld = this.quantity;
    }
    if (this._perSecOld.eq(this.perSec)) {
      this.perSec = this._perSecOld;
    } else {
      this._perSecOld = this.perSec;
    }    
    if (this._oldLimit.eq(this.limit)) {
      this.limit = this._oldLimit;
    } else {
      this._oldLimit = this.limit;
    }
    
  }
  buy(quantity: Decimal): boolean {
    if (
      this.buyPrice.buy(
        quantity,
        this.manualBought,
        this.limit.minus(this.quantity)
      )
    ) {
      this.manualBought = this.manualBought.plus(quantity);
      this.quantity = this.quantity.plus(quantity);
      this.afterBuy();
      return true;
    }
    return false;
  }
  afterBuy(): boolean {
    const rs = Game.getGame().resourceManager;
    switch (this.id) {
      // case "f":
      case "e":
      case "m":
        if (rs.miner.quantity.gte(10) && rs.technician.quantity.gte(10)) {
          rs.laboratory.unlock();
          rs.scientist.unlock();
          rs.science.unlock();
          rs.reloadLists();
        }
        break;
    }

    return true;
  }
  reloadLimit():boolean {
    if (!this.limitStack) {
      return false;
    }
    this.limitStack.reloadAdditiveBonus();
    this.limit = this.limitStack.totalAdditiveBonus;
    this.limitTemp = this.limit;
    if (this.limitStackMulti) {
      this.limitStackMulti.reloadBonus();
      this.limit = this.limit.times(this.limitStackMulti.totalBonus);
    }
    return true;
  }
  reloadMaxBuy() {
    this.buyPrice.reload(
      this.manualBought,
      ONE,
      this.limit.minus(this.quantity)
    );
  }

  reloadAll() {
    this.reloadLimit();
  }
 
  //#region Save and Load
  getSave(): any {
    const ret: any = {};
    ret.i = this.id;
    if (this.operativity !== 100) {
      ret.o = this.operativity;
    }
    if (!this.quantity.eq(0)) {
      ret.q = this.quantity;
    }
    if (!this.manualBought.eq(0)) {
      ret.m = this.manualBought;
    }
    return ret;
  }
  load(save: any) {
    if (!("i" in save) || save.i !== this.id) {
      return false;
    }
    if ("o" in save) {
      this.operativity = save.o;
    }
    if ("q" in save) {
      this.quantity = new Decimal(save.q);
    }
    if ("m" in save) {
      this.manualBought = new Decimal(save.m);
    }
    return true;
  }
  //#endregion
}
