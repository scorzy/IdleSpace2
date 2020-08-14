import { IModData } from "../data/iModData";
import { ZERO, ONE, MAX_MOD_PRESET } from "../CONSTANTS";

export class Mod {
  name: string;
  description = "";
  quantity = ZERO;
  presets = new Array<Decimal>();
  max: Decimal = Decimal.MAX_VALUE;
  min: Decimal = Decimal.MAX_VALUE.times(-1);
  uiQuantityString = "";
  uiPresetString = new Array<string>();
  uiQuantity = ZERO;
  uiPresets = new Array<Decimal>();
  totalBonus = ONE;
  totalBonusTemp = ONE;
  totalBonusAbs = ONE;
  totalBonusTempAbs = ONE;
  bonusValue = 0.1;
  uiOk = true;

  constructor(iModData: IModData) {
    this.name = iModData.name;
    this.description = iModData.description;
    if ("max" in iModData) {
      this.max = new Decimal(iModData.max);
    }
    if ("min" in iModData) {
      this.min = new Decimal(iModData.min);
    }
    for (let i = 0; i < MAX_MOD_PRESET; i++) {
      this.presets.push(ZERO);
      this.uiPresets.push(ZERO);
      this.uiPresetString.push("");
    }
  }
  reloadBonus() {
    this.totalBonus = Decimal.times(this.bonusValue, this.quantity).plus(1);
    this.totalBonusTemp = Decimal.times(this.bonusValue, this.uiQuantity).plus(
      1
    );
    this.totalBonusAbs = Decimal.times(
      this.bonusValue,
      this.quantity.abs()
    ).plus(1);
    this.totalBonusTempAbs = Decimal.times(
      this.bonusValue,
      this.uiQuantity.abs()
    ).plus(1);
  }
  loadPresets(data: any) {
    for (let i = 0; i < MAX_MOD_PRESET && i < data.length; i++) {
      this.presets[i] = new Decimal(data[i]);
      this.uiPresets[i] = this.presets[i];
    }
  }
}
