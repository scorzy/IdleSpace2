import { OptionsService } from "src/app/options.service";
import { ZERO } from "../CONSTANTS";

declare let numberformat;
export function parseDecimal(str: string): Decimal {
  if (str.trim() === "") return ZERO;
  try {
    if (!OptionsService.usaFormat) {
      str = str.replace(",", "###");
      str = str.replace(".", "@@@");
      str = str.replace("###", ".");
      str = str.replace("@@@", ",");
    }
    return numberformat.parse(str, {
      backend: "decimal.js",
      Decimal
    });
  } catch (ex) {
    return ZERO;
  }
}
