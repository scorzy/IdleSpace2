import { Pipe, PipeTransform } from "@angular/core";
import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";
import { isValid, formatDistance, formatDistanceStrict } from "date-fns";

const SECONDS_IN_YEAR = 3.154e7;

@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {
  pipeFormat: FormatPipe;
  constructor(public options: OptionsService) {
    this.pipeFormat = new FormatPipe(options);
  }

  transform(value: number, format?: number): any {
    if (!isNaN(value) && value > 0 && value < Number.POSITIVE_INFINITY) {
      const dateEnd = new Date(Date.now() + value);
      if (isValid(dateEnd)) {
        return format === 1
          ? formatDistanceStrict(value * 1e3, 0)
          : this.options.timeFormatDetail
          ? formatDistanceStrict(value * 1e3, 0)
          : formatDistance(value * 1e3, 0);
      } else {
        return (
          "in " + this.pipeFormat.transform(value / SECONDS_IN_YEAR) + " years"
        );
      }
    } else {
      return "∞";
    }
  }
}
