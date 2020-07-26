import { ISearchOption } from "./iSearchOption";
import {
  DISTRICT_MAX_OPT_END,
  DISTRICT_MIN_OPT_END,
  SCIENCE_DISTRICT_MULTI,
  COMPONENTS_DISTRICT_MULTI
} from "../CONSTANTS";

export const HABITABILITY_OPT: ISearchOption = {
  id: "h",
  name: "Habitability",
  tooltip: "Increase hab. space tiles.",
  bonusMinStart: 20,
  bonusMaxStart: 20,
  bonusMinEnd: DISTRICT_MIN_OPT_END,
  bonusMaxEnd: DISTRICT_MAX_OPT_END
};
export const METAL_OPT: ISearchOption = {
  id: "m",
  name: "Metal",
  tooltip: "Increase mining districts tiles.",
  bonusMinStart: 10,
  bonusMaxStart: 10,
  bonusMinEnd: DISTRICT_MIN_OPT_END,
  bonusMaxEnd: DISTRICT_MAX_OPT_END
};
export const ENERGY_OPT: ISearchOption = {
  id: "e",
  name: "Energy",
  tooltip: "Increase energy districts tiles.",
  bonusMinStart: 10,
  bonusMaxStart: 10,
  bonusMinEnd: DISTRICT_MIN_OPT_END,
  bonusMaxEnd: DISTRICT_MAX_OPT_END
};
export const DIFFICULTY_OPT: ISearchOption = {
  id: "k",
  name: "Kardashev Scale",
  min: 0,
  max: 100,
  bonusMinEnd: 1.5,
  bonusMaxEnd: 2
};
export const DISTANCE_OPT: ISearchOption = {
  id: "d",
  name: "Sprawl",
  tooltip: "Increase distance but decrease searching price.",
  min: 0,
  max: 100,
  bonusMinStart: 1,
  bonusMaxStart: 1.2,
  bonusMinEnd: 75,
  bonusMaxEnd: 100
};
export const SCIENCE_OPT: ISearchOption = {
  id: "s",
  name: "Science",
  tooltip: "Increase tiles with science.",
  bonusMinEnd: DISTRICT_MIN_OPT_END * SCIENCE_DISTRICT_MULTI,
  bonusMaxEnd: DISTRICT_MAX_OPT_END * SCIENCE_DISTRICT_MULTI
};
export const COMPONENT_OPT: ISearchOption = {
  id: "c",
  name: "Components",
  tooltip: "Increase tiles with components.",
  bonusMinEnd: DISTRICT_MIN_OPT_END * COMPONENTS_DISTRICT_MULTI,
  bonusMaxEnd: DISTRICT_MAX_OPT_END * COMPONENTS_DISTRICT_MULTI
};
