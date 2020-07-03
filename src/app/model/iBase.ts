export interface ISimpleBase {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  colorClass?: string;
}
export interface IBase extends ISimpleBase {
  quantity: Decimal;
}
