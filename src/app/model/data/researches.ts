import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";

export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    price: 100,
    unitsToUnlock: ["A", "a", "w", "W"],
    researchToUnlock: ["p", "s1", "n", "s", "x", "M"],
    max: 1,
    type: [TECHNOLOGIES.MilitaryEngineering],
    technologiesToUnlock: ["e", TECHNOLOGIES.CivilEngineering.id]
  },
  {
    id: "p",
    name: "Physics",
    description: "Unlock Physics Technology",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.Physics],
    researchToUnlock: ["c", "E"],
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
    type: [TECHNOLOGIES.Search],
    unitsToUnlock: ["r", "R"],
    technologiesToUnlock: ["r"]
  },
  {
    id: "x",
    name: "Replication",
    description: "Unlock Replicators",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.CivilEngineering],
    unitsToUnlock: ["x", "X", "7"]
  },
  {
    id: "M",
    name: "Materials",
    description: "Unlock Materials Technology",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.Materials],
    technologiesToUnlock: ["m"]
  },
  {
    id: "E",
    name: "Energy",
    description: "Unlock Energy Technology",
    price: 100,
    max: 1,
    type: [TECHNOLOGIES.Energy],
    technologiesToUnlock: [TECHNOLOGIES.Energy.id]
  }
];
