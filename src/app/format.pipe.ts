import { Pipe, PipeTransform } from "@angular/core";
import { OptionsService } from "./options.service";

@Pipe({
  name: "format"
})
export class FormatPipe implements PipeTransform {
  // static map: Map<string, string> = new Map<string, string>();
  // static interval: number;

  constructor(public options: OptionsService) {
    // if (FormatPipe.interval < 1) {
    //   FormatPipe.interval = window.setInterval(this.clear.bind(this), 5000);
    // }
  }

  transform(value1: any, integer?: boolean): any {
    if (!(value1 instanceof Decimal)) value1 = new Decimal(value1);
    // console.log(value);

    // let index = "";
    const formatter = this.options.formatter;
    // index =
    //   value1.toString() +
    //   !!integer +
    //   this.options.usaFormat +
    //   formatter.opts.flavor +
    //   formatter.opts.format;
    // console.log(index);
    // const ret1 = FormatPipe.map.get(index);
    // if (ret1 !== undefined) {
    //   return ret1;
    // }

    let str = "";
    if (value1.abs().lt(100000)) {
      let num = value1.abs().toNumber();
      const digits =
        integer || num >= 100
          ? 0
          : num < 10
          ? num < 0.001 && num !== 0
            ? 6
            : 2
          : 1;
      if (num < 100) {
        const pow = Math.pow(10, digits + 1);
        num = Math.floor(num * pow) / pow;
      } else {
        num = Math.floor(num);
      }
      str = num.toLocaleString(OptionsService.usaFormat ? "en-US" : "it-IT", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    } else {
      str = formatter.formatShort(value1.abs());
      if (integer) {
        str = str.replace(/\.0+$/, "");
      }
      if (!OptionsService.usaFormat) {
        str = str.replace(".", ",");
      }
    }

    const ret = (value1.lt(0) ? "-" : "") + str;

    // if (index !== "") {
    //   FormatPipe.map.set(index, ret);
    // }

    return ret;
  }

  // clear() {
  //   if (FormatPipe.map.entries.length > 500) {
  //     FormatPipe.map.clear();
  //   }
  // }
}
