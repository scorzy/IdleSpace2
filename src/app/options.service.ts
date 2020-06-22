import { Injectable, EventEmitter } from "@angular/core";
declare let numberformat;

export const THEMES = ["dark-green", "dark-blue", "light-green", "light-blue"];

@Injectable({
  providedIn: "root"
})
export class OptionsService {
  static isDark = true;
  static usaFormat = true;
  formatter: any;
  formatEmitter: EventEmitter<number> = new EventEmitter<number>();
  numFormat = "scientific";
  formatId = 0;
  timeFormatDetail = true;
  themeId = "dark-blue";
  darkSide = true;
  darkHeader = true;
  compactCardHeader = false;
  constructor() {
    try {
      const n = 1.1;
      const separator = n.toLocaleString().substring(1, 2);
      if (separator === ",") {
        OptionsService.usaFormat = false;
      }
    } catch (ex) {}

    this.generateFormatter();
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
      c: this.compactCardHeader
    };
  }
  load(data: any) {
    if ("u" in data) OptionsService.usaFormat = data.u;
    if ("t" in data) this.themeId = data.t;
    if ("d" in data) this.darkSide = data.d;
    if ("c" in data) this.compactCardHeader = data.c;
  }
}
