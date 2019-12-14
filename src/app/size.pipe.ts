import { Pipe, PipeTransform } from "@angular/core";
import { getSizeName } from "./model/data/sizes";

@Pipe({
  name: "sizePipe"
})
export class SizePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return getSizeName(value);
  }
}
