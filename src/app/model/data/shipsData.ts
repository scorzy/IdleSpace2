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
      size: Sizes.ExtraSmall
    },
    {
      moduleID: "S",
      size: Sizes.ExtraSmall
    },
    {
      moduleID: "L",
      size: Sizes.ExtraSmall
    }
  ]
};
