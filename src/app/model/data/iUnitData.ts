export interface IUnitData {
  id: string;
  name: string;
  description: string;
  startQuantity?: DecimalSource;

  /**
   * Production [Unit id, quantity /s]
   */
  production?: [string, DecimalSource][];

  /**
   * Price [Unit id, quantity]
   */
  prices?: [string, DecimalSource][];
}
