export class ModuleData {
  id: string;
  name: string;
  armor?: DecimalSource;
  shield?: DecimalSource;
  energy?: DecimalSource;
  damage?: DecimalSource;
  armorDamagePercent?: number;
  shieldDamagePercent?: number;
  fire?: number;
  price?: DecimalSource;
}

export const modules: ModuleData[] = [
  { id: "1", name: "Armor", armor: 100, price: 100 },
  { id: "2", name: "Shield", shield: 100, energy: -1, price: 100 }
];
