import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";
import {
  OPTIMIZED_SHIP_PREFIX,
  ORIGIN_1_TECH_MULTI,
  ORIGIN_1_TECH_2_MULTI,
  REPEATABLE_RES_PRICE_MULTI,
  IDS,
  MAT_IDS,
  MEGA_IDS,
  ANTI_ARMOUR_SHELL_LEVEL,
  ANTI_SHIELD_SHELL_LEVEL,
  STRU_IDS,
  SPACE_PORT_LEVEL,
  ROTATING_SKYHOOK_LEVEL,
  SKYHOOK_LEVEL,
  SUPER_TETHER_LEVEL,
  MORE_DRONES_RESEARCH,
  MORE_DRONES_RESEARCH_2,
  MODDERS_1_MULTI,
  MODDERS_2_MULTI,
  BUILD_IDS
} from "../CONSTANTS";
import { ExclusiveResGroups } from "../researches/exclusiveResGroups";

export const RESEARCHES: IResearchData[] = [
  //#region Researches
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    unitsToUnlock: ["A", "a", "w", "W", "4", "5"],
    researchToUnlock: [
      "h",
      "p",
      "E",
      "M",
      "s1",
      "n",
      OPTIMIZED_SHIP_PREFIX + 1
    ],
    max: 1,
    priceMulti: 500,
    type: TECHNOLOGIES.MilitaryEngineering,
    prodMulti: [
      { unitId: "m", multi: 0.5 },
      { unitId: "e", multi: 0.2 }
    ]
  },
  {
    id: "p",
    name: "Physics",
    description: "Unlock Physics Technology",
    max: 1,
    type: TECHNOLOGIES.Physics,
    researchToUnlock: ["c", "p0", "or1"],
    technologiesToUnlock: ["p"],
    modulesToUnlock: ["s"],
    effMulti: [{ unitId: "s", multi: 0.5 }],
    inspirationBuildingId: "3"
  },
  {
    id: "c",
    name: "Computing",
    description: "Unlock Computing Technology",
    max: 1,
    type: TECHNOLOGIES.Computing,
    spellToUnlock: "d1",
    computingPerSec: 3,
    technologiesToUnlock: ["c"],
    researchToUnlock: ["c1"]
  },
  {
    id: "n",
    name: "Naval Logistics",
    description: "Increase Naval Capacity",
    max: 1,
    type: TECHNOLOGIES.Naval,
    technologiesToUnlock: [TECHNOLOGIES.Naval.id],
    researchToUnlock: ["n1", "ns", "or2"],
    navalCapacity: 10,
    materialMulti: 0.5,
    districtMulti: 0.3
  },
  {
    id: "h",
    name: "Searching",
    description: "Unlock Searchers",
    max: 1,
    type: TECHNOLOGIES.Search,
    unitsToUnlock: ["r", "R", "6"],
    researchToUnlock: ["h0"],
    technologiesToUnlock: ["r"],
    inspirationDescription: "Defeat an enemy"
  },
  {
    id: "P",
    name: "Propulsion",
    description: "Unlock Propulsion",
    max: 1,
    type: TECHNOLOGIES.Propulsion,
    technologiesToUnlock: [TECHNOLOGIES.Propulsion.id],
    researchToUnlock: ["P1"],
    modulesToUnlock: ["d"]
  },
  {
    id: "x",
    name: "Robotics",
    description: "Unlock Replicators",
    max: 1,
    type: TECHNOLOGIES.Robotics,
    unitsToUnlock: ["x", "X", "7", "9"],
    technologiesToUnlock: [TECHNOLOGIES.Robotics.id],
    researchToUnlock: ["x1"],
    prodMulti: [
      { unitId: "m", multi: 0.3 },
      { unitId: "e", multi: 0.1 },
      { unitId: "s", multi: 0.3 },
      { unitId: "a", multi: 0.3 },
      { unitId: "w", multi: 0.3 },
      { unitId: "r", multi: 0.3 },
      { unitId: "X", multi: 0.3 },
      { unitId: "B", multi: 0.3 }
    ],
    inspirationDescription: "Mod any drones"
  },
  {
    id: "M",
    name: "Materials",
    description: "Unlock Materials Technology",
    max: 1,
    type: TECHNOLOGIES.Materials,
    technologiesToUnlock: ["m", TECHNOLOGIES.CivilEngineering.id],
    researchToUnlock: ["x", "N", "P", "M0", "or3"],
    inspirationBuildingId: "1",
    prodMulti: [
      { unitId: "m", multi: 0.4 },
      { unitId: "e", multi: 0.15 }
    ]
  },
  {
    id: "N",
    name: "Mining",
    description: "Unlock Mining Technology",
    max: 1,
    type: TECHNOLOGIES.Mining,
    technologiesToUnlock: [TECHNOLOGIES.Mining.id],
    prodMulti: [{ unitId: "m", multi: 0.5 }],
    researchToUnlock: ["N1", "N-0"],
    inspirationBuildingId: "1"
  },
  {
    id: "E",
    name: "Energy",
    description: "Unlock Energy Technology",
    max: 1,
    type: TECHNOLOGIES.Energy,
    technologiesToUnlock: [TECHNOLOGIES.Energy.id],
    unitsToUnlock: ["8"],
    limitMulti: [{ unitId: "E", multi: 1 }],
    effMulti: [{ unitId: "e", multi: 0.1 }],
    researchToUnlock: ["E0", "E-0"],
    inspirationBuildingId: "2"
  },
  {
    id: "b",
    name: "Nuke",
    description: "Nuke",
    max: 1,
    type: TECHNOLOGIES.MilitaryEngineering,
    unitsToUnlock: ["b", "B", "10", "11"],
    inspirationDescription: "Win a battle vs. ground defences"
  },
  {
    id: "ns",
    name: "Scavenging",
    description: "Increase materials gain from battles",
    type: TECHNOLOGIES.Naval,
    researchToUnlock: ["ns1"],
    materialMulti: 1,
    battleMulti: [
      { materialId: "M", multi: 1 },
      { materialId: "E", multi: 1 }
    ],
    inspirationDescription: "Defeat an enemy"
  },
  {
    id: "ns1",
    name: "Assimilation",
    description: "Increase components gain from battles",
    type: TECHNOLOGIES.Naval,
    battleMulti: [{ materialId: MAT_IDS.Components, multi: 1 }],
    inspirationDescription: "Defeat an enemy"
  },
  {
    id: "ns2",
    name: "Improved ships design",
    description: "",
    type: TECHNOLOGIES.MilitaryEngineering,
    unlockFrom: "n3",
    requiredCardId: "r4",
    shipProductionBonusAll: 0.1
  },
  {
    id: "p-L2",
    name: "X Laser",
    description: "Unlock X Laser.",
    unlockFrom: "p10",
    type: TECHNOLOGIES.Physics,
    max: 1,
    modulesToUnlock: ["L2"]
    //requiredChallenge: { challengeId: "7", level: ANTI_ARMOUR_SHELL_LEVEL }
  },
  {
    id: "p-p2",
    name: "Plasma Cannon",
    description: "Unlock Plasma Cannon.",
    unlockFrom: "p16",
    type: TECHNOLOGIES.Physics,
    max: 1,
    modulesToUnlock: ["p2"]
    //requiredChallenge: { challengeId: "7", level: ANTI_ARMOUR_SHELL_LEVEL }
  },
  //#endregion
  //#region Search
  {
    id: "hz1",
    name: "Habitable zone",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h",
    districtMulti: 0.2
  },
  {
    id: "hz3",
    name: "Improved searching",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h0",
    effMulti: [{ unitId: "r", multi: 0.05 }]
  },
  {
    id: "hz2",
    name: "Optimistic zone",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h1",
    districtMulti: 0.25
  },
  {
    id: "hz4",
    name: "Better habitability search",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h10",
    districtMulti: 0.25
  },
  {
    id: "hz5",
    name: "Advanced Searching",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h14",
    districtMulti: 0.3
  },
  //#endregion
  //#region Energy
  {
    id: "E-0",
    name: "Energy optimization",
    description: "",
    type: TECHNOLOGIES.Energy,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    effMulti: [{ unitId: IDS.Technician, multi: 0.05 }]
  },
  {
    id: "E-1",
    name: "Renewable energy",
    description: "",
    type: TECHNOLOGIES.Energy,
    unlockFrom: "E0",
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    energyDistMulti: 0.3
  },
  {
    id: "E-3",
    name: "Field Modulation",
    description: "",
    type: TECHNOLOGIES.Energy,
    unlockFrom: "E1",
    requiredCardId: "r4",
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    effMulti: [{ unitId: IDS.Technician, multi: 0.02 }]
  },
  //#endregion
  //#region Mining
  {
    id: "N-0",
    name: "Space mining",
    description: "",
    type: TECHNOLOGIES.Mining,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    prodMulti: [{ unitId: IDS.Miner, multi: 0.1 }]
  },
  {
    id: "N-1",
    name: "Deep mining",
    description: "",
    type: TECHNOLOGIES.Mining,
    unlockFrom: "N1",
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    miningDistMulti: 0.3
  },
  {
    id: "N-2",
    name: "Asteroid mining",
    description: "",
    type: TECHNOLOGIES.Mining,
    unlockFrom: "N-1",
    requiredCardId: "r4",
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    miningDistMulti: 0.3
  },
  //#endregion
  //#region Robotic
  {
    id: "X-1",
    name: "Assembly patterns",
    description: "",
    type: TECHNOLOGIES.Robotics,
    unlockFrom: "x",
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    effMulti: [{ unitId: IDS.Replicator, multi: 0.05 }]
  },
  //#endregion
  //#region Propulsion
  {
    id: "P-1",
    name: "Gravity assist",
    description: "",
    unlockFrom: "P2",
    type: TECHNOLOGIES.Propulsion,
    accelerationMulti: 0.05,
    max: 10
  },
  {
    id: "P-2",
    name: "Black Hole Gravity assist",
    description: "",
    unlockFrom: "P5",
    type: TECHNOLOGIES.Propulsion,
    accelerationMulti: 0.1,
    max: 10
  },
  {
    id: "P-3",
    name: "Wormhole travel",
    description: "",
    unlockFrom: "P8",
    type: TECHNOLOGIES.Propulsion,
    accelerationMulti: 0.15,
    max: 10
  },
  {
    id: "P-d2",
    name: "AntiShield Mass Driver",
    description: "Unlock AntiShield Mass Driver.",
    unlockFrom: "P10",
    type: TECHNOLOGIES.Propulsion,
    max: 1,
    modulesToUnlock: ["d2"]
    //requiredChallenge: { challengeId: "7", level: ANTI_ARMOUR_SHELL_LEVEL }
  },
  {
    id: "P-c1",
    name: "Gauss Cannon",
    description: "Unlock Gauss Cannon.",
    unlockFrom: "P16",
    type: TECHNOLOGIES.Propulsion,
    max: 1,
    modulesToUnlock: ["c1"]
    //requiredChallenge: { challengeId: "7", level: ANTI_ARMOUR_SHELL_LEVEL }
  },
  //#endregion
  //#region Materials
  {
    id: "M-1",
    name: "Armour-piercing shell",
    description: "Improve armour damage of propulsion weapons.",
    unlockFrom: "M3",
    type: TECHNOLOGIES.Materials,
    max: 1,
    modulesToUnlock: ["ps"],
    requiredChallenge: { challengeId: "7", level: ANTI_ARMOUR_SHELL_LEVEL }
  },
  {
    id: "M-2",
    name: "Anti-shield shell",
    description: "Improve shield damage of propulsion weapons.",
    unlockFrom: "M8",
    type: TECHNOLOGIES.Materials,
    max: 1,
    modulesToUnlock: ["es"],
    requiredChallenge: { challengeId: "7", level: ANTI_SHIELD_SHELL_LEVEL }
  },
  //#endregion
  //#region Origin: Science
  {
    id: "or1",
    name: "Scientists origin",
    max: 1,
    description:
      "Droids were originally build for assisting in researches and exploring the space. This path focus on science, physics and searching. It can adapt to any play style.",
    type: TECHNOLOGIES.Physics,
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
    researchToUnlock: ["or11", "or13", "or14"],
    prodMulti: [{ unitId: "s", multi: 0.2 }],
    spellToUnlock: "or1",
    technologyBonus: [
      { techId: TECHNOLOGIES.Physics.id, multi: ORIGIN_1_TECH_MULTI },
      { techId: TECHNOLOGIES.Search.id, multi: ORIGIN_1_TECH_2_MULTI }
    ]
  },
  {
    id: "or11",
    name: "Research Module",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Physics,
    modulesToUnlock: ["N"],
    researchToUnlock: ["or12"],
    scienceMulti: 1
  },
  {
    id: "or12",
    name: "Orbital Research Lab",
    max: 10,
    description: "",
    type: TECHNOLOGIES.Physics,
    researchToUnlock: ["or15", "or16"],
    effMulti: [{ unitId: "s", multi: 0.015, secondUnitId: "i1" }],
    inspirationSpaceStationId: "i1"
  },
  {
    id: "or13",
    name: "Improved Laboratory",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Physics,
    buildingPoints: [{ buildingId: "3", quantity: 2 }],
    technologyBonus: [
      { techId: TECHNOLOGIES.Physics.id, multi: ORIGIN_1_TECH_MULTI * 0.5 }
    ]
  },
  {
    id: "or14",
    name: "Improved Observatory",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Search,
    buildingPoints: [{ buildingId: "6", quantity: 2 }],
    technologyBonus: [
      { techId: TECHNOLOGIES.Search.id, multi: ORIGIN_1_TECH_MULTI * 0.5 }
    ]
  },
  {
    id: "or15",
    name: "Scientist Yards",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    limitMulti: [{ unitId: IDS.Scientist, multi: 0.01, secondUnitId: "i2" }],
    inspirationSpaceStationId: "i2"
  },
  {
    id: "or16",
    name: "Searchers Yards",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Search,
    limitMulti: [{ unitId: IDS.Searcher, multi: 0.01, secondUnitId: "i2" }],
    inspirationSpaceStationId: "i2"
  },
  //#endregion
  //#region Origin: War
  {
    id: "or2",
    name: "War origin",
    max: 1,
    description:
      "Droids were originally build for warfare. This path focus on battle (active style).",
    type: TECHNOLOGIES.Naval,
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
    spellToUnlock: "or2",
    researchToUnlock: ["or21", "or23", "or24"],
    technologyBonus: [
      { techId: TECHNOLOGIES.Naval.id, multi: ORIGIN_1_TECH_MULTI },
      {
        techId: TECHNOLOGIES.MilitaryEngineering.id,
        multi: ORIGIN_1_TECH_2_MULTI
      }
    ]
  },
  {
    id: "or21",
    name: "Tactics",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Naval,
    researchToUnlock: ["or27"],
    modulesToUnlock: ["W"],
    navalCapacity: 150
  },
  {
    id: "or22",
    name: "Planetary Acquisition",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Naval,
    districtMulti: 1
  },
  {
    id: "or23",
    name: "Military Industry",
    max: 1,
    description: "",
    type: TECHNOLOGIES.MilitaryEngineering,
    researchToUnlock: ["or25"],
    buildingPoints: [
      { buildingId: "4", quantity: 1 },
      { buildingId: "10", quantity: 1 }
    ],
    technologyBonus: [
      {
        techId: TECHNOLOGIES.MilitaryEngineering.id,
        multi: ORIGIN_1_TECH_MULTI * 0.25
      },
      { techId: TECHNOLOGIES.Naval.id, multi: ORIGIN_1_TECH_MULTI * 0.25 }
    ],
    limitMulti: [{ unitId: MAT_IDS.Nuke, multi: 1 }]
  },
  {
    id: "or24",
    name: "Pillage",
    max: 10,
    description: "",
    type: TECHNOLOGIES.Naval,
    researchToUnlock: ["or26"],
    materialMulti: 1
  },
  {
    id: "or25",
    name: "Military Focus",
    max: 1,
    description: "",
    type: TECHNOLOGIES.MilitaryEngineering,
    limitMulti: [
      { unitId: IDS.NukeSpecialist, multi: 0.2 },
      { unitId: IDS.Worker, multi: 0.2 },
      { unitId: MAT_IDS.Nuke, multi: 1 }
    ],
    buildingPoints: [
      { buildingId: "5", quantity: 1 },
      { buildingId: "10", quantity: 1 }
    ]
  },
  {
    id: "or26",
    name: "Ransack",
    max: 10,
    description: "",
    type: TECHNOLOGIES.Naval,
    researchToUnlock: ["or22"],
    materialMulti: 0.2,
    speedMulti: 0.1
  },
  {
    id: "or27",
    name: "Grand strategy",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Naval,
    modulesToUnlock: ["W"],
    navalCapacity: 200,
    technologyBonus: [
      { techId: TECHNOLOGIES.Naval.id, multi: ORIGIN_1_TECH_MULTI }
    ]
  },
  //#endregion
  //#region Origin: Builders
  {
    id: "or3",
    name: "Builders origin",
    max: 1,
    description:
      "Droids were originally designed for industry. This path focus on idle style, with less reliance on battles.",
    type: TECHNOLOGIES.CivilEngineering,
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
    prodMulti: [{ unitId: "w", multi: 0.2 }],
    spellToUnlock: "or3",
    technologyBonus: [
      { techId: TECHNOLOGIES.CivilEngineering.id, multi: ORIGIN_1_TECH_MULTI },
      { techId: TECHNOLOGIES.Materials.id, multi: ORIGIN_1_TECH_2_MULTI }
    ],
    researchToUnlock: ["or31", "or33", "or34", "or36"]
  },
  {
    id: "or31",
    name: "Reactive Armour",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    modulesToUnlock: ["V"],
    researchToUnlock: ["or32"],
    shipProductionBonusAll: 1
  },
  {
    id: "or32",
    name: "Advanced Space Stations",
    max: 10,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    stationToUp: [],
    inspirationDescription: "Build any space station"
  },
  {
    id: "or33",
    name: "Primary Industry",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    researchToUnlock: ["or35"],
    buildingPoints: [
      { buildingId: "1", quantity: 1 },
      { buildingId: "2", quantity: 1 }
    ],
    technologyBonus: [
      { techId: TECHNOLOGIES.Mining.id, multi: ORIGIN_1_TECH_MULTI * 0.25 },
      { techId: TECHNOLOGIES.Energy.id, multi: ORIGIN_1_TECH_MULTI * 0.25 }
    ]
  },
  {
    id: "or34",
    name: "Secondary Industry",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    buildingPoints: [
      { buildingId: "4", quantity: 1 },
      { buildingId: "5", quantity: 1 }
    ],
    technologyBonus: [
      { techId: TECHNOLOGIES.Materials.id, multi: ORIGIN_1_TECH_MULTI * 0.25 },
      {
        techId: TECHNOLOGIES.CivilEngineering.id,
        multi: ORIGIN_1_TECH_MULTI * 0.25
      }
    ]
  },
  {
    id: "or35",
    name: "Orbital Satellites",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    researchToUnlock: ["or37", "or38"],
    effMulti: [{ unitId: IDS.Technician, multi: 0.02, secondUnitId: "i1" }],
    inspirationSpaceStationId: "i1"
  },
  {
    id: "or36",
    name: "Primary Industry focus",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    inspirationBuildingId: "2",
    limitMulti: [
      {
        unitId: IDS.Miner,
        multi: 0.4
      },
      {
        unitId: IDS.Technician,
        multi: 0.4
      }
    ]
  },
  {
    id: "or37",
    name: "Mining Drones Yards",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    limitMulti: [{ unitId: IDS.Miner, multi: 0.01, secondUnitId: "i2" }],
    inspirationSpaceStationId: "i2"
  },
  {
    id: "or38",
    name: "Technicians Yards",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    limitMulti: [{ unitId: IDS.Technician, multi: 0.01, secondUnitId: "i2" }],
    inspirationSpaceStationId: "i2"
  },
  //#endregion
  //#region MegStructures
  {
    id: "M" + MEGA_IDS.DysonSphere,
    name: "Dyson Sphere",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Energy,
    unitsToUnlock: [MEGA_IDS.DysonSphere],
    unlockFrom: "E8"
  },
  {
    id: "M" + MEGA_IDS.MegaFoundry,
    name: "Mega Foundry",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Materials,
    unitsToUnlock: [MEGA_IDS.MegaFoundry],
    unlockFrom: "M8"
  },
  {
    id: "M" + MEGA_IDS.MegaLaboratory,
    name: "Mega Laboratory",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Physics,
    unitsToUnlock: [MEGA_IDS.MegaLaboratory],
    unlockFrom: "p8"
  },
  {
    id: "M" + MEGA_IDS.MegaShipyard,
    name: "Mega Shipyard",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    unitsToUnlock: [MEGA_IDS.MegaShipyard],
    unlockFrom: "i6"
  },
  {
    id: "M" + MEGA_IDS.MegaTelescope,
    name: "Mega Telescope",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Search,
    unitsToUnlock: [MEGA_IDS.MegaTelescope],
    unlockFrom: "h8"
  },
  {
    id: "M" + MEGA_IDS.MegaNaval,
    name: "Mega Coordination Center",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Naval,
    unitsToUnlock: [MEGA_IDS.MegaNaval],
    unlockFrom: "n9"
  },
  {
    id: "M" + MEGA_IDS.Gateway,
    name: "Gateway",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Propulsion,
    unitsToUnlock: [MEGA_IDS.Gateway],
    unlockFrom: "P-3"
  },
  {
    id: "M" + MEGA_IDS.MegaComputing,
    name: "Mega Computing Center",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Computing,
    unitsToUnlock: [MEGA_IDS.MegaComputing],
    unlockFrom: "c8"
  },
  //#endregion
  //#region Infrastructure
  {
    id: "S" + STRU_IDS.SpacePort,
    name: "Space Port",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Propulsion,
    unitsToUnlock: [STRU_IDS.SpacePort],
    unlockFrom: "P1",
    requiredChallenge: { challengeId: "8", level: SPACE_PORT_LEVEL }
  },
  {
    id: "S" + STRU_IDS.Skyhook,
    name: "Skyhook",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Propulsion,
    unitsToUnlock: [STRU_IDS.Skyhook],
    unlockFrom: "P2",
    requiredChallenge: { challengeId: "8", level: SKYHOOK_LEVEL }
  },
  {
    id: "S" + STRU_IDS.RotatingSkyhook,
    name: "Rotating Skyhook",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Propulsion,
    unitsToUnlock: [STRU_IDS.RotatingSkyhook],
    unlockFrom: "P4",
    requiredChallenge: { challengeId: "8", level: ROTATING_SKYHOOK_LEVEL }
  },
  {
    id: "S" + STRU_IDS.SuperTether,
    name: "Super Tether",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Propulsion,
    unitsToUnlock: [STRU_IDS.SuperTether],
    unlockFrom: "P6",
    requiredChallenge: { challengeId: "8", level: SUPER_TETHER_LEVEL }
  },
  //#endregion
  //#region More Drones
  {
    id: "m-h",
    name: "More search drones",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h11",
    limitMulti: [{ unitId: IDS.Searcher, multi: MORE_DRONES_RESEARCH }]
  },
  {
    id: "m-s",
    name: "More scientist drones",
    description: "",
    type: TECHNOLOGIES.Physics,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "p11",
    limitMulti: [{ unitId: IDS.Scientist, multi: MORE_DRONES_RESEARCH }]
  },
  {
    id: "m-E",
    name: "More technician drones",
    description: "",
    type: TECHNOLOGIES.Energy,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "E11",
    limitMulti: [{ unitId: IDS.Technician, multi: MORE_DRONES_RESEARCH / 2 }]
  },
  {
    id: "m-N",
    name: "More mining drones",
    description: "",
    type: TECHNOLOGIES.Mining,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "N11",
    limitMulti: [{ unitId: IDS.Miner, multi: MORE_DRONES_RESEARCH }]
  },
  {
    id: "m-M",
    name: "More metallurgist drones",
    description: "",
    type: TECHNOLOGIES.Materials,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "M11",
    limitMulti: [{ unitId: IDS.Metallurgist, multi: MORE_DRONES_RESEARCH }]
  },
  {
    id: "m-W",
    name: "More worker drones",
    description: "",
    type: TECHNOLOGIES.Materials,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "M11",
    limitMulti: [{ unitId: IDS.Worker, multi: MORE_DRONES_RESEARCH }]
  },
  //#endregion
  //#region More Drones 2
  {
    id: "M-h",
    name: "Even more search drones",
    description: "",
    type: TECHNOLOGIES.Search,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "h15",
    limitMulti: [{ unitId: IDS.Searcher, multi: MORE_DRONES_RESEARCH_2 }]
  },
  {
    id: "M-s",
    name: "Even more scientist drones",
    description: "",
    type: TECHNOLOGIES.Physics,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "p15",
    limitMulti: [{ unitId: IDS.Scientist, multi: MORE_DRONES_RESEARCH_2 }]
  },
  {
    id: "M-E",
    name: "Even more technician drones",
    description: "",
    type: TECHNOLOGIES.Energy,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "E15",
    limitMulti: [{ unitId: IDS.Technician, multi: MORE_DRONES_RESEARCH_2 / 2 }]
  },
  {
    id: "M-N",
    name: "Even more mining drones",
    description: "",
    type: TECHNOLOGIES.Mining,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "N15",
    limitMulti: [{ unitId: IDS.Miner, multi: MORE_DRONES_RESEARCH_2 }]
  },
  {
    id: "M-M",
    name: "Even more metallurgist drones",
    description: "",
    type: TECHNOLOGIES.Materials,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "M15",
    limitMulti: [{ unitId: IDS.Metallurgist, multi: MORE_DRONES_RESEARCH_2 }]
  },
  {
    id: "M-W",
    name: "Even more worker drones",
    description: "",
    type: TECHNOLOGIES.Materials,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    unlockFrom: "M15",
    limitMulti: [{ unitId: IDS.Worker, multi: MORE_DRONES_RESEARCH_2 }]
  },
  //#endregion
  //#region Civil
  {
    id: "se1",
    name: "Space Engineering",
    description: "",
    max: 10,
    type: TECHNOLOGIES.CivilEngineering,
    unlockFrom: "i3",
    spaceStationBuildBonus: 0.5
  },
  {
    id: "se2",
    name: "Advanced Space Engineering",
    description: "",
    max: 10,
    type: TECHNOLOGIES.CivilEngineering,
    unlockFrom: "i7",
    spaceStationBuildBonus: 2
  },
  {
    id: "cV",
    name: "Advanced Factories",
    description: "",
    max: 10,
    type: TECHNOLOGIES.CivilEngineering,
    limitMulti: [{ unitId: IDS.Worker, multi: 0.1 }],
    unlockFrom: "CV0"
  },
  {
    id: "spa",
    name: "Orbital Expansions",
    max: 10,
    description: "Improve all space stations",
    type: TECHNOLOGIES.CivilEngineering,
    stationToUp: [],
    inspirationDescription: "Build any space station",
    unlockFrom: "CV0"
  },
  //#endregion
  //#region Specialization: Mega Builder
  {
    id: "spe1",
    max: 1,
    name: "Mega Builders",
    description:
      "Mega builders are specialized in building big ships, big space stations and megastructures.",
    exclusiveGroup: ExclusiveResGroups.SPECIALIZATION,
    type: TECHNOLOGIES.CivilEngineering,
    unlockFrom: "CV2",
    spellToUnlock: "spe1",
    researchToUnlock: ["spe1-1", "spe1-4"],
    limitMulti: [{ unitId: IDS.Worker, multi: 0.3 }],
    effMulti: [{ unitId: IDS.Worker, multi: 0.2 }]
  },
  {
    id: "spe1-1",
    max: 10,
    name: "Advanced Habitat",
    description: "Improved Habitats.",
    type: TECHNOLOGIES.CivilEngineering,
    stationToUp: [{ stationId: "i6", habSpace: 5 }],
    researchToUnlock: ["spe1-2"]
  },
  {
    id: "spe1-2",
    max: 10,
    name: "Advanced Ring World",
    description: "Improved Ring World.",
    type: TECHNOLOGIES.CivilEngineering,
    stationToUp: [{ stationId: "i7", habSpace: 5 }],
    researchToUnlock: ["spe1-3"]
  },
  {
    id: "spe1-3",
    max: 10,
    name: "Advanced Double Ring World",
    description: "Improved Ring World.",
    type: TECHNOLOGIES.CivilEngineering,
    stationToUp: [{ stationId: "i8", habSpace: 5 }]
  },
  {
    id: "spe1-4",
    max: 10,
    name: "Advanced Dreadnought",
    description: "Improved Dreadnought build speed.",
    type: TECHNOLOGIES.MilitaryEngineering,
    shipProductionBonus: [{ shipType: 9, multi: 5 }],
    researchToUnlock: ["spe1-5"]
  },
  {
    id: "spe1-5",
    max: 10,
    name: "Advanced Titan",
    description: "Improved Titan build speed.",
    type: TECHNOLOGIES.MilitaryEngineering,
    shipProductionBonus: [{ shipType: 10, multi: 5 }],
    researchToUnlock: ["spe1-6"]
  },
  {
    id: "spe1-6",
    max: 10,
    name: "Advanced Dreadnought",
    description: "Improved Colossus build speed.",
    type: TECHNOLOGIES.MilitaryEngineering,
    shipProductionBonus: [{ shipType: 11, multi: 5 }]
  },
  //#endregion
  //#region Specialization: Modders
  {
    id: "spe2",
    max: 1,
    name: "Modders",
    description: "Modders are trying to achieve the best possible drone.",
    exclusiveGroup: ExclusiveResGroups.SPECIALIZATION,
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["spe2-1", "spe2-2", "spe2-3"],
    unlockFrom: "x11",
    limitMulti: [{ unitId: MAT_IDS.Components, multi: 2 }],
    recycling: 10,
    modulesToUnlock: ["y"],
    modPoints: [
      { unitId: IDS.Miner, multi: MODDERS_1_MULTI },
      { unitId: IDS.Technician, multi: MODDERS_1_MULTI },
      { unitId: IDS.Scientist, multi: MODDERS_1_MULTI },
      { unitId: IDS.Metallurgist, multi: MODDERS_1_MULTI },
      { unitId: IDS.Worker, multi: MODDERS_1_MULTI },
      // { unitId: IDS.Replicator, multi: MODDERS_1_MULTI },
      { unitId: IDS.Searcher, multi: MODDERS_1_MULTI },
      { unitId: IDS.NukeSpecialist, multi: MODDERS_1_MULTI }
    ]
  },
  {
    id: "spe2-1",
    max: 10,
    name: "Advanced Robotics",
    description: "",
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["spe2-12"],
    technologyBonus: [{ techId: TECHNOLOGIES.Robotics.id, multi: 1 }]
  },
  {
    id: "spe2-12",
    max: 10,
    name: "Recyclable designs",
    description: "",
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["spe2-13"],
    recycling: 100,
    technologyBonus: [{ techId: TECHNOLOGIES.Robotics.id, multi: 0.5 }]
  },
  {
    id: "spe2-13",
    max: 10,
    name: "Extensible designs",
    description: "",
    type: TECHNOLOGIES.Robotics,
    recycling: 100,
    technologyBonus: [{ techId: TECHNOLOGIES.Robotics.id, multi: 0.5 }],
    modPoints: [
      { unitId: IDS.Miner, multi: MODDERS_1_MULTI / 2 },
      { unitId: IDS.Technician, multi: MODDERS_1_MULTI / 2 },
      { unitId: IDS.Scientist, multi: MODDERS_1_MULTI / 2 },
      { unitId: IDS.Metallurgist, multi: MODDERS_1_MULTI / 2 },
      { unitId: IDS.Worker, multi: MODDERS_1_MULTI / 2 },
      // { unitId: IDS.Replicator, multi: MODDERS_1_MULTI },
      { unitId: IDS.Searcher, multi: MODDERS_1_MULTI / 2 },
      { unitId: IDS.NukeSpecialist, multi: MODDERS_1_MULTI / 2 }
    ]
  },
  {
    id: "spe2-2",
    max: 10,
    name: "Advanced Drone Storage",
    description: "",
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["spe2-23"],
    limitMulti: [{ unitId: MAT_IDS.Components, multi: 10 }],
    buildingPoints: [{ buildingId: BUILD_IDS.DroneFactory, quantity: 1 }]
  },
  {
    id: "spe2-23",
    max: 10,
    name: "Advanced Drone Factory",
    description: "",
    type: TECHNOLOGIES.Robotics,
    buildingPoints: [{ buildingId: BUILD_IDS.DroneFactory, quantity: 5 }]
  },
  {
    id: "spe2-3",
    max: 1,
    name: "Menial drones upgrade",
    description: "",
    researchToUnlock: ["spe2-4"],
    type: TECHNOLOGIES.Robotics,
    modPoints: [
      { unitId: IDS.Miner, multi: MODDERS_2_MULTI },
      { unitId: IDS.Technician, multi: MODDERS_2_MULTI },
      { unitId: IDS.Metallurgist, multi: MODDERS_2_MULTI }
    ]
  },
  {
    id: "spe2-4",
    max: 1,
    name: "Specialist drones upgrade",
    researchToUnlock: ["spe2-5"],
    description: "",
    type: TECHNOLOGIES.Robotics,
    modPoints: [
      { unitId: IDS.Worker, multi: MODDERS_2_MULTI },
      { unitId: IDS.NukeSpecialist, multi: MODDERS_2_MULTI }
    ]
  },
  {
    id: "spe2-5",
    max: 1,
    name: "Science drones upgrade",
    description: "",
    type: TECHNOLOGIES.Robotics,
    modPoints: [
      { unitId: IDS.Scientist, multi: MODDERS_2_MULTI },
      { unitId: IDS.Searcher, multi: MODDERS_2_MULTI }
    ]
  },
  //#endregion
  //#region Specialization: Explorers
  {
    id: "spe3",
    max: 1,
    name: "Explorers",
    description: "Explorers focus on space exploration.",
    exclusiveGroup: ExclusiveResGroups.SPECIALIZATION,
    type: TECHNOLOGIES.Search,
    unlockFrom: "h11",
    researchToUnlock: ["spe3-1", "spe3-2", "spe3-3"],
    modulesToUnlock: ["K"],
    limitMulti: [{ unitId: IDS.Searcher, multi: 0.3 }],
    effMulti: [{ unitId: IDS.Searcher, multi: 0.3 }],
    technologyBonus: [
      { techId: TECHNOLOGIES.Search.id, multi: 0.5 },
      { techId: TECHNOLOGIES.Physics.id, multi: 0.2 }
    ]
  },
  {
    id: "spe3-1",
    max: 10,
    name: "Improved Search 1",
    description: "Increase districts gain.",
    type: TECHNOLOGIES.Search,
    researchToUnlock: ["spe3-12"],
    districtMulti: 0.15
  },
  {
    id: "spe3-12",
    max: 10,
    name: "Improved Search 2",
    description: "Increase districts gain.",
    type: TECHNOLOGIES.Search,
    researchToUnlock: ["spe3-13"],
    districtMulti: 0.2
  },
  {
    id: "spe3-13",
    max: 10,
    name: "Improved Search 3",
    description: "Increase districts gain.",
    type: TECHNOLOGIES.Search,
    districtMulti: 0.25
  },
  {
    id: "spe3-2",
    max: 1,
    name: "Search infrastructure",
    description: "Improve searching infrastructures.",
    type: TECHNOLOGIES.Search,
    researchToUnlock: ["spe3-22"],
    buildingPoints: [
      { buildingId: BUILD_IDS.Observatory, quantity: 6 },
      { buildingId: BUILD_IDS.Laboratory, quantity: 2 }
    ]
  },
  {
    id: "spe3-22",
    max: 10,
    name: "Search efficiency",
    description: "Improve searching.",
    type: TECHNOLOGIES.Search,
    researchToUnlock: ["spe3-23"],
    effMulti: [{ unitId: IDS.Searcher, multi: 0.3 }]
  },
  {
    id: "spe3-23",
    max: 10,
    name: "Science efficiency",
    description: "Improve scientists.",
    type: TECHNOLOGIES.Search,
    effMulti: [{ unitId: IDS.Scientist, multi: 0.3 }]
  },
  {
    id: "spe3-3",
    max: 1,
    name: "Propulsion - Velocity",
    description: "Improve ship speed.",
    type: TECHNOLOGIES.Propulsion,
    researchToUnlock: ["spe3-32"],
    speedMulti: 0.2
  },
  {
    id: "spe3-32",
    max: 10,
    name: "Propulsion - Acceleration",
    description: "Improve ships acceleration.",
    type: TECHNOLOGIES.Propulsion,
    researchToUnlock: ["spe3-33"],
    accelerationMulti: 0.2
  },
  {
    id: "spe3-33",
    max: 10,
    name: "improved Propulsion",
    description: "Improve ships speed and acceleration.",
    type: TECHNOLOGIES.Propulsion,
    speedMulti: 0.15,
    accelerationMulti: 0.15
  }
  //#endregion
];
