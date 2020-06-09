import { IModData } from "./iModData";
import {
  MOD_EFFICIENCY_MULTI,
  MOD_PROD_MULTI,
  MOD_ENERGY_MULTI,
  MOD_COMPONENTS,
  MOD_RECYCLING
} from "../CONSTANTS";

export const EFFICIENCY_MOD: IModData = {
  name: "Wasteful / Efficient",
  description:
    "Increase consumption or production by " + MOD_EFFICIENCY_MULTI * 100 + "%"
};
export const PRODUCTION_MOD: IModData = {
  name: "Unproductive / Productive",
  description:
    "Increase resources yielded and consumed by " + MOD_PROD_MULTI * 100 + "%",
  min: -5
};
export const ENERGY_MOD: IModData = {
  name: "Energy: intensive / saving",
  description:
    "Increase or decrease energy consumption by " +
    MOD_ENERGY_MULTI * -100 +
    "%",
  max: 10
};
export const COMPONENTS_MOD: IModData = {
  name: "Expensive / Economic",
  description: "Increase or decrease components needed by " + MOD_COMPONENTS,
  max: 5
};
export const DRONE_MOD: IModData = {
  name: "More Drones",
  description: "Increase maximum drones by 10%",
  min: 0
};
export const RECYCLABLE_MOD: IModData = {
  name: "Recyclable",
  description: "Increase components recovery by " + MOD_RECYCLING,
  min: 0
};
