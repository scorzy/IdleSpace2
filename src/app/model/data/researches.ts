import { IResearchData, RESEARCH_TYPES } from "./iResearchData";

export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    price: 100,
    unitsToUnlock: ["A", "a", "w", "W"],
    researchToUnlock: ["e"],
    max: 1,
    type: [RESEARCH_TYPES.Engineering]
  },
  {
    id: "e",
    name: "Engineering",
    description: "+100% Engineering research speed.",
    price: 1e3,
    max: 10,
    type: [RESEARCH_TYPES.Engineering],
    researchBonus: [{ type: RESEARCH_TYPES.Engineering, bonus: 1 }]
  }
];
