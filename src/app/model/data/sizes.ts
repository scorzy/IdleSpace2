export enum Sizes {
  ExtraSmall = 1,
  Small,
  Medium,
  Large,
  ExtraLarge,
  Titanic
}
export const ALL_SIZES = [
  Sizes.ExtraSmall,
  Sizes.Small,
  Sizes.Medium,
  Sizes.Large,
  Sizes.ExtraLarge
];
const sizeNames = [
  ["XS", "Extra Small"],
  ["S", "Small"],
  ["M", "Medium"],
  ["L", "Large"],
  ["XL", "Extra Large"],
  ["T", "Titanic"]
];
export function getSizeName(size: Sizes, short = false): string {
  return size < 6
    ? sizeNames[size - 1][short ? 0 : 1]
    : short
    ? "T "
    : "Titan ";
}
