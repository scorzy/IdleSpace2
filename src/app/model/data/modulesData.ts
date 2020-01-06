import { Sizes } from "./sizes";
import { TECHNOLOGIES } from "./technologyData";
import {
  MODULE_ARMOUR,
  MODULE_SHIELD,
  MODULE_DAMAGE,
  DEFAULT_MODULE_PRICE
} from "../CONSTANTS";

export class ModuleData {
  id: string;
  name: string;
  armour?: number;
  shield?: number;
  energy?: number;
  damage?: number;
  armourDamagePercent?: number;
  shieldDamagePercent?: number;
  fire?: number;
  price?: number;
  greaterThan?: string[];
  explosion?: number;
  sizes?: Sizes[];
  shape?: string;
  unlockLevel?: number;
  cargo?: number;
  technologies: { technologyId: string; multi: number }[];
}

export const modules: ModuleData[] = [
  //#region Defences
  {
    id: "A",
    name: "Armour",
    armour: MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:metal-scales"
  },
  {
    id: "s",
    name: "Shield",
    shield: MODULE_SHIELD,
    energy: -1,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:bubble-field"
  },
  //#endregion
  //#region Generators
  {
    id: "S",
    name: "Solar Panel",
    energy: 2,
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 }
    ],
    shape: "my:solar-power"
  },
  {
    id: "R",
    name: "RTG",
    energy: 4,
    price: 20,
    shape: "my:mass-driver",
    technologies: [{ technologyId: "e", multi: 1 }],
    explosion: 15,
    unlockLevel: 20
  },
  {
    id: "F",
    name: "Fusion Reactor",
    energy: 6,
    price: 30,
    shape: "my:reactor",
    technologies: [{ technologyId: "e", multi: 1 }],
    explosion: 25,
    unlockLevel: 50
  },
  //#endregion
  //#region Weapons
  // Anti Armour
  {
    id: "L",
    name: "Laser",
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 75,
    armourDamagePercent: 125,
    energy: -1,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:laser-blast"
  },
  {
    id: "p",
    name: "Plasma",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 1.5,
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 30,
    armourDamagePercent: 170,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    unlockLevel: 20,
    shape: "my:plasma-bolt"
  },
  {
    id: "i",
    name: "Disintegrator",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 3,
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 0,
    armourDamagePercent: 205,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    unlockLevel: 50,
    shape: "my:crumbling-ball"
  },
  //  Anti Shield
  {
    id: "d",
    name: "Mass Driver",
    energy: -1,
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 125,
    armourDamagePercent: 75,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],

    shape: "mass"
  },
  {
    id: "g",
    name: "Gauss rifle",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 1.5,
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 170,
    armourDamagePercent: 30,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],

    shape: "gauss"
  },
  {
    id: "e",
    name: "Emp impulse",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 3,
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 205,
    armourDamagePercent: 0,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],
    shape: "emp"
  },
  //#endregion
  //#region Others
  {
    id: "C",
    name: "Cargo",
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 }
    ],
    cargo: 100,
    shape: "my:cube"
  }
  //#endregion
];
