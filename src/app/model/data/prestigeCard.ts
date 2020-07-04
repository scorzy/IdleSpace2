import { ISimpleBase } from "../iBase";
import {
  PRODUCTION_CARD,
  EFFICIENCY_CARD,
  MORE_DRONES_CARD,
  RECYCLING_CARD,
  TECHNOLOGY_CARD,
  DISTRICTS_CARD,
  MATERIALS_CARD,
  COMPONENTS_CARD
} from "../CONSTANTS";

export const PRESTIGE_CARDS: ISimpleBase[] = [
  //#region Drones
  {
    id: "0",
    name: "Production",
    description: "Drones yields and consume " + PRODUCTION_CARD * 100 + "% more"
  },
  {
    id: "1",
    name: "Efficiency",
    description: "Drones yields " + EFFICIENCY_CARD * 100 + "% more"
  },
  {
    id: "2",
    name: "More Drones",
    description: "Increase Drones limit by " + MORE_DRONES_CARD * 100 + "%"
  },
  {
    id: "3",
    name: "Recycling",
    description: "Increase Drones recycling by " + RECYCLING_CARD * 100 + "%"
  },
  //#endregion
  //#region Science
  {
    id: "r0",
    name: "Technology",
    description: "Increase technology gain by " + TECHNOLOGY_CARD * 100 + "%"
  },
  //#endregion
  //#region War
  {
    id: "w0",
    name: "Districts",
    description:
      "Increase districts from enemies by " + DISTRICTS_CARD * 100 + "%"
  },
  {
    id: "w1",
    name: "Materials",
    description:
      "Increase material from enemies by " + MATERIALS_CARD * 100 + "%"
  },
  {
    id: "w2",
    name: "Components",
    description:
      "Increase components from enemies by " + COMPONENTS_CARD * 100 + "%"
  },
  //#endregion
  //#region Warp
  {
    id: "p0",
    name: "Double Warp",
    description: "Warp 100% more"
  },
  {
    id: "p1",
    name: "Science Warp",
    description:
      "Warps yield science equal to 'total science per sec' * 'warp time'"
  }
  //#endregion
];
