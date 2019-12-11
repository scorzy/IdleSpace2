import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";

export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    price: 100,
    unitsToUnlock: ["A", "a", "w", "W"],
    researchToUnlock: ["e"],
    max: 1,
    type: [TECHNOLOGIES.Engineering]
  }
];
