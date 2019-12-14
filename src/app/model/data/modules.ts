export class ModuleData {
  id: string;
  name: string;
  armour?: DecimalSource;
  shield?: DecimalSource;
  energy?: DecimalSource;
  damage?: DecimalSource;
  armourDamagePercent?: number;
  shieldDamagePercent?: number;
  fire?: number;
  price?: DecimalSource;
}

export const modules: ModuleData[] = [
  { id: "1", name: "armour", armour: 100, price: 100 },
  { id: "2", name: "Shield", shield: 100, energy: -1, price: 100 }
];
