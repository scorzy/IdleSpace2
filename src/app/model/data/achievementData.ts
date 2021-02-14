import { ORIGIN_LEVELS, SPECIALIZATION_LEVELS } from "../CONSTANTS";

export interface IAchievementData {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  groupId: string;
  max?: number;
  enemyLevels?: number[];
}
export const ACHIEVEMENTS_DATA: IAchievementData[] = [
  //#region Origins
  {
    id: "os",
    name: "Science",
    description:
      "Reach level #enemyLevel@ with science origin. Repeatable researches can be repeated one more time.",
    icon: "fa-s:atom",
    colorClass: "science-color",
    groupId: "or",
    max: 3,
    enemyLevels: ORIGIN_LEVELS
  },
  {
    id: "ow",
    name: "War",
    description:
      "Reach level #enemyLevel@ with war origin. +20% ship velocity.",
    icon: "my:medal",
    colorClass: "damage-color",
    groupId: "or",
    max: 3,
    enemyLevels: ORIGIN_LEVELS
  },
  {
    id: "ob",
    name: "Builders",
    description:
      "Reach level #enemyLevel@ with builders origin. Workers yeilds 50% more.",
    icon: "fa-s:cog",
    colorClass: "production-color",
    groupId: "or",
    max: 3,
    enemyLevels: ORIGIN_LEVELS
  },
  //#endregion
  //#region Specialization
  {
    id: "smb",
    name: "Mega Builders",
    description:
      "Reach level #enemyLevel@ with mega builders. Repeatable researches can be repeated one more time.",
    icon: "fa-s:cog",
    colorClass: "production-color",
    groupId: "or",
    max: 3,
    enemyLevels: SPECIALIZATION_LEVELS
  }
  //#endregion
];
