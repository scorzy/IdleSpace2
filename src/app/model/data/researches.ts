import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";
const INITIATIVE_MULTI = 0.3;
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
    researchToUnlock: ["c", "E", "p1"],
    technologiesToUnlock: ["p"]
  },
  {
    id: "c",
    name: "Computing",
    description: "Unlock Computing Technology",
    max: 1,
    type: [TECHNOLOGIES.Computing],
    technologiesToUnlock: ["c"],
    researchToUnlock: ["c1"]
  },
  {
    id: "n",
    name: "Naval Logistics",
    description: "Unlock Naval Capacity Technology",
    max: 1,
    type: [TECHNOLOGIES.Naval],
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
    researchToUnlock: ["r0"]
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
    technologiesToUnlock: [TECHNOLOGIES.Robotics.id],
    researchToUnlock: ["x1"],
    prodMulti: [
      { unitId: "m", multi: 0.3 },
      { unitId: "e", multi: 0.1 },
      { unitId: "s", multi: 0.3 },
      { unitId: "a", multi: 0.3 },
      { unitId: "w", multi: 0.3 },
      { unitId: "r", multi: 0.3 },
      { unitId: "X", multi: 0.3 },
      { unitId: "B", multi: 0.3 }
    ]
  },
  {
    id: "x1",
    name: "Improved drones",
    description: "Drone yields and consume more",
    max: 10,
    type: [TECHNOLOGIES.Robotics],
    prodMulti: [
      { unitId: "m", multi: 0.1 },
      { unitId: "e", multi: 0.04 },
      { unitId: "s", multi: 0.1 },
      { unitId: "a", multi: 0.1 },
      { unitId: "w", multi: 0.1 },
      { unitId: "r", multi: 0.1 },
      { unitId: "X", multi: 0.1 },
      { unitId: "B", multi: 0.1 }
    ]
  },
  {
    id: "M",
    name: "Materials",
    description: "Unlock Materials Technology",
    max: 1,
    type: [TECHNOLOGIES.Materials],
    technologiesToUnlock: ["m"],
    researchToUnlock: ["x", "N"]
  },
  {
    id: "N",
    name: "Mining",
    description: "Unlock Mining Technology",
    max: 1,
    type: [TECHNOLOGIES.Mining],
    technologiesToUnlock: [TECHNOLOGIES.Mining.id],
    prodMulti: [{ unitId: "m", multi: 0.5 }]
  },
  {
    id: "E",
    name: "Energy",
    description: "Unlock Energy Technology",
    max: 1,
    type: [TECHNOLOGIES.Energy],
    technologiesToUnlock: [TECHNOLOGIES.Energy.id],
    limitMulti: [{ unitId: "E", multi: 1 }]
  },
  {
    id: "r0",
    name: "Searching initiative",
    description: "Improve searching",
    type: [TECHNOLOGIES.Search],
    researchToUnlock: ["r1"],
    prodMulti: [{ unitId: "r", multi: INITIATIVE_MULTI }]
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
  },
  {
    id: "c1",
    name: "Algorithms",
    description: "Improve research",
    type: [TECHNOLOGIES.Computing],
    effMulti: [{ unitId: "s", multi: 0.1 }],
    researchToUnlock: ["c2"]
  },
  {
    id: "c2",
    name: "Super computing",
    description: "Unlock super computing center",
    type: [TECHNOLOGIES.Computing],
    effMulti: [{ unitId: "s", multi: 0.1 }],
    max: 1,
    unitsToUnlock: ["12"]
  },
  {
    id: "p1",
    name: "Research initiative",
    description: "Researchers yields and consume more",
    type: [TECHNOLOGIES.Physics],
    prodMulti: [{ unitId: "s", multi: INITIATIVE_MULTI }]
  }
];
