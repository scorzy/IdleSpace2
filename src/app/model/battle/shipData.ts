import { Ship } from "./ship";
import { Stats } from "./battleResult";

export class WeaponData {
  damage: number;
  armourPercent: number;
  shieldPercent: number;
  aliveThreatGain: number;
  armourThreatGain: number;
  shieldThreatGain: number;
}
export class ShipData {
  designId: number;
  name = "";
  totalArmour: number;
  totalShield: number;
  explosionThreshold: number;
  threat: number;
  weapons: WeaponData[];
  quantity: number;
  ships: Ship[];
  alive: Ship[];
  withArmour: Ship[];
  withShield: Ship[];
  targets: ShipData[];
  stats: Stats;
}
