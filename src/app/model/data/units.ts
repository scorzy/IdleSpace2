import { IUnitData } from "./iUnitData";

export const UNITS: IUnitData[] = [
  //#region Materials
  {
    id: "F",
    name: "Food",
    description: "Food is used to sustain your biogical units"
  },
  {
    id: "E",
    name: "Energy",
    description: ""
  },
  {
    id: "M",
    name: "Metal",
    description: ""
  },
  {
    id: "A",
    name: "Alloy",
    description: ""
  },
  {
    id: "S",
    name: "Science",
    description: ""
  },
  //#endregion
  //#region Workers
  {
    id: "f",
    name: "Farmer",
    description: "",
    production: [["F", 4], ["E", -1]]
  },
  {
    id: "e",
    name: "Technician",
    description: "",
    production: [["E", 4]]
  },
  {
    id: "m",
    name: "Miner",
    description: "",
    production: [["M", 4], ["E", -1]]
  },
  {
    id: "a",
    name: "Metallurgist",
    description: "",
    production: [["A", 1], ["m", -5], ["E", -2]]
  },
  {
    id: "s",
    name: "Scientist",
    description: "",
    production: [["S", 1], ["m", -5], ["E", -2]]
  }
  //#endregion
];
