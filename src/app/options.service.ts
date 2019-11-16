import { Injectable, EventEmitter } from "@angular/core";
declare let numberformat;

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
}
