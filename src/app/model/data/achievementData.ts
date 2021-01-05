import { ORIGIN_LEVELS } from "../CONSTANTS";

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
    name: "Science I",
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
    name: "War I",
    description: "Reach level #enemyLevel@ with war origin.",
    icon: "my:medal",
    colorClass: "damage-color",
    groupId: "or",
    max: 3,
    enemyLevels: ORIGIN_LEVELS
  },
  {
    id: "ob",
    name: "Builders I",
    description: "Reach level #enemyLevel@ with builders origin.",
    icon: "fa-s:cog",
    colorClass: "production-color",
    groupId: "or",
    max: 3,
    enemyLevels: ORIGIN_LEVELS
  }
  //#endregion
];
