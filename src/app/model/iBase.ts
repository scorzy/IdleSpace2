export interface ISimpleBase {
  id: string;
  name: string;
  namePlural?: string;
  description?: string;
  icon?: string;
  colorClass?: string;
  typeIcon?: string;
}
export interface IBase extends ISimpleBase {
  quantity: Decimal;
}
