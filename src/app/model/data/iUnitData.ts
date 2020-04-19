import { UNIT_TYPES } from "./units";
import { Technology } from "../researches/technology";

export interface IUnitData {
  id: string;
  name: string;
  description: string;
  startQuantity?: DecimalSource;
  unlockQuantity?: DecimalSource;
  icon?: string;
  colorClass?: string;
  limits?: { buildingLimit: string; buildingLimitQuantity: DecimalSource }[];
  showUiLimit?: boolean;
  unitType: UNIT_TYPES;

  /**
   * Production [Unit id, quantity /s]
   */
  production?: [string, DecimalSource][];

  /**
   * Price [Unit id, quantity]
   */
  prices?: [string, DecimalSource][];
  mods?: { technologyId: string; multi: number }[];
}
