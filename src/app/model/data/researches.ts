import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";

export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    unitsToUnlock: ["A", "a", "w", "W", "4", "5"],
    researchToUnlock: ["p", "s1", "n", "s", "M", "P"],
    max: 1,
    type: [TECHNOLOGIES.MilitaryEngineering],
    technologiesToUnlock: ["e", TECHNOLOGIES.CivilEngineering.id]
  },
  {
    id: "p",
    name: "Physics",
    description: "Unlock Physics Technology",
    max: 1,
    type: [TECHNOLOGIES.Physics],
    researchToUnlock: ["c", "E"],
    technologiesToUnlock: ["p"]
  },
  {
    id: "c",
    name: "Computing",
    description: "Unlock Computing Technology",
    max: 1,
    type: [TECHNOLOGIES.Computing],
    technologiesToUnlock: ["c"]
  },
  {
    id: "n",
    name: "Naval Logistics",
    description: "Unlock Naval Capacity Technology",
    max: 1,
    type: [TECHNOLOGIES.Computing],
    technologiesToUnlock: ["n"],
    researchToUnlock: ["n1"]
  },
  {
    id: "s",
    name: "Searching",
    description: "Unlock Searchers",
    max: 1,
    type: [TECHNOLOGIES.Search],
    unitsToUnlock: ["r", "R", "6"],
    technologiesToUnlock: ["r"],
    researchToUnlock: ["r1"]
  },
  {
    id: "P",
    name: "Propulsion",
    description: "Unlock Propulsion",
    max: 1,
    type: [TECHNOLOGIES.Propulsion],
    technologiesToUnlock: [TECHNOLOGIES.Propulsion.id]
  },
  {
    id: "x",
    name: "Robotics",
    description: "Unlock Replicators",
    max: 1,
    type: [TECHNOLOGIES.Robotics],
    unitsToUnlock: ["x", "X", "7"],
    technologiesToUnlock: [TECHNOLOGIES.Robotics.id]
  },
  {
    id: "M",
    name: "Materials",
    description: "Unlock Materials Technology",
    max: 1,
    type: [TECHNOLOGIES.Materials],
    technologiesToUnlock: ["m"],
    researchToUnlock: ["x"]
  },
  {
    id: "E",
    name: "Energy",
    description: "Unlock Energy Technology",
    max: 1,
    type: [TECHNOLOGIES.Energy],
    technologiesToUnlock: [TECHNOLOGIES.Energy.id]
  },
  {
    id: "r1",
    name: "Optimistic zone",
    description: "Search 1",
    type: [TECHNOLOGIES.Search],
    researchToUnlock: ["r2", "r3"],
    battleMulti: [{ materialId: "j", multi: 0.5 }]
  },
  {
    id: "r2",
    name: "Conservative zone",
    description: "Search 2",
    type: [TECHNOLOGIES.Search],
    battleMulti: [{ materialId: "j", multi: 1 }]
  },
  {
    id: "r3",
    name: "Astrogeology",
    description: "Astrogeology",
    type: [TECHNOLOGIES.Search],
    researchToUnlock: ["r4", "r5"],
    battleMulti: [
      { materialId: "P", multi: 0.5 },
      { materialId: "k", multi: 0.5 }
    ]
  },
  {
    id: "r4",
    name: "Asteroid Mining",
    description: "Asteroid Mining",
    type: [TECHNOLOGIES.Search],
    battleMulti: [{ materialId: "P", multi: 1 }]
  },
  {
    id: "r5",
    name: "Renewable energy",
    description: "Renewable energy",
    type: [TECHNOLOGIES.Search],
    battleMulti: [{ materialId: "k", multi: 1 }]
  },
  {
    id: "b",
    name: "Nuke",
    description: "Nuke",
    max: 1,
    type: [TECHNOLOGIES.MilitaryEngineering],
    unitsToUnlock: ["b", "B", "10", "11"]
  },
  {
    id: "n1",
    name: "Scavenging",
    description: "Increase materials gain from battles",
    type: [TECHNOLOGIES.Naval],
    researchToUnlock: ["b"],
    battleMulti: [
      { materialId: "M", multi: 1 },
      { materialId: "E", multi: 1 },
      { materialId: "A", multi: 1 },
      { materialId: "x", multi: 1 }
    ]
  }
];
