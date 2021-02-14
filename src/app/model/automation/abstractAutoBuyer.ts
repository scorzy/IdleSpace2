export abstract class AbstractAutobuyer {
  id: string;
  name: string;
  description = "";
  last = Date.now();
  private _on = false;
  public get on() {
    return this._on;
  }
  public set on(value) {
    this._on = value;
  }
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
    // eslint-disable-next-line eqeqeq
    if (!("i" in save || save.i != this.id)) return false;

    if ("l" in save && typeof save.l === "number") this.last = save.l;
    if ("p" in save && typeof save.p === "number") this.priority = save.p;
    if ("o" in save && typeof save.o === "boolean") this.on = save.o;
    if ("n" in save && typeof save.n === "number") this.interval = save.n;

    const now = Date.now();
    if (this.last > now) this.last = now;
    return true;
  }
  //#endregion
}
