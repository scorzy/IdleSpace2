import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";
import { UNITS, UNIT_TYPES } from "./units";
import {
  OPTIMIZED_SHIP_PREFIX,
  ORIGIN_1_TECH_MULTI,
  ORIGIN_1_TECH_2_MULTI,
  REPEATABLE_RES_PRICE_MULTI,
  Ids,
  MatIds
} from "../CONSTANTS";
import { ExclusiveResGroups } from "../researches/exclusiveResGroups";

const megastructures = UNITS.filter(
  (u) => u.unitType === UNIT_TYPES.MEGASTRUCTURE
).map((u) => u.id);

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
    technologiesToUnlock: ["e", TECHNOLOGIES.CivilEngineering.id],
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
    technologiesToUnlock: ["m"],
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
    materialMulti: 1,
    battleMulti: [
      { materialId: "M", multi: 1 },
      { materialId: "E", multi: 1 }
    ],
    inspirationDescription: "Defeat an enemy"
  },
  {
    id: "me",
    name: "Mega Structures",
    description: "Unlock Megastructures",
    type: TECHNOLOGIES.CivilEngineering,
    unitsToUnlock: megastructures
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
  //#endregion
  //#region Energy
  {
    id: "E-0",
    name: "Energy optimization",
    description: "",
    type: TECHNOLOGIES.Energy,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    effMulti: [{ unitId: Ids.Technician, multi: 0.05 }]
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
  //#endregion
  //#region Mining
  {
    id: "N-0",
    name: "Space mining",
    description: "",
    type: TECHNOLOGIES.Mining,
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    prodMulti: [{ unitId: Ids.Miner, multi: 0.1 }]
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
  //#endregion
  //#region Robotic
  {
    id: "X-1",
    name: "Assembly patterns",
    description: "",
    type: TECHNOLOGIES.Robotics,
    unlockFrom: "x",
    priceMulti: REPEATABLE_RES_PRICE_MULTI,
    effMulti: [{ unitId: Ids.Replicator, multi: 0.05 }]
  },
  //#endregion
  //#region Origin Science
  {
    id: "or1",
    name: "Scientists origin",
    max: 1,
    description: "",
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
  //#endregion
  //#region Origin War
  {
    id: "or2",
    name: "War origin",
    max: 1,
    description: "",
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
    modulesToUnlock: ["W"],
    researchToUnlock: ["or22"],
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
      { buildingId: "5", quantity: 1 },
      { buildingId: "10", quantity: 1 }
    ],
    technologyBonus: [
      {
        techId: TECHNOLOGIES.MilitaryEngineering.id,
        multi: ORIGIN_1_TECH_MULTI * 0.25
      },
      { techId: TECHNOLOGIES.Naval.id, multi: ORIGIN_1_TECH_MULTI * 0.25 }
    ],
    limitMulti: [{ unitId: MatIds.Nuke, multi: 1 }]
  },
  {
    id: "or24",
    name: "Pillage",
    max: 10,
    description: "",
    type: TECHNOLOGIES.Naval,
    materialMulti: 1
  },
  {
    id: "or25",
    name: "Military Focus",
    max: 1,
    description: "",
    type: TECHNOLOGIES.MilitaryEngineering,
    limitMulti: [
      { unitId: Ids.NukeSpecialist, multi: 0.2 },
      { unitId: Ids.Worker, multi: 0.2 },
      { unitId: MatIds.Nuke, multi: 1 }
    ]
  },
  //#endregion
  //#region Origin Builders
  {
    id: "or3",
    name: "Builders origin",
    max: 1,
    description: "",
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
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
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
    max: 10,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    effMulti: [{ unitId: Ids.Technician, multi: 0.02, secondUnitId: "i1" }],
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
        unitId: Ids.Miner,
        multi: 0.4
      },
      {
        unitId: Ids.Technician,
        multi: 0.4
      }
    ]
  }
  //#endregion
];
