import { IUnitData } from "./iUnitData";
import { TECHNOLOGIES } from "./technologyData";
import {
  MOD_PER_ROBOTICS,
  MOD_PER_OTHERS,
  ENERGY_STORAGE,
  NUKE_STORAGE,
  COMPONENT_STORAGE,
  METAL_BUILDING_PRICE,
  ALLOY_BUILDING_PRICE,
  BUILDING_LIMIT
} from "../CONSTANTS";
import { RD, PROD_DEP, STORAGE_DEP, MAINTENANCE_DEP } from "./departments";
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
    startQuantity: 10,
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
        buildingLimitQuantity: ENERGY_STORAGE
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
    unitType: UNIT_TYPES.MATERIAL,
    battleMulti: 0.5
  },
  {
    id: "S",
    name: "Science",
    icon: "fa-s:flask", // "my:fizzing-flask",
    description: "",
    colorClass: "science-color",
    unitType: UNIT_TYPES.MATERIAL,
    battleMulti: 0.5
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
    unitType: UNIT_TYPES.MATERIAL,
    battleMulti: 0.6
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
        buildingLimitQuantity: COMPONENT_STORAGE
      }
    ],
    showUiLimit: true,
    unitType: UNIT_TYPES.MATERIAL,
    battleMulti: 0.2
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
        buildingLimitQuantity: NUKE_STORAGE
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
    description: "Miners yield metal and consume energy.",
    startQuantity: 1,
    production: [
      ["M", 1],
      ["E", -1]
    ],
    prices: [["M", 10]],
    limits: [
      {
        buildingLimit: "1",
        buildingLimitQuantity: BUILDING_LIMIT
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
    description: "Technicians yield energy.",
    startQuantity: 1,
    production: [["E", 2]],
    prices: [["M", 15]],
    limits: [
      {
        buildingLimit: "2",
        buildingLimitQuantity: BUILDING_LIMIT
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
    description: "Scientists yield science.",
    production: [
      ["S", 1],
      ["M", -1.5],
      ["E", -1]
    ],
    prices: [["M", 20]],
    limits: [
      {
        buildingLimit: "3",
        buildingLimitQuantity: BUILDING_LIMIT
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
    description: "Metallurgists turn metal into alloy.",
    production: [
      ["A", 1],
      ["M", -2],
      ["E", -1]
    ],
    prices: [["M", 20]],
    limits: [
      {
        buildingLimit: "4",
        buildingLimitQuantity: BUILDING_LIMIT
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
    description: "Workers build ships and space stations with alloy.",
    production: [
      ["W", 1],
      ["A", -2],
      ["E", -2]
    ],
    prices: [
      ["M", 30],
      ["A", 10]
    ],
    limits: [
      {
        buildingLimit: "5",
        buildingLimitQuantity: BUILDING_LIMIT
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      {
        technologyId: TECHNOLOGIES.MilitaryEngineering.id,
        multi: MOD_PER_OTHERS / 2.5
      },
      {
        technologyId: TECHNOLOGIES.CivilEngineering.id,
        multi: MOD_PER_OTHERS / 2.5
      }
    ]
  },
  {
    id: "r",
    name: "Searcher",
    icon: "my:radar-sweep",
    description: "Searchers look for new enemies.",
    colorClass: "search-color",
    production: [
      ["R", 1],
      ["S", -2],
      ["E", -1]
    ],
    prices: [
      ["M", 20],
      ["A", 10]
    ],
    limits: [
      {
        buildingLimit: "6",
        buildingLimitQuantity: BUILDING_LIMIT
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
    description: "Replicators turn alloy into droid components.",
    colorClass: "component-color",
    production: [
      ["x", 0.05],
      ["A", -3],
      ["E", -1]
    ],
    prices: [
      ["M", 50],
      ["A", 20]
    ],
    limits: [
      {
        buildingLimit: "7",
        buildingLimitQuantity: BUILDING_LIMIT
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
    description: "Nuke Specialists make nuke with alloy.",
    colorClass: "nuke-color",
    production: [
      ["b", 0.05],
      ["A", -4],
      ["E", -2]
    ],
    prices: [
      ["M", 30],
      ["A", 15]
    ],
    limits: [
      {
        buildingLimit: "10",
        buildingLimitQuantity: BUILDING_LIMIT
      }
    ],
    unitType: UNIT_TYPES.WORKER,
    mods: [
      { technologyId: TECHNOLOGIES.Robotics.id, multi: MOD_PER_ROBOTICS },
      { technologyId: TECHNOLOGIES.Naval.id, multi: MOD_PER_OTHERS / 2.5 },
      { technologyId: TECHNOLOGIES.Propulsion.id, multi: MOD_PER_OTHERS / 2.5 }
    ]
  },
  //#endregion
  //#region Districts
  {
    id: "j",
    name: "Habitable Space",
    description: "",
    startQuantity: 50,
    icon: "fa-s:globe",
    colorClass: "habSpace-color",
    unitType: UNIT_TYPES.DISTRICT
  },
  {
    id: "P",
    name: "Mining District",
    description: "",
    startQuantity: 50,
    icon: "my:mining",
    colorClass: "metal-color",
    unitType: UNIT_TYPES.DISTRICT
  },
  {
    id: "k",
    name: "Energy District",
    description: "",
    startQuantity: 50,
    icon: "my:solar-power",
    colorClass: "energy-color",
    unitType: UNIT_TYPES.DISTRICT
  },
  //#endregion
  //#region Buildings
  {
    id: "1",
    name: "Mine",
    description: "Mines allow you to build more miners.",
    icon: "my:gold-mine",
    colorClass: "metal-color",
    startQuantity: 1,
    prices: [
      ["M", METAL_BUILDING_PRICE / 2],
      ["P", 10]
    ],
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, MAINTENANCE_DEP]
  },
  {
    id: "2",
    name: "Power Plant",
    icon: "my:solar-power_2",
    description: "Power Plant allow you to build more technicians.",
    colorClass: "energy-color",
    startQuantity: 1,
    prices: [
      ["M", METAL_BUILDING_PRICE * 0.75],
      ["k", 10]
    ],
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, STORAGE_DEP, MAINTENANCE_DEP]
  },
  {
    id: "8",
    name: "Batteries",
    description: "Batteries increases energy capacity.",
    colorClass: "energy-color",
    icon: "my:battery-pack",
    startQuantity: 1,
    prices: [
      ["M", METAL_BUILDING_PRICE],
      ["j", 10]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "3",
    name: "Laboratory",
    icon: "fa-s:microscope",
    colorClass: "science-color",
    description: "laboratories allow you to build more scientists.",
    prices: [
      ["M", METAL_BUILDING_PRICE * 2],
      ["j", 10]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, MAINTENANCE_DEP]
  },
  {
    id: "4",
    name: "Foundry",
    description: "Foundry allows you to build more metallurgists.",
    icon: "my:foundry-bucket",
    colorClass: "alloy-color",
    prices: [
      ["M", METAL_BUILDING_PRICE * 3],
      ["j", 10]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, MAINTENANCE_DEP]
  },
  {
    id: "5",
    name: "Factory",
    description: "Factories allow you to build more workers.",
    icon: "my:factory",
    colorClass: "production-color",
    prices: [
      ["M", METAL_BUILDING_PRICE * 2],
      ["j", 10]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, MAINTENANCE_DEP]
  },
  {
    id: "6",
    name: "Observatory",
    description: "Observatories allow you to build more searchers.",
    icon: "my:observatory",
    colorClass: "search-color",
    prices: [
      ["M", METAL_BUILDING_PRICE * 2],
      ["j", 10]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, MAINTENANCE_DEP]
  },
  {
    id: "7",
    name: "Drone Factory",
    description: "Drone Factories allow you to build more replicators.",
    icon: "my:factory-arm",
    colorClass: "component-color",
    prices: [
      ["A", ALLOY_BUILDING_PRICE * 5],
      ["j", 20]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, STORAGE_DEP, MAINTENANCE_DEP]
  },
  {
    id: "9",
    name: "Drone Depot",
    description: "Drone Depots increase components storage.",
    icon: "fa-s:warehouse",
    colorClass: "component-color",
    prices: [
      ["A", ALLOY_BUILDING_PRICE],
      ["j", 10]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "10",
    name: "Nuke Factory",
    description: "Nuke Factory allow you to buy more nuke specialists",
    icon: "my:factory",
    colorClass: "nuke-color",
    prices: [
      ["A", ALLOY_BUILDING_PRICE * 2],
      ["j", 20]
    ],
    unlockQuantity: 1,
    unitType: UNIT_TYPES.BUILDING,
    departments: [RD, PROD_DEP, STORAGE_DEP, MAINTENANCE_DEP]
  },
  {
    id: "11",
    name: "Nuke Silos",
    description: "Nuke Silos increases nuke storage.",
    icon: "fa-s:warehouse",
    colorClass: "nuke-color",
    prices: [
      ["A", ALLOY_BUILDING_PRICE],
      ["j", 10]
    ],
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
  },
  {
    id: "i7",
    name: "Ring World",
    description: "",
    unitType: UNIT_TYPES.SPACE_STATION
  },
  ,
  //#endregion
  //#region MegaStructure
  {
    id: "m0",
    name: "Dyson Sphere",
    description: "",
    unitType: UNIT_TYPES.MEGASTRUCTURE
  },
  {
    id: "m1",
    name: "Mega Laboratory",
    description: "",
    unitType: UNIT_TYPES.MEGASTRUCTURE
  },
  {
    id: "m2",
    name: "Mega Foundry",
    description: "",
    unitType: UNIT_TYPES.MEGASTRUCTURE
  },
  {
    id: "m3",
    name: "Mega Shipyard",
    description: "",
    unitType: UNIT_TYPES.MEGASTRUCTURE
  }
  //#endregion
];
