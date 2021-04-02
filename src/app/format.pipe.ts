import { Pipe, PipeTransform } from "@angular/core";
import { OptionsService } from "./options.service";

@Pipe({
  name: "format"
})
export class FormatPipe implements PipeTransform {
  constructor(public options: OptionsService) {}

  transform(value1: any, integer?: boolean, sigfigs: number = 3): string {
    if (!(value1 instanceof Decimal)) value1 = new Decimal(value1);

    const formatter = this.options.formatter;
    if (this.options.numFormat !== "scientific" || integer) {
      sigfigs = 3;
    }

    let str = "";
    if (value1.abs().lt(1e4)) {
      let num = value1.abs().toNumber();
      const digits =
        integer || num >= 100
          ? Math.max(0, sigfigs - 3)
          : num < 10
          ? Math.max(0, sigfigs - 1)
          : Math.max(0, sigfigs - 2);

      if (num < 1000) {
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
      str = formatter.formatShort(value1.abs(), {
        minSuffix: 10,
        sigfigs
      });
      if (integer) {
        str = str.replace(/\.0+$/, "");
      }
      if (!OptionsService.usaFormat) {
        str = str.replace(".", ",");
      }
    }
    //console.log(str);
    return (value1.lt(0) ? "-" : "") + str;
  }
}
