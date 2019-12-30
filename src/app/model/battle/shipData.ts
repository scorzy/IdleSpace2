import { Ship } from "./ship";

export class WeaponData {
  damage: number;
  armourPercent: number;
  shieldPercent: number;
  initiative: number;
}
export class ShipData {
  designId: number;
  totalArmour: number;
  totalShield: number;
  explosionChance: number;
  threat: number;
  initiative: number;
  weapons: WeaponData[];
  quantity: number;
  ships: Ship[];
  targets: ShipData[];
}
