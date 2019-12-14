export enum Sizes {
  Small = 1,
  Medium,
  Large,
  ExtraLarge,
  Titanic
}
export const ALL_SIZES = [
  Sizes.Small,
  Sizes.Medium,
  Sizes.Large,
  Sizes.ExtraLarge
];
const sizeNames = [
  ["S", "Small"],
  ["M", "Medium"],
  ["L", "Large"],
  ["XL", "ExtraLarge"],
  ["T", "Titanic"]
];
export function getSizeName(size: Sizes, short = false): string {
  return size < 5
    ? sizeNames[size - 1][short ? 0 : 1]
    : (short ? "T " : "Titan ") + (size - 4);
}
