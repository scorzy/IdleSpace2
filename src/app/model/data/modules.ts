import { Sizes } from "./sizes";

export class ModuleData {
  id: string;
  name: string;
  armour?: DecimalSource;
  shield?: DecimalSource;
  energy?: DecimalSource;
  damage?: DecimalSource;
  armourDamagePercent?: number;
  shieldDamagePercent?: number;
  fire?: number;
  price?: DecimalSource;
  greaterThan?: string[];
  explosion?: number;
  sizes?: Sizes[];
  shape?: string;
}

export const modules: ModuleData[] = [
  { id: "A", name: "Armour", armour: 10 },
  { id: "S", name: "Shield", shield: 10, energy: -1 },
  {
    id: "L",
    name: "Laser",
    damage: 10,
    shieldDamagePercent: 75,
    armourDamagePercent: 125,
    energy: -1
  }
];
