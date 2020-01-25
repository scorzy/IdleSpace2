import { IUnitData } from "./iUnitData";

export const UNITS: IUnitData[] = [
  //#region Materials
  {
    id: "M",
    name: "Metal",
    icon: "my:asteroid",
    description: "",
    startQuantity: 100,
    color: "#CF1322"
  },
  {
    id: "E",
    name: "Energy",
    icon: "my:electric",
    description: "",
    startQuantity: 100,
    color: "#FADB14"
  },
  {
    id: "A",
    name: "Alloy",
    icon: "my:metal-bar",
    description: "",
    color: "#531DAB"
  },
  {
    id: "S",
    name: "Science",
    icon: "my:fizzing-flask",
    description: "",
    color: "#08979C"
  },
  {
    id: "W",
    name: "Production",
    icon: "tool",
    description: "",
    color: "#EC8415"
  },
  {
    id: "R",
    name: "Search",
    icon: "my:radar-sweep",
    description: "",
    color: ""
  },
  {
    id: "x",
    name: "Components",
    icon: "my:microchip",
    description: "",
    color: ""
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
    buildingLimitQuantity: 10
  },
  {
    id: "e",
    name: "Technician",
    description: "",
    startQuantity: 1,
    production: [["E", 4]],
    prices: [["M", 10]],
    buildingLimit: "2",
    buildingLimitQuantity: 10
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
    buildingLimitQuantity: 10
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
    buildingLimitQuantity: 10
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
    buildingLimitQuantity: 10
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
    buildingLimitQuantity: 10
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
    buildingLimitQuantity: 10
  },
  //#endregion
  //#region Districts
  {
    id: "j",
    name: "Habitable Space",
    description: "",
    startQuantity: 10,
    icon: "global"
  },
  {
    id: "P",
    name: "Mining District",
    description: "",
    startQuantity: 10,
    icon: "my:mining"
  },
  {
    id: "k",
    name: "Energy District",
    description: "",
    startQuantity: 10,
    icon: "my:electric"
  },
  //#endregion
  //#region Buildings Information
  {
    id: "1",
    name: "Mine",
    description: "",
    startQuantity: 1,
    prices: [["P", 10]]
  },
  {
    id: "2",
    name: "Power Plant",
    description: "",
    startQuantity: 1,
    prices: [["k", 10]]
  },
  {
    id: "3",
    name: "Laboratory",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]]
  },
  {
    id: "4",
    name: "Foundry",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]]
  },
  {
    id: "5",
    name: "Factory",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]]
  },
  {
    id: "6",
    name: "Telescope",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]]
  },
  {
    id: "7",
    name: "Drone Factory",
    description: "",
    startQuantity: 1,
    prices: [["j", 10]]
  }
  //#endregion
];
