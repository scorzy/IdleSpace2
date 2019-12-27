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
    name: "Work",
    icon: "setting",
    description: "",
    color: "#EC8415"
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
    prices: [["M", 10]]
  },
  {
    id: "e",
    name: "Technician",
    description: "",
    startQuantity: 1,
    production: [["E", 4]],
    prices: [["M", 10]]
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
    prices: [["M", 10]]
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
    prices: [["M", 10]]
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
    ]
  }
  //#endregion
];
