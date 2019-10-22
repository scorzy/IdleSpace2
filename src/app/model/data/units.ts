import { IUnitData } from "./iUnitData";

export const UNITS: IUnitData[] = [
  //#region Materials
  {
    id: "F",
    name: "Food",
    icon: "my:shiny-apple",
    description: "Food is used to sustain your biogical units",
    startQuantity: 100
  },
  {
    id: "E",
    name: "Energy",
    icon: "my:electric",
    description: "",
    startQuantity: 100
  },
  {
    id: "M",
    name: "Metal",
    icon: "my:asteroid",
    description: "",
    startQuantity: 100
  },
  {
    id: "A",
    name: "Alloy",
    icon: "my:metal-bar",
    description: ""
  },
  {
    id: "S",
    name: "Science",
    icon: "my:fizzing-flask",
    description: ""
  },
  //#endregion
  //#region Workers
  {
    id: "f",
    name: "Farmer",
    description: "",
    startQuantity: 1,
    production: [["F", 4], ["E", -1]],
    prices: [["F", 10]]
  },
  {
    id: "e",
    name: "Technician",
    description: "",
    startQuantity: 1,
    production: [["E", 4]],
    prices: [["F", 10]]
  },
  {
    id: "m",
    name: "Miner",
    description: "",
    startQuantity: 1,
    production: [["M", 4], ["E", -1]],
    prices: [["F", 10]]
  },
  {
    id: "a",
    name: "Metallurgist",
    description: "",
    production: [["A", 1], ["m", -5], ["E", -2]],
    prices: [["F", 10]]
  },
  {
    id: "s",
    name: "Scientist",
    description: "",
    production: [["S", 1], ["m", -5], ["E", -2]],
    prices: [["F", 10]]
  }
  //#endregion
];
