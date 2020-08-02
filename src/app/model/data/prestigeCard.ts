import { ISimpleBase } from "../iBase";
import {
  PRODUCTION_CARD,
  EFFICIENCY_CARD,
  MORE_DRONES_CARD,
  RECYCLING_CARD,
  TECHNOLOGY_CARD,
  DISTRICTS_CARD,
  MATERIALS_CARD,
  COMPONENTS_CARD,
  VICTORY_WARP_CARD,
  ENEMY_DEFEAT_WARP_CARD,
  UPDATE_WARP_CARD,
  INSPIRATION_CARD,
  INSPIRATION_PERCENT,
  EXP_GAIN_CARD,
  DM_GAIN_CARD,
  SPELL_DURATION_CARD,
  COMPUTING_REGENERATION_CARD,
  COMPUTING_MAX_CARD,
  PRODUCTION_PEACE_CARD,
  MORE_HAB_FROM_STATIONS
} from "../CONSTANTS";

export const PRESTIGE_CARDS: ISimpleBase[] = [
  //#region Drones
  {
    id: "0",
    name: "Production",
    description:
      "Drones yields and consume " + PRODUCTION_CARD * 100 + "% more",
    icon: "my:vintage-robot"
  },
  {
    id: "1",
    name: "Efficiency",
    description: "Drones yields " + EFFICIENCY_CARD * 100 + "% more",
    icon: "my:vintage-robot"
  },
  {
    id: "2",
    name: "More Drones",
    description: "Increase Drones limit by " + MORE_DRONES_CARD * 100 + "%",
    icon: "my:vintage-robot"
  },
  {
    id: "3",
    name: "Recycling",
    description: "Increase Drones recycling by " + RECYCLING_CARD * 100 + "%",
    icon: "my:vintage-robot"
  },
  {
    id: "4",
    name: "Peacefully Efficiency",
    description:
      "Drones yields " +
      PRODUCTION_PEACE_CARD * 100 +
      "% more when not in war (no enemy on battle screen)",
    icon: "fa-s:peace"
  },
  //#endregion
  //#region Science
  {
    id: "r0",
    name: "Technology",
    description: "Increase technology gain by " + TECHNOLOGY_CARD * 100 + "%",
    icon: "fa-s:flask"
  },
  {
    id: "r1",
    name: "Research Boost",
    description:
      "Increase researches boost from " +
      INSPIRATION_PERCENT * 100 +
      "% to " +
      INSPIRATION_CARD * 100 +
      "%",
    icon: "fa-s:flask"
  },
  {
    id: "r2",
    name: "Technology Boost",
    description: "Research boosts also increase the relative technology",
    icon: "fa-s:flask"
  },
  //#endregion
  //#region War
  {
    id: "w0",
    name: "Districts",
    description:
      "Increase districts from enemies by " + DISTRICTS_CARD * 100 + "%",
    icon: "my:strafe"
  },
  {
    id: "w1",
    name: "Materials",
    description:
      "Increase material from enemies by " + MATERIALS_CARD * 100 + "%",
    icon: "my:strafe"
  },
  {
    id: "w2",
    name: "Components",
    description:
      "Increase components from enemies by " + COMPONENTS_CARD * 100 + "%",
    icon: "my:strafe"
  },
  {
    id: "w3",
    name: "Victory Warp",
    description: "Warp " + VICTORY_WARP_CARD + " seconds when you win a battle",
    icon: "my:strafe"
  },
  {
    id: "w4",
    name: "Final Victory Warp",
    description:
      "Warp " + ENEMY_DEFEAT_WARP_CARD + " seconds when you defeat an enemy",
    icon: "my:strafe"
  },
  //#endregion
  //#region Warp
  {
    id: "p0",
    name: "Double Warp",
    description: "Warp 100% more",
    icon: "field-time"
  },
  {
    id: "p1",
    name: "Science Warp",
    description:
      "Warps yield science equal to 'total science per sec' * 'warp time'",
    icon: "field-time"
  },
  {
    id: "p2",
    name: "Update Warp",
    description:
      "Game update longer than " + UPDATE_WARP_CARD + " hours become warps",
    icon: "field-time"
  },
  //#endregion
  //#region Spells
  {
    id: "s0",
    name: "Longer Spell",
    description: "Spells last " + SPELL_DURATION_CARD * 100 + "% more",
    icon: "my:computing"
  },
  {
    id: "s1",
    name: "Computing Regeneration",
    description:
      "Increase computing regeneration by " +
      COMPUTING_REGENERATION_CARD * 100 +
      "%",
    icon: "my:computing"
  },
  {
    id: "s2",
    name: "More Computing",
    description:
      "Increase computing regeneration by " + COMPUTING_MAX_CARD * 100 + "%",
    icon: "my:computing"
  },
  //#endregion
  //#region Misc
  {
    id: "m0",
    name: "More Experience",
    description: "Increase Experience gain by " + EXP_GAIN_CARD * 100 + "%",
    icon: "arrow-up"
  },
  {
    id: "m1",
    name: "More Dark Matter",
    description: "Increase Dark Matter gain by " + DM_GAIN_CARD * 100 + "%",
    icon: "arrow-up"
  },
  {
    id: "m2",
    name: "Bigger Space Stations",
    description:
      "Increase hab. space from space station by " +
      MORE_HAB_FROM_STATIONS * 100 +
      "%",
    icon: "arrow-up"
  }
  //#endregion
];
