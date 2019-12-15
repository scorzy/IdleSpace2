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
  unlockLevel?: DecimalSource;
  technologies: { technologyId: string; multi: number }[];
}

export const modules: ModuleData[] = [
  {
    id: "A",
    name: "Armour",
    armour: 100,
    technologies: [{ technologyId: "e", multi: 1 }],
    shape: "my:metal-scales"
  },
  {
    id: "s",
    name: "Shield",
    shield: 100,
    energy: -1,
    technologies: [{ technologyId: "e", multi: 1 }],
    shape: "my:bubble-field"
  },
  {
    id: "L",
    name: "Laser",
    damage: 100,
    shieldDamagePercent: 75,
    armourDamagePercent: 125,
    energy: -1,
    technologies: [{ technologyId: "e", multi: 1 }],
    shape: "my:laser-blast"
  },
  {
    id: "S",
    name: "Solar Panel",
    energy: 2,
    technologies: [{ technologyId: "e", multi: 1 }],
    shape: "my:solar-power"
  },
  {
    id: "R",
    name: "RTG",
    energy: 4,
    price: 20,
    shape: "my:mass-driver",
    technologies: [{ technologyId: "e", multi: 1 }],
    explosion: 15
  },
  {
    id: "F",
    name: "Fusion Reactor",
    energy: 6,
    price: 30,
    shape: "my:reactor",
    technologies: [{ technologyId: "e", multi: 1 }],
    explosion: 25
  }
];
