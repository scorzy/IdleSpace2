import { Sizes } from "./sizes";

export interface IShipData {
  typeId: number;
  modules: Array<{ moduleID: string | string[]; size: number }>;
}
export const FIRST_DRONE: IShipData = {
  typeId: 1,
  modules: [
    {
      moduleID: "A",
      size: Sizes.Small
    },
    {
      moduleID: "S",
      size: Sizes.Small
    },
    {
      moduleID: "L",
      size: Sizes.Small
    }
  ]
};
