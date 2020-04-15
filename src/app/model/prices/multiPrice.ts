import { Price } from "./price";
import { ZERO } from "../CONSTANTS";

export class MultiPrice {
  canBuy = false;
  maxBuy = ZERO;
  private _oldMaxBuy = ZERO;
  halfBuy = ZERO;

  canBuyWanted = false;
  availableIn = Number.POSITIVE_INFINITY;

  constructor(public prices: Price[] = []) {}

  reload(
    bought: Decimal,
    numWanted = new Decimal(1),
    limit: Decimal = Decimal.MAX_VALUE
  ) {
    this.canBuy = true;
    this.canBuyWanted = true;
    for (let i = 0, n = this.prices.length; i < n; i++) {
      this.prices[i].reload(bought, numWanted);
      if (!this.prices[i].canBuy) {
        this.canBuy = false;
      }
      // if (!this.prices[i].canBuyMulti) { this.canBuyWanted = false; }
    }

    if (limit.gte(1)) {
      numWanted = new Decimal(numWanted).max(1);

      // this.maxBuy = this.canBuy
      //   ? this.prices
      //       .map(p => p.maxBuy)
      //       .reduce((p, c) => p.min(c), new Decimal(Number.POSITIVE_INFINITY))
      //   : ZERO;

      if (this.canBuy) {
        this.maxBuy = this.prices[0].maxBuy.min(limit);
        for (let i = 1, n = this.prices.length; i < n; i++) {
          this.maxBuy = this.maxBuy.min(this.prices[i].maxBuy);
        }
      } else {
        this.maxBuy = ZERO;
      }

      if (this._oldMaxBuy.eq(this.maxBuy)) {
        this.maxBuy = this._oldMaxBuy;
      } else {
        this._oldMaxBuy = this.maxBuy;
        this.halfBuy = this.maxBuy.div(2).floor();
      }
    } else {
      this.maxBuy = ZERO;
      this.halfBuy = ZERO;
      this.canBuy = false;
      this.canBuyWanted = false;
    }

    // this.reloadAvailableTime();
  }
  buy(quantity: Decimal, bought: Decimal, limit: Decimal): boolean {
    this.reload(bought, quantity, limit);
    if (!this.canBuy) {
      return false;
    }
    this.prices.forEach((pr) => pr.buy(quantity, bought));
    this.reload(bought.plus(quantity), quantity, limit);
    return true;
  }
  // reloadAvailableTime() {
  //   this.availableIn =
  //     this.prices
  //       .map(p => p.getTime())
  //       .reduce((p, c) => p.max(c), ZERO)
  //       .toNumber() * 1000;
  // }
  getMaxBuy(bought: Decimal, percentToUse: number): Decimal {
    return this.prices
      .map((pr) => pr.getMaxBuy(bought, percentToUse))
      .reduce((p, c) => p.min(c), new Decimal(Number.POSITIVE_INFINITY));
  }
}
