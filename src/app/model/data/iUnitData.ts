export interface IUnitData {
  id: string;
  name: string;
  description: string;

  /**
   * Production [Unit id, quantity /s]
   */
  production?: [string, DecimalSource][];
}
