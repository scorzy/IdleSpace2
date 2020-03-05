import { Sizes } from "./sizes";
import { TECHNOLOGIES } from "./technologyData";
import {
  MODULE_ARMOUR,
  MODULE_SHIELD,
  MODULE_DAMAGE,
  DEFAULT_MODULE_PRICE,
  BASE_VELOCITY,
  BASE_ACCELERATION,
  BASE_THREAT
} from "../CONSTANTS";

export class ModuleData {
  id: string;
  name: string;
  armour?: number;
  shield?: number;
  armourPercent?: number;
  shieldPercent?: number;
  energy?: number;
  armourDamageReduction?: number;
  shieldDamageReduction?: number;
  damage?: number;
  armourDamagePercent?: number;
  shieldDamagePercent?: number;
  fire?: number;
  price?: number;
  greaterThan?: string[];
  explosion?: number;
  explosionDamage?: number;
  sizes?: Sizes[];
  shape?: string;
  unlockLevel?: number;
  cargo?: number;
  technologies: { technologyId: string; multi: number }[];
  shieldRecharge?: number;
  velocity?: number;
  acceleration?: number;
  threat?: number;
  precision?: number;
  adaptivePrecision?: number;
  threatGainMulti?: number;
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
    id: "B",
    name: "Ablative Armour",
    armour: 0.7 * MODULE_ARMOUR,
    armourDamageReduction: 0.25 * MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:metal-scales"
  },
  {
    id: "V",
    name: "Reactive Armour",
    energy: -1,
    explosion: -0.1 * MODULE_ARMOUR,
    armour: 1.5 * MODULE_ARMOUR,
    armourPercent: 5,
    armourDamageReduction: 0.2 * MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:armor-upgrade"
  },
  {
    id: "D",
    name: "Deflector",
    energy: -1,
    armour: MODULE_ARMOUR / 5,
    armourDamageReduction: 0.4 * MODULE_ARMOUR,
    armourPercent: 8,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:shield-reflect"
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
  {
    id: "j",
    name: "Jammer",
    energy: -2,
    shield: MODULE_SHIELD / 5,
    shieldPercent: 8,
    shieldDamageReduction: 0.4 * MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:shield-reflect"
  },
  //#endregion
  //#region Generators
  {
    id: "S",
    name: "Solar Panel",
    energy: 2,
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    shape: "my:solar-power"
  },
  {
    id: "R",
    name: "RTG",
    energy: 3,
    price: 20,
    shape: "my:mass-driver",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 0.35 * MODULE_ARMOUR,
    unlockLevel: 2
  },
  {
    id: "I",
    name: "Fission Reactor",
    energy: 5,
    price: 30,
    shape: "my:reactor",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 1 * MODULE_ARMOUR,
    explosionDamage: MODULE_DAMAGE,
    unlockLevel: 2
  },
  {
    id: "F",
    name: "Fusion Reactor",
    energy: 6,
    price: 30,
    shape: "my:atom",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 0.5 * MODULE_ARMOUR,
    explosionDamage: 0.2 * MODULE_DAMAGE,
    unlockLevel: 2
  },
  {
    id: "J",
    name: "Antimatter Reactor",
    energy: 7,
    price: 40,
    shape: "my:materials-science",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 2 * MODULE_ARMOUR,
    explosionDamage: 2 * MODULE_DAMAGE,
    unlockLevel: 2
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
    threatGainMulti: 1.5,
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
    threatGainMulti: 1.5,
    shape: "my:unstable-orb"
  },
  //#endregion
  //#region Propulsion
  {
    id: "d",
    name: "Mass Driver",
    energy: -1,
    damage: MODULE_DAMAGE,
    price: DEFAULT_MODULE_PRICE,
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
    damage: MODULE_DAMAGE,
    price: DEFAULT_MODULE_PRICE * 1.5,
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
    damage: MODULE_DAMAGE,
    price: DEFAULT_MODULE_PRICE * 3,
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
    threatGainMulti: 0.7,
    shape: "my:mining"
  },
  {
    id: "T",
    name: "Tesla Cannon",
    damage: MODULE_DAMAGE - 5,
    shieldDamagePercent: 140,
    armourDamagePercent: 60,
    energy: -1,
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    threatGainMulti: 0.7,
    shape: "my:focused-lightning"
  },
  //#endregion
  //#endregion
  //#region Others
  {
    id: "C",
    name: "Cargo",
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    cargo: 100,
    explosion: MODULE_ARMOUR * -1,
    shape: "my:cube"
  },
  {
    id: "X",
    name: "Shield Charger",
    energy: -2,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shieldRecharge: MODULE_SHIELD / 8,
    shape: "my:armor-upgrade"
  },
  {
    id: "t",
    name: "Tracking System",
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Computing.id, multi: 1 }
    ],
    energy: -1,
    precision: 500,
    adaptivePrecision: 500,
    armourDamagePercent: 5,
    shieldDamagePercent: 5,
    shape: "my:targeting"
  },
  //#endregion
  //#region Thrusters
  {
    id: "r",
    name: "Rocket",
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],
    velocity: BASE_VELOCITY,
    shape: "my:rocket-thruster"
  },
  {
    id: "o",
    name: "Ion Drive",
    energy: -1,
    price: 20,
    technologies: [
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],
    acceleration: BASE_ACCELERATION,
    shape: "my:rocket-thruster"
  },
  {
    id: "a",
    name: "Antimatter Rocket",
    price: 40,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],
    velocity: BASE_VELOCITY * 10,
    explosion: 2 * MODULE_ARMOUR,
    explosionDamage: 1 * MODULE_DAMAGE,
    shape: "my:rocket-thruster"
  },
  {
    id: "w",
    name: "Warp Drive",
    price: 40,
    energy: -2,
    technologies: [
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],
    acceleration: BASE_ACCELERATION * 5,
    shape: "my:rocket-thruster"
  },
  {
    id: "l",
    name: "Solar Sail",
    technologies: [
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],
    acceleration: BASE_ACCELERATION * 0.1,
    threat: BASE_THREAT,
    shape: "my:rocket-thruster"
  }
  //#endregion
];
