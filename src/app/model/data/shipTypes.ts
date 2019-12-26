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
    name: "Corvette",
    navalCapacity: 1
  },
  {
    id: 2,
    name: "Frigate"
  },
  {
    id: 3,
    name: "Destroyer"
  },
  {
    id: 4,
    name: "Cruiser"
  },
  {
    id: 5,
    name: "Battlecruiser"
  },
  {
    id: 6,
    name: "Battleship"
  },
  {
    id: 7,
    name: "Dreadnought"
  }
];
