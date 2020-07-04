import { IBase, ISimpleBase } from "../iBase";
import { ONE, ZERO } from "../CONSTANTS";
import { forOwn } from "lodash-es";

export class PrestigeCard implements IBase {
  id: string;
  name: string;
  description: string;
  icon?: string;
  colorClass?: string;
  active = false;
  constructor(data: ISimpleBase) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon = data?.icon;
  }
  get quantity(): Decimal {
    if (this.active) return ONE;
    else return ZERO;
  }
}
