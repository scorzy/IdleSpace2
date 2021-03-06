import { Sizes } from "./sizes";
import { TECHNOLOGIES } from "./technologyData";
import {
  MODULE_ARMOUR,
  MODULE_SHIELD,
  MODULE_DAMAGE,
  DEFAULT_MODULE_PRICE,
  BASE_VELOCITY,
  BASE_ACCELERATION,
  BASE_THREAT,
  BASE_CARGO,
  BASE_ADAPTIVE_PRECISION,
  BASE_PRECISION,
  DOUBLE_ENERGY_WEAPON_MULTI,
  BASE_TERRAFORMER,
  WEAPON_PEN_1_MINUS,
  WEAPON_PEN_1,
  WEAPON_PEN_2_MINUS,
  WEAPON_PEN_2
} from "../CONSTANTS";
export class ModuleData {
  id: string;
  name: string;
  description?: string;
  armour?: number;
  shield?: number;
  armourPen?: number;
  shieldPen?: number;
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
  cargo?: number;
  scienceLab?: number;
  components?: number;
  terraformer?: number;
  technologies: { technologyId: string; multi: number }[];
  shieldRecharge?: number;
  velocity?: number;
  acceleration?: number;
  threat?: number;
  precision?: number;
  adaptivePrecision?: number;
  threatGainMulti?: number;
  defenceDamagePercent?: number;
  affectedWeaponsTechnologies?: string[];
}

