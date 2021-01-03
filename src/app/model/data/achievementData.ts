export interface IAchievementData {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
}
export const ACHIEVEMENTS_DATA: IAchievementData[] = [
  //#region Origins
  {
    id: "os1",
    name: "Science I",
    description:
      "Reach level 100 with science origin. Repeatable researches can be repeated one more time.",
    icon: "fa-s:atom",
    colorClass: "science-color"
  },
  {
    id: "os2",
    name: "Science II",
    description:
      "Reach level 200 with science origin. Repeatable researches can be repeated two more times.",
    icon: "fa-s:atom",
    colorClass: "science-color"
  },
  {
    id: "os3",
    name: "Science III",
    description:
      "Reach level 500 with science origin. Repeatable researches can be repeated tree more times.",
    icon: "fa-s:atom",
    colorClass: "science-color"
  },
  //#endregion
  //#region Origin War
  {
    id: "ow1",
    name: "War I",
    description: "Reach level 100 with war origin.",
    icon: "my:medal",
    colorClass: "damage-color"
  },
  {
    id: "ow2",
    name: "War II",
    description: "Reach level 200 with war origin.",
    icon: "my:medal",
    colorClass: "damage-color"
  },
  {
    id: "ow3",
    name: "War III",
    description: "Reach level 500 with war origin.",
    icon: "my:medal",
    colorClass: "damage-color"
  },
  //#endregion
  //#region Origin Builders
  {
    id: "ob1",
    name: "Builders I",
    description: "Reach level 100 with builders origin.",
    icon: "fa-s:cog",
    colorClass: "production-color"
  },
  {
    id: "ob2",
    name: "Builders II",
    description: "Reach level 200 with builders origin.",
    icon: "fa-s:cog",
    colorClass: "production-color"
  },
  {
    id: "ob3",
    name: "Builders III",
    description: "Reach level 500 with builders origin.",
    icon: "fa-s:cog",
    colorClass: "production-color"
  }
  //#endregion
];
