import { IResearchData } from "./iResearchData";
import { TECHNOLOGIES } from "./technologyData";
const INITIATIVE_MULTI = 0.5;
const MEGA_BUILDING_LIMIT = 0.3;
const MEGA_BUILDING_STORAGE = 10;
const TIER_2_MULTI = 0.5;
export const RESEARCHES: IResearchData[] = [
  {
    id: "m",
    name: "Metallurgist",
    description: "Unlock Metallurgists",
    unitsToUnlock: ["A", "a", "w", "W", "4", "5"],
    researchToUnlock: ["p", "s1", "n", "s", "M", "P"],
    max: 1,
    type: TECHNOLOGIES.MilitaryEngineering,
    technologiesToUnlock: ["e", TECHNOLOGIES.CivilEngineering.id]
  },
  {
    id: "p",
    name: "Physics",
    description: "Unlock Physics Technology",
    max: 1,
    type: TECHNOLOGIES.Physics,
    researchToUnlock: ["c", "E", "p1", "p4"],
    technologiesToUnlock: ["p"],
    effMulti: [{ unitId: "s", multi: 0.5 }]
  },
  {
    id: "c",
    name: "Computing",
    description: "Unlock Computing Technology",
    max: 1,
    type: TECHNOLOGIES.Computing,
    technologiesToUnlock: ["c"],
    researchToUnlock: ["c1"]
  },
  {
    id: "n",
    name: "Naval Logistics",
    description: "Unlock Naval Capacity Technology",
    max: 1,
    type: TECHNOLOGIES.Naval,
    technologiesToUnlock: ["n"],
    researchToUnlock: ["n1"],
    navalCapacity: 20
  },
  {
    id: "s",
    name: "Searching",
    description: "Unlock Searchers",
    max: 1,
    type: TECHNOLOGIES.Search,
    unitsToUnlock: ["r", "R", "6"],
    technologiesToUnlock: ["r"],
    researchToUnlock: ["r0"]
  },
  {
    id: "P",
    name: "Propulsion",
    description: "Unlock Propulsion",
    max: 1,
    type: TECHNOLOGIES.Propulsion,
    technologiesToUnlock: [TECHNOLOGIES.Propulsion.id]
  },
  {
    id: "x",
    name: "Robotics",
    description: "Unlock Replicators",
    max: 1,
    type: TECHNOLOGIES.Robotics,
    unitsToUnlock: ["x", "X", "7", "9"],
    technologiesToUnlock: [TECHNOLOGIES.Robotics.id],
    researchToUnlock: ["x1", "x3"],
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
    description: "Drones yield and consume more",
    max: 10,
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["x2"],
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
    id: "x2",
    name: "Mega Drone Factory",
    description: "Unlock mega drone factory",
    max: 1,
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["x4"],
    effMulti: [{ unitId: "X", multi: 0.1 }],
    limitMulti: [
      { unitId: "X", multi: MEGA_BUILDING_LIMIT },
      { unitId: "x", multi: MEGA_BUILDING_STORAGE }
    ]
  },
  {
    id: "x4",
    name: "Mass Production",
    description: "Increase components production",
    max: 10,
    type: TECHNOLOGIES.Robotics,
    researchToUnlock: ["x5"],
    prodMulti: [{ unitId: "X", multi: 0.3 }]
  },
  {
    id: "x5",
    name: "Nanobot",
    description: "Improve drone production and recycling",
    max: 10,
    type: TECHNOLOGIES.CivilEngineering,
    recycling: 0.1,
    effMulti: [{ unitId: "X", multi: 0.05 }]
  },
  {
    id: "x3",
    name: "Interchangeable parts",
    description: "Increase recycling",
    max: 10,
    type: TECHNOLOGIES.Robotics,
    recycling: 1
  },
  {
    id: "M",
    name: "Materials",
    description: "Unlock Materials Technology",
    max: 1,
    type: TECHNOLOGIES.Materials,
    technologiesToUnlock: ["m"],
    researchToUnlock: ["x", "N", "g1", "su"]
  },
  {
    id: "su",
    name: "Superconductors",
    description: "Improve energy generation",
    max: 10,
    type: TECHNOLOGIES.Materials,
    effMulti: [{ unitId: "e", multi: 0.2 }],
    limitMulti: [{ unitId: "E", multi: 1 }]
  },
  {
    id: "N",
    name: "Mining",
    description: "Unlock Mining Technology",
    max: 1,
    type: TECHNOLOGIES.Mining,
    technologiesToUnlock: [TECHNOLOGIES.Mining.id],
    researchToUnlock: ["N1"],
    prodMulti: [{ unitId: "m", multi: 0.5 }]
  },
  {
    id: "N1",
    name: "Mining initiative",
    description: "Miners yield and consume more",
    max: 10,
    type: TECHNOLOGIES.Mining,
    researchToUnlock: ["N2"],
    prodMulti: [{ unitId: "m", multi: INITIATIVE_MULTI }]
  },
  {
    id: "N2",
    name: "Mega mine",
    description: "Unlock mega mine",
    max: 1,
    type: TECHNOLOGIES.Mining,
    effMulti: [{ unitId: "m", multi: 0.1 }],
    limitMulti: [{ unitId: "m", multi: MEGA_BUILDING_LIMIT }]
  },
  {
    id: "E",
    name: "Energy",
    description: "Unlock Energy Technology",
    max: 1,
    type: TECHNOLOGIES.Energy,
    technologiesToUnlock: [TECHNOLOGIES.Energy.id],
    researchToUnlock: ["E1"],
    limitMulti: [{ unitId: "E", multi: 1 }],
    effMulti: [{ unitId: "e", multi: 0.05 }],
    modulesToUnlock: ["R"]
  },
  {
    id: "E1",
    name: "Energy initiative",
    description: "Technicians consume and yield more",
    max: 10,
    type: TECHNOLOGIES.Energy,
    effMulti: [{ unitId: "e", multi: INITIATIVE_MULTI / 6 }],
    researchToUnlock: ["E2"]
  },
  {
    id: "E2",
    name: "Mega Power Plant",
    description: "Unlock mega power plant",
    max: 1,
    type: TECHNOLOGIES.Energy,
    effMulti: [{ unitId: "e", multi: 0.05 }],
    researchToUnlock: ["E3"],
    modulesToUnlock: ["I"],
    limitMulti: [
      { unitId: "e", multi: MEGA_BUILDING_LIMIT },
      { unitId: "E", multi: MEGA_BUILDING_STORAGE }
    ]
  },
  {
    id: "E3",
    name: "Experimental Fusion",
    description: "Improve science and energy generation",
    max: 10,
    type: TECHNOLOGIES.Energy,
    effMulti: [
      { unitId: "e", multi: 0.05 },
      { unitId: "s", multi: 0.1 }
    ],
    researchToUnlock: ["E4"]
  },
  {
    id: "E4",
    name: "Fusion reactor",
    description: "Unlock fusion reactor",
    max: 1,
    type: TECHNOLOGIES.Energy,
    effMulti: [{ unitId: "e", multi: 0.05 }],
    modulesToUnlock: ["F"]
  },
  {
    id: "r0",
    name: "Searching initiative",
    description: "Improve searching",
    type: TECHNOLOGIES.Search,
    researchToUnlock: ["r1"],
    prodMulti: [{ unitId: "r", multi: INITIATIVE_MULTI }]
  },
  {
    id: "r1",
    name: "Optimistic zone",
    description: "Search 1",
    type: TECHNOLOGIES.Search,
    researchToUnlock: ["r2", "r3", "r6"],
    battleMulti: [{ materialId: "j", multi: 0.5 }]
  },
  {
    id: "r2",
    name: "Conservative zone",
    description: "Search 2",
    type: TECHNOLOGIES.Search,
    battleMulti: [{ materialId: "j", multi: 1 }]
  },
  {
    id: "r3",
    name: "Astrogeology",
    description: "Astrogeology",
    type: TECHNOLOGIES.Search,
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
    type: TECHNOLOGIES.Search,
    battleMulti: [{ materialId: "P", multi: 1 }]
  },
  {
    id: "r5",
    name: "Renewable energy",
    description: "Renewable energy",
    type: TECHNOLOGIES.Search,
    battleMulti: [{ materialId: "k", multi: 1 }]
  },
  {
    id: "r6",
    name: "Mega observatory",
    description: "Unlock mega observatory",
    type: TECHNOLOGIES.Search,
    max: 1,
    effMulti: [{ unitId: "r", multi: 0.1 }],
    limitMulti: [{ unitId: "r", multi: MEGA_BUILDING_LIMIT }]
  },
  {
    id: "b",
    name: "Nuke",
    description: "Nuke",
    max: 1,
    type: TECHNOLOGIES.MilitaryEngineering,
    unitsToUnlock: ["b", "B", "10", "11"]
  },
  {
    id: "n1",
    name: "Scavenging",
    description: "Increase materials gain from battles",
    type: TECHNOLOGIES.Naval,
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
    type: TECHNOLOGIES.Computing,
    effMulti: [{ unitId: "s", multi: 0.1 }],
    researchToUnlock: ["c2"]
  },
  {
    id: "c2",
    name: "Super computing",
    description: "Unlock super computing center",
    type: TECHNOLOGIES.Computing,
    effMulti: [{ unitId: "s", multi: 0.1 }],
    max: 1,
    researchToUnlock: ["c3"]
  },
  {
    id: "c3",
    name: "Machine Learning",
    description: "Improve scientists",
    type: TECHNOLOGIES.Computing,
    prodMulti: [{ unitId: "s", multi: TIER_2_MULTI }],
    max: 10,
    researchToUnlock: ["c4"]
  },
  {
    id: "c4",
    name: "Quantum computing",
    description: "Unlock quantum computing center",
    type: TECHNOLOGIES.Computing,
    effMulti: [{ unitId: "s", multi: 0.1 }],
    max: 1,
    researchToUnlock: ["c5", "c6"]
  },
  {
    id: "c5",
    name: "Assisted AI research",
    description: "Improve researching",
    type: TECHNOLOGIES.Computing,
    effMulti: [{ unitId: "s", multi: 0.2 }],
    max: 10
  },
  {
    id: "c6",
    name: "Assisted AI combat",
    description: "Grants naval capacity",
    type: TECHNOLOGIES.Computing,
    effMulti: [{ unitId: "s", multi: 0.2 }],
    max: 10,
    navalCapacity: 200
  },
  {
    id: "p1",
    name: "Research initiative",
    description: "Researchers yield and consume more",
    type: TECHNOLOGIES.Physics,
    prodMulti: [{ unitId: "s", multi: INITIATIVE_MULTI }],
    researchToUnlock: ["p2"]
  },
  {
    id: "p2",
    name: "Quantum gravity",
    description: "Researchers yield more",
    type: TECHNOLOGIES.Physics,
    max: 1,
    researchToUnlock: ["p3"],
    effMulti: [{ unitId: "s", multi: 0.3 }]
  },
  {
    id: "p3",
    name: "Mega science lab",
    description: "Unlock mega science lab",
    type: TECHNOLOGIES.Physics,
    max: 1,
    effMulti: [{ unitId: "s", multi: 0.1 }],
    limitMulti: [{ unitId: "s", multi: MEGA_BUILDING_LIMIT }]
  },
  {
    id: "p4",
    name: "Force Fields",
    description: "Unlock shields",
    type: TECHNOLOGIES.Physics,
    max: 1,
    modulesToUnlock: ["s"]
  },
  {
    id: "g1",
    name: "Metallurgy",
    description: "Improve metallurgist and workers",
    type: TECHNOLOGIES.Materials,
    max: 10,
    researchToUnlock: ["g2"],
    prodMulti: [
      { unitId: "a", multi: INITIATIVE_MULTI / 2 },
      { unitId: "w", multi: INITIATIVE_MULTI / 2 }
    ]
  },
  {
    id: "g2",
    name: "Smart materials",
    description: "Improve metallurgist and workers",
    type: TECHNOLOGIES.Materials,
    max: 10,
    researchToUnlock: ["g3", "f1", "f2"],
    recycling: 0.1,
    effMulti: [
      { unitId: "a", multi: INITIATIVE_MULTI / 5 },
      { unitId: "w", multi: INITIATIVE_MULTI / 5 }
    ]
  },
  {
    id: "g3",
    name: "3D printing",
    description: "Improve workers",
    type: TECHNOLOGIES.CivilEngineering,
    max: 10,
    researchToUnlock: ["g4"],
    prodMulti: [{ unitId: "w", multi: INITIATIVE_MULTI }]
  },
  {
    id: "g4",
    name: "Nanorobotics",
    description: "Improve workers",
    type: TECHNOLOGIES.CivilEngineering,
    max: 10,
    effMulti: [{ unitId: "w", multi: INITIATIVE_MULTI / 2 }]
  },
  {
    id: "g4",
    name: "Nanorobotics",
    description: "Improve workers",
    type: TECHNOLOGIES.CivilEngineering,
    max: 10,
    effMulti: [{ unitId: "w", multi: INITIATIVE_MULTI / 2 }]
  },
  {
    id: "f1",
    name: "Mega Foundry",
    description: "Unlock Mega foundry",
    type: TECHNOLOGIES.CivilEngineering,
    max: 1,
    effMulti: [{ unitId: "a", multi: 0.1 }],
    limitMulti: [{ unitId: "a", multi: MEGA_BUILDING_LIMIT }]
  },
  {
    id: "f2",
    name: "Mega Factory",
    description: "Unlock Mega Factory",
    type: TECHNOLOGIES.CivilEngineering,
    max: 1,
    effMulti: [{ unitId: "w", multi: 0.1 }],
    limitMulti: [{ unitId: "w", multi: MEGA_BUILDING_LIMIT }]
  }
];
