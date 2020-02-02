import { IUnitData } from "../data/iUnitData";
import { Production } from "./production";
import { IBase } from "../iBase";
import { BonusStack } from "../bonus/bonusStack";
import { MultiPrice } from "../prices/multiPrice";
import { ZERO, ONE } from "../CONSTANTS";
import { IUnlockable } from "../iUnlocable";
import { Game } from "../game";

export class Unit implements IBase, IUnlockable {
  id = "";
  name = "";
  description = "";
  unlocked = false;
  icon = "";
  color = "";
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
  private _oldLimit = Decimal.MAX_VALUE;

  buildingLimit: Unit;
  buildingLimitQuantity: Decimal;

  storedComponents = ZERO;
  needComponents = ZERO;
  components = ONE;
  assemblyPriority = 50;
  assemblyPriorityEnding = 500;

  quantity = new Decimal();
  private _quantityOld = this.quantity;

  perSec = new Decimal();
  private _perSecOld = this.perSec;

  buildPrice = ZERO;
  habSpace = ZERO;

  constructor(public unitData: IUnitData) {
    this.id = unitData.id;
    this.name = unitData.name;
    this.description = unitData.description;
    if ("startQuantity" in unitData) {
      this.unlocked = true;
      this.quantity = new Decimal(unitData.startQuantity);
    }
    if ("icon" in unitData) this.icon = unitData.icon;
    if ("color" in unitData) this.color = unitData.color;
    if ("buildingLimitQuantity" in unitData) {
      this.buildingLimitQuantity = new Decimal(unitData.buildingLimitQuantity);
    }
    if ("showUiLimit" in unitData) {
      this.showUiLimit = unitData.showUiLimit;
    }
  }
  public get uiLimit() {
    return this.limit;
  }
  setRelations() {
    if ("buildingLimit" in this.unitData) {
      this.buildingLimit = Game.getGame().resourceManager.units.find(
        u => u.id === this.unitData.buildingLimit
      );
    }
  }

  public getId(): string {
    return this.id;
  }

  unlock(): boolean {
    if (this.unlocked) return false;
    this.unlocked = true;
    if (this.buildingLimit) {
      this.buildingLimit.unlock();
      this.buildingLimit.quantity = ONE;
    }
    Game.getGame().resourceManager.reloadLists();
  }
  postUpdate() {
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

    this.reloadLimit();
    if (this._oldLimit.eq(this.limit)) {
      this.limit = this._oldLimit;
    } else {
      this._oldLimit = this.limit;
    }
    this.reloadNeedComponent();
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
      case "f":
      case "e":
      case "m":
        if (rs.miner.quantity.gte(3) && rs.technician.quantity.gte(3)) {
          rs.scientist.unlock();
          rs.science.unlock();
          rs.reloadLists();
        }
        break;
    }

    return true;
  }
  reloadLimit() {
    if (!(this.buildingLimit && this.buildingLimitQuantity)) return false;
    this.limit = this.buildingLimit.quantity.times(this.buildingLimitQuantity);
    this.quantity = this.quantity.min(this.limit);
  }
  reloadMaxBuy() {
    this.buyPrice.reload(
      this.manualBought,
      ONE,
      this.limit.minus(this.quantity)
    );
  }
  reloadNeedComponent() {
    this.needComponents = this.limit
      .minus(this.quantity)
      .times(this.components)
      .minus(this.storedComponents)
      .max(0);
  }

  //#region Save and Load
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
  //#endregion
}
