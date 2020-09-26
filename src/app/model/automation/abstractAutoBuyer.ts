export abstract class AbstractAutobuyer {
  id: string;
  name: string;
  description = "";
  last = Date.now();
  on = false;
  /**
   * Priority higher execute first
   */
  priority = 100;
  /**
   * Interval in milliseconds
   */
  interval = 1e3;
  execute(dateTime: number): boolean {
    if (!this.on) return false;
    if (this.interval <= 0) return false;
    if (dateTime < this.last + this.interval) return false;

    if (this.automate()) {
      this.last = dateTime;
      return true;
    }
    return false;
  }
  abstract automate(): boolean;
  reload() {}

  //#region Save and Load
  getSave(): any {
    const ret: any = {
      i: this.id,
      l: this.last
    };
    if (this.interval !== 1e3) ret.n = this.interval;
    if (this.priority !== 100) ret.p = this.priority;
    if (this.on) ret.o = this.on;
    return ret;
  }
  load(save: any) {
    // tslint:disable-next-line:triple-equals
    if (!("i" in save || save.i != this.id)) return false;

    if ("l" in save) this.last = save.l;
    if ("p" in save) this.priority = save.p;
    if ("o" in save) this.on = save.o;
    if ("n" in save) this.interval = save.n;
    return true;
  }
  //#endregion
}
