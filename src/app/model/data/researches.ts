import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";

export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    price: 100,
    unitsToUnlock: ["A", "a", "w", "W"],
    researchToUnlock: ["p", "s2", "c", "n", "s"],
    max: 1,
    type: [TECHNOLOGIES.Engineering],
    technologiesToUnlock: ["e"]
  },
  {
    id: "p",
    name: "Physics",
    description: "Unlock Physics Technology",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.Physics],
    researchToUnlock: ["c"],
    technologiesToUnlock: ["p"]
  },
  {
    id: "c",
    name: "Computing",
    description: "Unlock Computing Technology",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.Computing],
    technologiesToUnlock: ["c"]
  },
  {
    id: "n",
    name: "Naval Logistics",
    description: "Unlock Naval Capacity Technology",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.Computing],
    technologiesToUnlock: ["n"]
  },
  {
    id: "s",
    name: "Searching",
    description: "Unlock Searchers",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.SEARCH],
    unitsToUnlock: ["r", "R"],
    technologiesToUnlock: ["r"]
  }
];
