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
    explosion: 0.15 * MODULE_ARMOUR,
    unlockLevel: 20
  },
  {
    id: "F",
    name: "Fusion Reactor",
    energy: 6,
    price: 30,
    shape: "my:reactor",
    technologies: [{ technologyId: "e", multi: 1 }],
    explosion: 0.25 * MODULE_ARMOUR,
    unlockLevel: 50
  },
  //#endregion
  //#region Weapons
  //#region Physics
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
  {
    id: "g",
    name: "Ion Cannon",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 1.5,
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 175,
    armourDamagePercent: 25,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],

    shape: "my:ion-cannon-blast"
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
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:unstable-orb"
  },
  //#endregion
  //#region Propulsion
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

    shape: "my:clout"
  },
  {
    id: "n",
    name: "Railgun",
    energy: -1,
    damage: MODULE_DAMAGE * 1.5,
    shieldDamagePercent: 140,
    armourDamagePercent: 60,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],

    shape: "my:silver-bullet"
  },
  {
    id: "c",
    name: "Coilgun",
    energy: -1,
    damage: MODULE_DAMAGE * 3,
    shieldDamagePercent: 155,
    armourDamagePercent: 45,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],

    shape: "my:supersonic-bullet"
  },
  //#endregion
  //#region Civil
  {
    id: "m",
    name: "Mining Laser",
    damage: MODULE_DAMAGE - 5,
    shieldDamagePercent: 60,
    armourDamagePercent: 140,
    energy: -1,
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:mining"
  },
  //#endregion
  ////#endregion
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
