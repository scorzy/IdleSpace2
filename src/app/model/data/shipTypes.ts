export interface ShipTypeData {
  id: number;
  name: string;
  defenceName: string;
  maxModule?: number;
  maxPoints?: number;
  navalCapacity?: number;
}

export const SHIP_TYPES: ShipTypeData[] = [
  {
    id: 1,
    name: "Drone",
    defenceName: "Tiny Ground Defence"
  },
  {
    id: 2,
    name: "Scout",
    defenceName: "Small Ground Defence"
  },
  {
    id: 3,
    name: "Corvette",
    defenceName: "Ground Defence"
  },
  {
    id: 4,
    name: "Frigate",
    defenceName: "Large Ground Defence"
  },
  {
    id: 5,
    name: "Destroyer",
    defenceName: "XL Ground Defence"
  },
  {
    id: 6,
    name: "Cruiser",
    defenceName: "Fortress"
  },
  {
    id: 7,
    name: "Battlecruiser",
    defenceName: "Space Station"
  },
  {
    id: 8,
    name: "Battleship",
    defenceName: "Outpost"
  },
  {
    id: 9,
    name: "Dreadnought",
    defenceName: "Defensive Platform"
  },
  {
    id: 10,
    name: "Titan",
    defenceName: "Star Fortress"
  },
  {
    id: 11,
    name: "Colossus",
    defenceName: "Big Star Fortress"
  }
];
