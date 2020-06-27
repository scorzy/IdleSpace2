import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";
import { UNITS, UNIT_TYPES } from "./units";
import {
  OPTIMIZED_SHIP_PREFIX,
  ORIGIN_1_TECH_MULTI,
  ORIGIN_1_TECH_2_MULTI
} from "../CONSTANTS";
import { ExclusiveResGroups } from "../researches/exclusiveResGroups";

const megastructures = UNITS.filter(
  (u) => u.unitType === UNIT_TYPES.MEGASTRUCTURE
).map((u) => u.id);
export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    unitsToUnlock: ["A", "a", "w", "W", "4", "5"],
    researchToUnlock: ["h", "p", "M", "s1", "n", OPTIMIZED_SHIP_PREFIX + 1],
    max: 1,
    priceMulti: 20,
    type: TECHNOLOGIES.MilitaryEngineering,
    technologiesToUnlock: ["e", TECHNOLOGIES.CivilEngineering.id]
  },
  {
    id: "p",
    name: "Physics",
    description: "Unlock Physics Technology",
    max: 1,
    type: TECHNOLOGIES.Physics,
    researchToUnlock: ["c", "E", "p0", "or1"],
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
    navalCapacity: 20
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
    inspirationBuildingId: "4",
    prodMulti: [
      { unitId: "m", multi: 0.3 },
      { unitId: "e", multi: 0.1 }
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
    researchToUnlock: ["N1"],
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
    effMulti: [{ unitId: "e", multi: 0.05 }],
    modulesToUnlock: ["R"],
    researchToUnlock: ["E1"],
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
  {
    id: "hz1",
    name: "Habitable zone",
    description: "",
    type: TECHNOLOGIES.Search,
    unlockFrom: "h",
    districtMulti: 0.2
  },
  {
    id: "hz2",
    name: "Optimistic zone",
    description: "",
    type: TECHNOLOGIES.Search,
    unlockFrom: "h1",
    districtMulti: 0.25
  },
  //#region Origin Science
  {
    id: "or1",
    name: "ScientistBot",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Physics,
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
    researchToUnlock: ["or11"],
    prodMulti: [{ unitId: "s", multi: 0.2 }],
    spellToUnlock: "2",
    technologyBonus: [
      { techId: TECHNOLOGIES.Physics.id, multi: ORIGIN_1_TECH_MULTI },
      { techId: TECHNOLOGIES.Search.id, multi: ORIGIN_1_TECH_2_MULTI }
    ]
  },
  {
    id: "or11",
    name: "Research Lab",
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
    effMulti: [{ unitId: "s", multi: 0.01, secondUnitId: "i1" }]
  },
  //#endregion
  {
    id: "or2",
    name: "WarBot",
    max: 1,
    description: "",
    type: TECHNOLOGIES.Naval,
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
    technologyBonus: [
      { techId: TECHNOLOGIES.Naval.id, multi: ORIGIN_1_TECH_MULTI }
    ]
  },
  //#origin Builders
  {
    id: "or3",
    name: "BuilderBot",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    exclusiveGroup: ExclusiveResGroups.FIRST_ORIGIN,
    prodMulti: [{ unitId: "w", multi: 0.2 }],
    technologyBonus: [
      { techId: TECHNOLOGIES.CivilEngineering.id, multi: ORIGIN_1_TECH_MULTI },
      { techId: TECHNOLOGIES.Materials.id, multi: ORIGIN_1_TECH_2_MULTI }
    ],
    researchToUnlock: ["or31"]
  },
  {
    id: "or31",
    name: "Reactive Armour",
    max: 1,
    description: "",
    type: TECHNOLOGIES.CivilEngineering,
    modulesToUnlock: ["V"],
    researchToUnlock: ["or32"]
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
  }
  //#endRegion
];
