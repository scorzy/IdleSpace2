export interface ShipTypeData {
  id: number;
  name: string;
  maxModule?: number;
  maxPoints?: number;
  navalCapacity?: number;
}

export const SHIP_TYPES: ShipTypeData[] = [
  {
    id: 1,
    name: "Drone"
  },
  {
    id: 2,
    name: "Scout"
  },
  {
    id: 3,
    name: "Corvette"
  },
  {
    id: 4,
    name: "Frigate"
  },
  {
    id: 5,
    name: "Destroyer"
  },
  {
    id: 6,
    name: "Cruiser"
  },
  {
    id: 7,
    name: "Battlecruiser"
  },
  {
    id: 8,
    name: "Battleship"
  },
  {
    id: 9,
    name: "Dreadnought"
  },
  {
    id: 10,
    name: "Titan"
  },
  {
    id: 11,
    name: "Colossus"
  }
];
