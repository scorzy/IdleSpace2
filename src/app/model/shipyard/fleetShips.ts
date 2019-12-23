export class FleetShips {
  shipsQuantity: number = 0;
  navalCapPercent: number = 50;
  navalCapPercentUi: number = 50;

  getData(): any {
    return {
      s: this.shipsQuantity,
      n: this.navalCapPercent
    };
  }
  load(data: any) {
    if ("s" in data) this.shipsQuantity = data.s;
    if ("n" in data) this.navalCapPercent = data.n;
    this.navalCapPercentUi = this.navalCapPercent;
  }
}
