import { Injectable, EventEmitter } from "@angular/core";
declare let numberformat;

export const THEMES = ["dark-green", "dark-blue", "light-green", "light-blue"];

@Injectable({
  providedIn: "root"
})
export class OptionsService {
  static isDark = true;
  static usaFormat = true;
  static instance: OptionsService;
  formatter: any;
  formatEmitter: EventEmitter<number> = new EventEmitter<number>();
  numFormat = "scientific";
  formatId = 0;
  timeFormatDetail = true;
  themeId = "dark-blue";
  darkSide = true;
  darkHeader = true;
  compactCardHeader = false;
  battleWinNotification = true;
  battleLostNotification = true;
  constructor() {
    try {
      const n = 1.1;
      const separator = n.toLocaleString().substring(1, 2);
      if (separator === ",") {
        OptionsService.usaFormat = false;
      }
    } catch (ex) {}

    this.generateFormatter();
    OptionsService.instance = this;
  }
  generateFormatter() {
    this.formatId++;
    try {
      this.formatter = new numberformat.Formatter({
        format: this.numFormat,
        flavor: "short"
      });
    } catch (ex) {
      console.log("Error generate Formatter:" + ex);
    }
    this.formatEmitter.emit(1);
  }
  setHeaderTheme() {
    OptionsService.isDark = !(
      typeof this.themeId === "string" && this.themeId.includes("light")
    );
    this.darkHeader = !OptionsService.isDark && this.darkSide;
  }

  getSave(): any {
    return {
      u: OptionsService.usaFormat,
      t: this.themeId,
      d: this.darkSide,
      c: this.compactCardHeader,
      bw: this.battleWinNotification,
      bl: this.battleLostNotification,
      n: this.numFormat
    };
  }
  load(data: any) {
    if ("u" in data) OptionsService.usaFormat = data.u;
    if ("t" in data) this.themeId = data.t;
    if ("d" in data) this.darkSide = data.d;
    if ("c" in data) this.compactCardHeader = data.c;
    if ("bw" in data) this.battleWinNotification = data.bw;
    if ("bl" in data) this.battleLostNotification = data.bl;
    if ("n" in data) this.numFormat = data.n;
    this.generateFormatter();
  }
}
