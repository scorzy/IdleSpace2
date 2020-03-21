import { Injectable, EventEmitter } from "@angular/core";
declare let numberformat;

export const THEMES = ["dark-green", "dark-blue", "light-green", "light-blue"];

@Injectable({
  providedIn: "root"
})
export class OptionsService {
  formatter: any;
  formatEmitter: EventEmitter<number> = new EventEmitter<number>();

  usaFormat = true;
  numFormat = "scientific";
  formatId = 0;
  timeFormatDetail = true;
  themeId = 0;
  darkSide = true;
  darkHeader = true;
  static isDark = true;

  constructor() {
    try {
      const n = 1.1;
      const separator = n.toLocaleString().substring(1, 2);
      if (separator === ",") {
        this.usaFormat = false;
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
    this.darkHeader = this.themeId > 1 && this.darkSide;
    OptionsService.isDark = this.themeId < 2;
  }

  getSave(): any {
    return {
      u: this.usaFormat,
      t: this.themeId,
      d: this.darkSide
    };
  }
  load(data: any) {
    if ("u" in data) this.usaFormat = data.u;
    if ("t" in data) this.themeId = data.t;
    if ("d" in data) this.darkSide = data.d;
  }
}
