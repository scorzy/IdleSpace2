import { Ship } from "./ship";
import { Stats } from "./battleResult";

export class WeaponData {
  damage: number;
  armourPercent: number;
  shieldPercent: number;
  initiative: number;
}
export class ShipData {
  designId: number;
  name = "";
  totalArmour: number;
  totalShield: number;
  explosionChance: number;
  threat: number;
  initiative: number;
  weapons: WeaponData[];
  quantity: number;
  ships: Ship[];
  targets: ShipData[];
  stats: Stats;
}
