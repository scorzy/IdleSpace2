import { Pipe, PipeTransform } from "@angular/core";
import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";
import isValid from "date-fns/isValid";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatDistance from "date-fns/formatDistance";

const SECONDS_IN_YEAR = 3.154e7;
const ONE_HUNDRED_YEARS = SECONDS_IN_YEAR * 100;

@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {
  pipeFormat: FormatPipe;
  constructor(public options: OptionsService) {
    this.pipeFormat = new FormatPipe(options);
  }

  transform(value: number | Decimal, format?: number): any {
    if (value instanceof Decimal && value.gt(ONE_HUNDRED_YEARS)) {
      return this.pipeFormat.transform(value.div(SECONDS_IN_YEAR)) + " years";
    }
    if (value instanceof Decimal) {
      value = value.toNumber();
    }

    if (!isNaN(value) && value >= 0 && value < Number.POSITIVE_INFINITY) {
      const dateEnd = new Date(Date.now() + value);
      if (isValid(dateEnd)) {
        if (format === 1 || this.options.timeFormatDetail) {
          if (value < 60) {
            return Math.floor(value) + " seconds";
          } else {
            return formatDistanceStrict(value * 1e3, 0);
          }
        } else {
          return formatDistance(value * 1e3, 0);
        }
      } else {
        return this.pipeFormat.transform(value / SECONDS_IN_YEAR) + " years";
      }
    } else {
      return "∞";
    }
  }
}
