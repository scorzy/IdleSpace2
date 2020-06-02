import { Module } from "./module";
export interface IShipModule {
  module: Module;
  level: number;
  size: number;
  moduleId?: string;
  levelUi?: string;
  validateStatus?: string;
  errorTip?: string;
  warningTip?: string;
  uiModel?: [number, string];
}
