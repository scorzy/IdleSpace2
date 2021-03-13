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
  MORE_HAB_FROM_STATIONS,
  NAVAL_CAP_CARD_MULTI,
  EXTRA_DISTRICTS_FROM_STATIONS,
  KILL_STREAK_SPEED_CARD,
  KILL_STREAK_GAIN_CARD,
  MEGA_BUILD_SPEED_CARD,
  CHALLENGE_XP_MULTI,
  FLEET_CAPACITY_CARD,
  FLEET_CAPACITY,
  PRICE_GROW_RATE,
  PRICE_GROW_RATE_2,
  MORE_STORAGE_CARD
} from "../CONSTANTS";

export interface ICardData extends ISimpleBase {
  cardRequired?: number;
  requirement?: string;
}

export const PRESTIGE_CARDS: ICardData[] = [
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
  {
    id: "5",
    name: "More mods",
    description: "Drones have 50% more mods",
    icon: "fa-s:microchip"
  },
  {
    id: "6",
    name: "Extreme modding",
    description:
      "Grants the ability of increasing max mods at expense of component prices.",
    icon: "fa-s:microchip"
  },
  {
    id: "7",
    name: "Storage",
    description:
      "Increases energy, components and nuke storage by " +
      MORE_STORAGE_CARD +
      "%.",
    icon: "database"
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
  {
    id: "r3",
    name: "Double Level Researches",
    description: "Repeatable researches can be repeated double times.",
    icon: "fa-s:flask"
  },
  {
    id: "r4",
    name: "More Researches",
    description: "Add more repeatable researches.",
    icon: "fa-s:flask",
    requirement: "r3",
    cardRequired: 2
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
  {
    id: "w5",
    name: "Naval Capacity",
    description: "+" + NAVAL_CAP_CARD_MULTI * 100 + "% naval capacity",
    icon: "my:strafe"
  },
  {
    id: "w6",
    name: "Kill Streak: Speed",
    description:
      "+" +
      KILL_STREAK_SPEED_CARD * 100 +
      "% speed and acceleration per kill streak",
    icon: "my:strafe"
  },
  {
    id: "w7",
    name: "Kill Streak: Resources",
    description:
      "+" + KILL_STREAK_GAIN_CARD * 100 + "% battle gains per kill streak",
    icon: "my:strafe"
  },
  {
    id: "w8",
    name: "More fleet capacity",
    description:
      "+" + FLEET_CAPACITY_CARD + " fleet capacity." + FLEET_CAPACITY,
    icon: "my:strafe"
  },
  {
    id: "w9",
    name: "Better prices scaling",
    description:
      "Lower the exponential multiplier for modules prices from " +
      PRICE_GROW_RATE +
      " to " +
      PRICE_GROW_RATE_2,
    icon: "my:upgrade"
  },
  {
    id: "w10",
    name: "Kill Streak: auto win",
    description:
      "Every third kill streak the next cell is defeated automatically",
    icon: "my:strafe",
    cardRequired: 2
  },
  {
    id: "w11",
    name: "Favourite ship module",
    description:
      "Choose an unlocked ship module. Start next run with that module unlocked.",
    icon: "my:strafe",
    cardRequired: 1
  },
  {
    id: "w12",
    name: "Double Attack",
    description:
      "Your fleet can twice in the same turn. It happens battle time is less than 0.1s and no reinforce is needed.",
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
  {
    id: "p3",
    name: "Battle Warp",
    description: "Warps are double effective at reducing battle times.",
    icon: "field-time"
  },
  {
    id: "p4",
    name: "Mod Warp",
    description:
      "Warp (1 + log10('mod used')) seconds when modding any worker.",
    icon: "field-time"
  },
  {
    id: "p5",
    name: "Space Station Warp",
    description: "Warp (1 + level/2) seconds when completing a space station.",
    icon: "field-time"
  },
  {
    id: "p6",
    name: "Auto Warp",
    description:
      "Unlock automation to warp fleet jobs and searching jobs with Dark Matter.",
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
      "Increase maximum computing by " + COMPUTING_MAX_CARD * 100 + "%",
    icon: "my:computing"
  },
  {
    id: "s3",
    name: "Favourite Spell",
    description:
      "Choose a spell that is unlocked. You start next runs with that spell unlocked.",
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
    id: "m3",
    name: "More Departments",
    description: "Increase departments by 100%",
    icon: "fa-s:building"
  },
  {
    id: "m4",
    name: "Prestige multi doesn't decrease",
    description: "Prestige multi doesn't decrease on prestige.",
    icon: "arrow-up",
    cardRequired: 2
  },
  {
    id: "m2",
    name: "Bigger Space Stations",
    description:
      "Increase hab. space from space station by " +
      MORE_HAB_FROM_STATIONS * 100 +
      "%",
    icon: "my:defense-satellite"
  },
  {
    id: "m5",
    name: "Space Mining",
    description:
      "Space stations grants mining districts. Equal to " +
      EXTRA_DISTRICTS_FROM_STATIONS * 100 +
      "% of hab space.",
    icon: "my:defense-satellite"
  },
  {
    id: "m6",
    name: "Solar Energy",
    description:
      "Space stations grants energetic districts. Equal to " +
      EXTRA_DISTRICTS_FROM_STATIONS * 100 +
      "% of hab space.",
    icon: "my:defense-satellite"
  },
  {
    id: "m7",
    name: "Mega Engineering",
    description:
      "+" + MEGA_BUILD_SPEED_CARD * 100 + "% megastructures build speed.",
    icon: "my:defense-satellite"
  },
  {
    id: "m8",
    name: "Auto Prestige",
    description: "Unlock auto prestige.",
    icon: "sync",
    cardRequired: 10
  },
  {
    id: "m9",
    name: "Megastructure Automation",
    description: "Unlock Megastructure Automation.",
    icon: "my:defense-satellite",
    cardRequired: 1
  },
  //#endregion
  //#region Challenges
  {
    id: "c0",
    name: "Challenge multiplier",
    description:
      "Increase experience multiplier by " +
      CHALLENGE_XP_MULTI * 100 +
      "% per completed challenge.",
    icon: "arrow-up",
    cardRequired: 5
  },
  //#endregion
  //#region Search
  {
    id: "k0",
    name: "Extend Search",
    description: "Increase maximum search points from 100 to 200.",
    icon: "my:radar-sweep",
    cardRequired: 1
  },
  //#endregion
  //#region Achievements
  {
    id: "A",
    name: "Achievements multiplier",
    description:
      "Increase experience multiplier by 1% per completed achievement.",
    icon: "trophy",
    cardRequired: 5
  }
  //#endregion
];
