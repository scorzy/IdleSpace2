export interface ShipType {
  id: string;
  name: string;
  maxModule: number;
  maxPoints: number;
}

export const shipTypes: ShipType[] = [
  {
    id: "c",
    name: "Corvette",
    maxModule: 3,
    maxPoints: 5
  }
];