export const modules: ModuleData[] = [
  //#region Defences
  {
    id: "A",
    name: "Armour",
    description: "Armour is the second and last layer of hit points of a ship.",
    armour: MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:metal-scales"
  },
  {
    id: "A2",
    name: "Advanced Armour",
    description: "Armour is the second and last layer of hit points of a ship.",
    armour: MODULE_ARMOUR * DOUBLE_ENERGY_WEAPON_MULTI,
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 10,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.9 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1.1 }
    ],
    shape: "my:metal-scales"
  },
  {
    id: "E",
    name: "Stealth Armour",
    description: "This armour decrease fire drawn from enemies.",
    armour: MODULE_ARMOUR * 0.7,
    threatGainMulti: 0.5,
    threat: BASE_THREAT * -0.5,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:metal-scales"
  },
  {
    id: "B",
    name: "Ablative Armour",
    description: "An advanced armour that decrease incoming damage.",
    armour: 0.7 * MODULE_ARMOUR,
    armourDamageReduction: 0.22 * MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:metal-scales"
  },
  {
    id: "V",
    name: "Reactive Armour",
    description:
      "The ultimate armour, increases armour percent and decreases incoming damage and explosion chance.",
    energy: -1,
    explosion: -3 * MODULE_ARMOUR,
    armour: 2 * MODULE_ARMOUR,
    armourPercent: 15,
    armourDamageReduction: 0.18 * MODULE_ARMOUR,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    shape: "my:armor-upgrade"
  },
  {
    id: "D",
    name: "Deflector",
    description: "Deflector decreases incoming armour damage.",
    energy: -1,
    armour: MODULE_ARMOUR / 4,
    armourDamageReduction: 0.3 * MODULE_ARMOUR,
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
    description: "Shields are the first layer of hit points of a ship.",
    shield: MODULE_SHIELD,
    energy: -1,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:bubble-field"
  },
  {
    id: "s1",
    name: "Advanced Shield",
    description: "Shields are the first layer of hit points of a ship.",
    shield: MODULE_SHIELD * DOUBLE_ENERGY_WEAPON_MULTI,
    energy: -2,
    price: DEFAULT_MODULE_PRICE * 10,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.9 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.1 }
    ],
    shape: "my:bubble-field"
  },
  {
    id: "O",
    name: "Stealth Shield",
    description: "This shield decrease fire drawn from enemies.",
    shield: MODULE_SHIELD * 0.7,
    threatGainMulti: 0.5,
    threat: BASE_THREAT * -0.5,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:bubble-field"
  },
  {
    id: "j",
    name: "Jammer",
    description: "Jammer decrease incoming shield damage.",
    energy: -2,
    shield: MODULE_SHIELD / 4,
    shieldPercent: 8,
    shieldDamageReduction: 0.3 * MODULE_ARMOUR,
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
    description: "Solar panels generate energy from solar power.",
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
    description:
      "Radioisotope thermoelectric generator converts the heat released by the decay of a suitable radioactive material into electricity.",
    energy: 3,
    price: 20,
    shape: "my:mass-driver",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 0.3 * MODULE_ARMOUR
  },
  {
    id: "I",
    name: "Fission Reactor",
    description:
      "Fission Reactors use fission generate electricity by using heat from a self-sustained nuclear chain reaction.",
    energy: 5,
    price: 30,
    shape: "my:reactor",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 0.8 * MODULE_ARMOUR,
    explosionDamage: MODULE_DAMAGE
  },
  {
    id: "F",
    name: "Fusion Reactor",
    description:
      "Fusion Reactors generate electricity by using heat from nuclear fusion reactions.",
    energy: 6,
    price: 80,
    shape: "my:atom",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ]
  },
  {
    id: "J",
    name: "Antimatter Reactor",
    description:
      "Antimatter Reactors generate electricity by using heat from matter and anti matter annihilation.",
    energy: 7,
    price: 40,
    shape: "my:materials-science",
    technologies: [
      { technologyId: "e", multi: 1 },
      { technologyId: TECHNOLOGIES.Energy.id, multi: 1 }
    ],
    explosion: 1.5 * MODULE_ARMOUR,
    explosionDamage: 2 * MODULE_DAMAGE
  },
  //#endregion
  //#region Weapons
  //#region Physics
  {
    id: "L",
    name: "Laser",
    damage: MODULE_DAMAGE,
    shieldDamagePercent: 80,
    armourDamagePercent: 120,
    energy: -1,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    shape: "my:laser-blast"
  },
  {
    id: "L1",
    name: "Gamma Laser",
    damage: MODULE_DAMAGE * DOUBLE_ENERGY_WEAPON_MULTI,
    shieldDamagePercent: 75,
    armourDamagePercent: 125,
    energy: -2,
    price: DEFAULT_MODULE_PRICE * 10,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.9 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.1 }
    ],
    shape: "my:laser-blast"
  },
  {
    id: "L2",
    name: "X Laser",
    damage: MODULE_DAMAGE - WEAPON_PEN_1_MINUS,
    shieldDamagePercent: 80,
    armourDamagePercent: 120,
    energy: -1,
    armourPen: WEAPON_PEN_1,
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
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1.2 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 0.8 }
    ],
    shape: "my:plasma-bolt"
  },
  {
    id: "p2",
    name: "Plasma Cannon",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 1.5,
    damage: MODULE_DAMAGE - WEAPON_PEN_2_MINUS,
    armourDamageReduction: WEAPON_PEN_2,
    shieldDamagePercent: 30,
    armourDamagePercent: 170,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1.2 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 0.8 }
    ],
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
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.4 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.6 }
    ],
    threatGainMulti: 1.5,
    shape: "my:crumbling-ball"
  },
  {
    id: "g",
    name: "Ion Cannon",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 1.5,
    damage: MODULE_DAMAGE * 0.8,
    shieldDamagePercent: 175,
    armourDamagePercent: 25,
    technologies: [
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.3 },
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.7 }
    ],
    threatGainMulti: 2.5,
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
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.4 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.6 }
    ],
    threatGainMulti: 1.5,
    shape: "my:unstable-orb"
  },
  {
    id: "H",
    name: "Nuclear Bomb",
    energy: -1,
    price: DEFAULT_MODULE_PRICE * 3,
    damage: MODULE_DAMAGE / 2,
    shieldDamagePercent: 80,
    armourDamagePercent: 120,
    defenceDamagePercent: 300,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    adaptivePrecision: BASE_ADAPTIVE_PRECISION,
    shape: "my:nuclear-bomb"
  },
  //#endregion
  //#region Propulsion
  {
    id: "d",
    name: "Mass Driver",
    energy: -1,
    damage: MODULE_DAMAGE,
    price: DEFAULT_MODULE_PRICE,
    shieldDamagePercent: 120,
    armourDamagePercent: 80,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1 }
    ],

    shape: "my:clout"
  },
  {
    id: "d1",
    name: "Advanced Mass Driver",
    energy: -2,
    damage: MODULE_DAMAGE * DOUBLE_ENERGY_WEAPON_MULTI,
    price: DEFAULT_MODULE_PRICE * 10,
    shieldDamagePercent: 125,
    armourDamagePercent: 75,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.9 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 1.1 }
    ],

    shape: "my:clout"
  },
  {
    id: "d2",
    name: "AntiShield Mass Driver",
    energy: -1,
    damage: MODULE_DAMAGE - WEAPON_PEN_1_MINUS,
    price: DEFAULT_MODULE_PRICE,
    shieldDamagePercent: 120,
    armourDamagePercent: 80,
    shieldPen: WEAPON_PEN_1,
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
  {
    id: "c1",
    name: "Gauss Cannon",
    energy: -1,
    damage: MODULE_DAMAGE - WEAPON_PEN_2_MINUS,
    price: DEFAULT_MODULE_PRICE * 3,
    shieldDamagePercent: 170,
    armourDamagePercent: 30,
    shieldPen: WEAPON_PEN_2,
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
      { technologyId: TECHNOLOGIES.Mining.id, multi: 1 }
    ],
    threatGainMulti: 0.6,
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
    threatGainMulti: 0.6,
    shape: "my:focused-lightning"
  },
  //#endregion
  //#endregion
  //#region Others
  {
    id: "C",
    name: "Cargo",
    description:
      "Cargo increase metal, energy, alloy and components gained from battles.",
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    cargo: BASE_CARGO,
    explosion: MODULE_ARMOUR * -1,
    shape: "my:cube"
  },
  {
    id: "N",
    name: "Laboratory",
    description: "Laboratory increase science and search gained from battles.",
    technologies: [
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.3 },
      { technologyId: TECHNOLOGIES.Search.id, multi: 0.7 }
    ],
    scienceLab: BASE_CARGO * 10,
    shape: "fa-s:flask"
  },
  {
    id: "P",
    name: "Teleporter",
    description:
      "Teleporters greatly increase metal, energy, alloy and components gained from battles.",
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 }
    ],
    energy: -1,
    cargo: BASE_CARGO * 20,
    shape: "my:star-gate"
  },
  {
    id: "X",
    name: "Shield Charger",
    description: "Recharge shields of ally ships.",
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
    description:
      "Tracking System increase chance finding suitable targets and increase damage.",
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Computing.id, multi: 1 }
    ],
    energy: -1,
    precision: BASE_PRECISION,
    adaptivePrecision: BASE_ADAPTIVE_PRECISION,
    armourDamagePercent: 5,
    shieldDamagePercent: 5,
    shape: "my:targeting"
  },
  {
    id: "f",
    name: "Assistance Drone",
    description:
      "Assistance Drone improve precision, explosion, armour and shields.",
    technologies: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: 1.2 },
      { technologyId: TECHNOLOGIES.Computing.id, multi: 0.8 }
    ],
    precision: BASE_PRECISION * 0.75,
    explosion: MODULE_ARMOUR * -1.5,
    armourDamagePercent: 6,
    shieldDamagePercent: 6,
    armourPercent: 8,
    shieldPercent: 8,
    shape: "my:vintage-robot"
  },
  {
    id: "G",
    name: "Cloaking Device",
    description: "Cloaking Device decrease threat generated from damage done.",
    technologies: [
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    energy: -1,
    threatGainMulti: 0.3,
    threat: BASE_THREAT * -1,
    shape: "my:targeting"
  },
  {
    id: "b",
    name: "Suppressor",
    description: "Suppressor decrease threat generated from damage done.",
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1 }
    ],
    threatGainMulti: 0.55,
    shape: "my:cube"
  },
  {
    id: "W",
    name: "Coordinator",
    description: "Coordinator module improve overall fighting capability.",
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 1 },
      { technologyId: TECHNOLOGIES.Naval.id, multi: 1 }
    ],
    shape: "my:cube",
    energy: -1,
    explosion: MODULE_ARMOUR * -1.5,
    adaptivePrecision: BASE_ADAPTIVE_PRECISION / 4,
    armourDamagePercent: 15,
    shieldDamagePercent: 15,
    shieldPercent: 10,
    armourPercent: 10
  },
  {
    id: "cj",
    name: "Communications Jammer",
    description:
      "Communications Jammer blocks enemies communications in order to draw fire.",
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.8 },
      { technologyId: TECHNOLOGIES.Computing.id, multi: 1.2 }
    ],
    shape: "wifi",
    energy: -1,
    threat: MODULE_DAMAGE * 3
  },
  {
    id: "tb",
    name: "Tractor Beam",
    description: "Tractor Beam are the final threat technology.",
    technologies: [
      { technologyId: TECHNOLOGIES.CivilEngineering.id, multi: 0.7 },
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.3 }
    ],
    shape: "my:magnet-blast",
    energy: -2,
    threat: MODULE_DAMAGE * 5
  },
  {
    id: "ps",
    name: "Armor-piercing shell",
    description: "Armor-piercing shell. Propulsion weapons only.",
    price: 20,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.8 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1.2 }
    ],
    shape: "my:cube",
    affectedWeaponsTechnologies: [TECHNOLOGIES.Propulsion.id],
    armourDamagePercent: 16,
    shieldDamagePercent: -5
  },
  {
    id: "es",
    name: "Anti-shield shell",
    description: "Anti shield shell. Propulsion weapons only.",
    price: 50,
    technologies: [
      { technologyId: TECHNOLOGIES.MilitaryEngineering.id, multi: 0.8 },
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1.2 }
    ],
    shape: "my:cube",
    affectedWeaponsTechnologies: [TECHNOLOGIES.Propulsion.id],
    armourDamagePercent: -5,
    shieldDamagePercent: 16
  },
  {
    id: "y",
    name: "Cyborgizer",
    description:
      "Spread nanobots in the planet, increasing components and habitability.",
    price: 200,
    energy: -2,
    shape: "my:nano-bot",
    technologies: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: 1.4 },
      { technologyId: TECHNOLOGIES.Search.id, multi: 0.6 }
    ],
    components: BASE_CARGO * 10,
    terraformer: BASE_TERRAFORMER / 10
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
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.25 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 0.75 }
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
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.6 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 0.4 }
    ],
    acceleration: BASE_ACCELERATION * 5,
    shape: "my:rocket-thruster"
  },
  {
    id: "K",
    name: "Jump Drive",
    price: 100,
    energy: -3,
    technologies: [
      { technologyId: TECHNOLOGIES.Physics.id, multi: 1.7 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 0.3 }
    ],
    acceleration: BASE_ACCELERATION * 7,
    shape: "my:rocket-thruster"
  },
  {
    id: "l",
    name: "Solar Sail",
    technologies: [
      { technologyId: TECHNOLOGIES.Materials.id, multi: 1.2 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: 0.8 }
    ],
    acceleration: BASE_ACCELERATION * 0.1,
    threat: BASE_THREAT,
    shape: "my:rocket-thruster"
  }
  //#endregion
];
