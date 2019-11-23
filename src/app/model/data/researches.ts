import { IResearchData, RESEARCH_TYPES } from "./iResearchData";

export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "",
    price: 100,
    unitsToUnlock: ["A", "a"],
    researchToUnlock: ["e"],
    max: 1,
    type: [RESEARCH_TYPES.Engineering]
  },
  {
    id: "e",
    name: "Engineering",
    description: "",
    price: 1e3,
    max: 10,
    type: [RESEARCH_TYPES.Engineering],
    researchBonus: [{ type: RESEARCH_TYPES.Engineering, bonus: 10 }]
  }
];
