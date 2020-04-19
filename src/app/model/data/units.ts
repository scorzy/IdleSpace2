import { IUnitData } from "./iUnitData";
import { Technology } from "../researches/technology";
import { TECHNOLOGIES } from "./technologyData";
import { MOD_PER_ROBOTICS, MOD_PER_OTHERS } from "../CONSTANTS";
export enum UNIT_TYPES {
  MATERIAL,
  WORKER,
  DISTRICT,
  BUILDING,
  SPACE_STATION,
  MEGASTRUCTURE
}
export const UNITS: IUnitData[] = [
  //#region Materials
  {
    id: "M",
    name: "Metal",
    icon: "my:asteroid",
    description: "",
    startQuantity: 100,
    colorClass: "metal-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "E",
    name: "Energy",
    icon: "my:electric",
    description: "",
    startQuantity: 100,
    colorClass: "energy-color",
    limits: [
      {
        buildingLimit: "8",
        buildingLimitQuantity: 1e4
      }
    ],
    showUiLimit: true,
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "A",
    name: "Alloy",
    icon: "my:metal-bar",
    description: "",
    colorClass: "alloy-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "S",
    name: "Science",
    icon: "fa-s:flask", // "my:fizzing-flask",
    description: "",
    colorClass: "science-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "W",
    name: "Production",
    icon: "fa-s:wrench",
    description: "",
    colorClass: "production-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "R",
    name: "Search",
    icon: "my:radar-sweep",
    description: "",
    colorClass: "search-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "x",
    name: "Components",
    icon: "fa-s:microchip",
    description: "",
    colorClass: "component-color",
    limits: [
      {
        buildingLimit: "9",
        buildingLimitQuantity: 1e3
      }
    ],
    showUiLimit: true,
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "b",
    name: "Nuke",
    icon: "my:rocket",
    description: "",
    colorClass: "nuke-color",
    limits: [
      {
        buildingLimit: "11",
        buildingLimitQuantity: 100
      }
    ],
    showUiLimit: true,
    unitType: UNIT_TYPES.MATERIAL
  },
  //#endregion
  //#region Workers
  {
    id: "m",
    name: "Miner",
    icon: "my:asteroid",
    colorClass: "metal-color",
    description: "",
    startQuantity: 1,
    production: [
      ["M", 4],
      ["E", -1]
    ],
    prices: [["M", 10]],
    limits: [
      {
        buildingLimit: "1",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Mining.id, multi: MOD_PER_OTHERS }
    ]
  },
  {
    id: "e",
    name: "Technician",
    icon: "my:electric",
    colorClass: "energy-color",
    description: "",
    startQuantity: 1,
    production: [["E", 4]],
    prices: [["M", 10]],
    limits: [
      {
        buildingLimit: "2",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Energy.id, multi: MOD_PER_OTHERS }
    ]
  },
  {
    id: "s",
    name: "Scientist",
    colorClass: "science-color",
    icon: "fa-s:flask",
    description: "",
    production: [
      ["S", 1],
      ["M", -5],
      ["E", -2]
    ],
    prices: [["M", 10]],
    limits: [
      {
        buildingLimit: "3",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Computing.id, multi: MOD_PER_OTHERS }
    ]
  },
  {
    id: "a",
    name: "Metallurgist",
    icon: "my:metal-bar",
    colorClass: "alloy-color",
    description: "",
    production: [
      ["A", 1],
      ["M", -5],
      ["E", -2]
    ],
    prices: [["M", 10]],
    limits: [
      {
        buildingLimit: "4",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Materials.id, multi: MOD_PER_OTHERS }
    ]
  },
  {
    id: "w",
    name: "Worker",
    icon: "fa-s:wrench",
    colorClass: "production-color",
    description: "",
    production: [
      ["W", 1],
      ["A", -5],
      ["E", -2]
    ],
    prices: [
      ["M", 10],
      ["A", 10]
    ],
    limits: [
      {
        buildingLimit: "5",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      {
        technologyId: TECHNOLOGIES.MilitaryEngineering.id,
        multi: MOD_PER_OTHERS / 2
      },
      {
        technologyId: TECHNOLOGIES.CivilEngineering.id,
        multi: MOD_PER_OTHERS / 2
      }
    ]
  },
  {
    id: "r",
    name: "Searcher",
    icon: "my:radar-sweep",
    description: "",
    colorClass: "search-color",
    production: [
      ["R", 1],
      ["S", -5],
      ["E", -2]
    ],
    prices: [
      ["M", 10],
      ["A", 10]
    ],
    limits: [
      {
        buildingLimit: "6",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Search.id, multi: MOD_PER_OTHERS }
    ]
  },
  {
    id: "X",
    name: "Replicator",
    icon: "fa-s:microchip",
    description: "",
    colorClass: "component-color",
    production: [
      ["x", 1],
      ["A", -5],
      ["E", -2]
    ],
    prices: [
      ["M", 10],
      ["A", 10]
    ],
    limits: [
      {
        buildingLimit: "7",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      {
        technologyId: TECHNOLOGIES.Robotics.id,
        multi: MOD_PER_ROBOTICS + MOD_PER_OTHERS + 0.1
      }
    ]
  },
  {
    id: "B",
    name: "Nuke Specialist",
    icon: "my:rocket",
    description: "",
    colorClass: "nuke-color",
    production: [
      ["b", 1],
      ["A", -5],
      ["E", -2]
    ],
    prices: [
      ["M", 10],
      ["A", 10]
    ],
    limits: [
      {
        buildingLimit: "7",
        buildingLimitQuantity: 10
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Naval.id, multi: MOD_PER_OTHERS / 2 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: MOD_PER_OTHERS / 2 }
    ]
  },
  //#endregion
  //#region Districts
  {
    id: "j",
    name: "Habitable Space",
    description: "",
    startQuantity: 10,
    icon: "fa-s:globe",
    colorClass: "habSpace-color",
    unitType: UNIT_TYPES.DISTRICT
  },
  {
    id: "P",
    name: "Mining District",
    description: "",
    startQuantity: 10,
    icon: "my:mining",
    colorClass: "metal-color",
    unitType: UNIT_TYPES.DISTRICT
  },
  {
    id: "k",
    name: "Energy District",
    description: "",
    startQuantity: 10,
    icon: "my:solar-power",
    colorClass: "energy-color",
    unitType: UNIT_TYPES.DISTRICT
  },
  //#endregion
  //#region Buildings
  {
    id: "1",
    name: "Mine",
    description: "",
    startQuantity: 1,
    prices: [["P", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "2",
    name: "Power Plant",
    description: "",
    startQuantity: 1,
    prices: [["k", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "3",
    name: "Laboratory",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "4",
    name: "Foundry",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "5",
    name: "Factory",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "6",
    name: "Telescope",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "7",
    name: "Drone Factory",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "8",
    name: "Batteries",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "9",
    name: "Drone Depot",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "10",
    name: "Nuke Factory",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "11",
    name: "Nuke Silos",
    description: "",
    prices: [["j", 10]],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  //#endregion
  //#region Space Stations
  {
    id: "i1",
    name: "Space Station",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  },
  {
    id: "i2",
    name: "Rotating Space Station",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  },
  {
    id: "i3",
    name: "Torus",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  },
  {
    id: "i4",
    name: "Colony",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  },
  {
    id: "i5",
    name: "Citadel",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  },
  {
    id: "i6",
    name: "Habitat",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  }
  //#endregion
];
