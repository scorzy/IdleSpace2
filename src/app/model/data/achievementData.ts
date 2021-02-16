import { ORIGIN_LEVELS, SPECIALIZATION_LEVELS } from "../CONSTANTS";

export interface IAchievementData {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  groupId: string;
  max?: number;
  levels?: number[];
}
export const ACHIEVEMENTS_DATA: IAchievementData[] = [
  //#region Origins
  {
    id: "os",
    name: "Science",
    description:
      "Reach level #level@ with Science origin. Repeatable researches can be repeated one more time.",
    icon: "fa-s:atom",
    colorClass: "science-color",
    groupId: "or",
    max: 3,
    levels: ORIGIN_LEVELS
  },
  {
    id: "ow",
    name: "War",
    description: "Reach level #level@ with War origin. +20% ship velocity.",
    icon: "my:medal",
    colorClass: "damage-color",
    groupId: "or",
    max: 3,
    levels: ORIGIN_LEVELS
  },
  {
    id: "ob",
    name: "Builders",
    description:
      "Reach level #level@ with Builders origin. Workers yeilds 50% more.",
    icon: "fa-s:cog",
    colorClass: "production-color",
    groupId: "or",
    max: 3,
    levels: ORIGIN_LEVELS
  },
  //#endregion
  //#region Specialization
  {
    id: "smb",
    name: "Mega Builders",
    description:
      "Reach level #level@ with Mega Builders specialization. +100% megastructures build speed.",
    icon: "fa-s:cog",
    colorClass: "production-color",
    groupId: "or",
    max: 3,
    levels: SPECIALIZATION_LEVELS
  },
  {
    id: "sm",
    name: "Modders",
    description:
      "Reach level #level@ with Modders specialization. +10% max mods.",
    icon: "my:vintage-robot",
    colorClass: "component-color",
    groupId: "or",
    max: 3,
    levels: SPECIALIZATION_LEVELS
  },
  {
    id: "se",
    name: "Explorers",
    description:
      "Reach level #level@ with Explorers specialization. +10% districts from enemies.",
    icon: "my:radar-sweep",
    colorClass: "search-color",
    groupId: "or",
    max: 3,
    levels: SPECIALIZATION_LEVELS
  }
  //#endregion
];
