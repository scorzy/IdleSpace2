import { IUnitData } from "./iUnitData";
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
    buildingLimit: "8",
    buildingLimitQuantity: 1e4,
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
    icon: "my:fizzing-flask",
    description: "",
    colorClass: "science-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "W",
    name: "Production",
    icon: "tool",
    description: "",
    colorClass: "production-color",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "R",
    name: "Search",
    icon: "my:radar-sweep",
    description: "",
    colorClass: "",
    unitType: UNIT_TYPES.MATERIAL
  },
  {
    id: "x",
    name: "Components",
    icon: "my:microchip",
    description: "",
    colorClass: "",
    buildingLimit: "9",
    buildingLimitQuantity: 1e3,
    showUiLimit: true,
    unitType: UNIT_TYPES.MATERIAL
  },
  //#endregion
  //#region Workers
  {
    id: "m",
    name: "Miner",
    description: "",
    startQuantity: 1,
    production: [
      ["M", 4],
      ["E", -1]
    ],
    prices: [["M", 10]],
    buildingLimit: "1",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  {
    id: "e",
    name: "Technician",
    description: "",
    startQuantity: 1,
    production: [["E", 4]],
    prices: [["M", 10]],
    buildingLimit: "2",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  {
    id: "s",
    name: "Scientist",
    description: "",
    production: [
      ["S", 1],
      ["M", -5],
      ["E", -2]
    ],
    prices: [["M", 10]],
    buildingLimit: "3",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  {
    id: "a",
    name: "Metallurgist",
    description: "",
    production: [
      ["A", 1],
      ["M", -5],
      ["E", -2]
    ],
    prices: [["M", 10]],
    buildingLimit: "4",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  {
    id: "w",
    name: "Worker",
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
    buildingLimit: "5",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  {
    id: "r",
    name: "Searcher",
    description: "",
    production: [
      ["R", 1],
      ["S", -5],
      ["E", -2]
    ],
    prices: [
      ["M", 10],
      ["A", 10]
    ],
    buildingLimit: "6",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  {
    id: "X",
    name: "Replicator",
    description: "",
    production: [
      ["x", 1],
      ["A", -5],
      ["E", -2]
    ],
    prices: [
      ["M", 10],
      ["A", 10]
    ],
    buildingLimit: "7",
    buildingLimitQuantity: 10,
    unitType: UNIT_TYPES.WORKER
  },
  //#endregion
  //#region Districts
  {
    id: "j",
    name: "Habitable Space",
    description: "",
    startQuantity: 10,
    icon: "global",
    unitType: UNIT_TYPES.DISTRICT
  },
  {
    id: "P",
    name: "Mining District",
    description: "",
    startQuantity: 10,
    icon: "my:mining",
    unitType: UNIT_TYPES.DISTRICT
  },
  {
    id: "k",
    name: "Energy District",
    description: "",
    startQuantity: 10,
    icon: "my:electric",
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
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "4",
    name: "Foundry",
    description: "",
    prices: [["j", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "5",
    name: "Factory",
    description: "",
    prices: [["j", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "6",
    name: "Telescope",
    description: "",
    prices: [["j", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "7",
    name: "Drone Factory",
    description: "",
    prices: [["j", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "8",
    name: "Batteries",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]],
    unitType: UNIT_TYPES.BUILDING
  },
  {
    id: "9",
    name: "Drone Depot",
    description: "",
    prices: [["j", 10]],
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
