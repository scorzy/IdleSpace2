import {
  CHALLENGE_REWARD_EXP,
  DRONE_CHALLENGE_REWARD,
  XS_CHALLENGE_REWARD,
  SCIENCE_CHALLENGE_LIMIT,
  SCIENCE_CHALLENGE_SCIENTIST_MULTI,
  SCIENCE_CHALLENGE_WAR_MULTI,
  NUKE_CHALLENGE_EFF_MULTI,
  NUKE_CHALLENGE_STORAGE_MULTI,
  ONE_SHOT_CHALLENGE_REWARD,
  NO_HAB_CHALLENGE_MULTI
} from "../CONSTANTS";

export interface IChallengeData {
  id: string;
  name: string;
  description: string;
  rewards: string[];
  unlockLevel: number;
  startLevel: number;
  experiencePerCompletions?: number;
  icon?: string;
}
export const CHALLENGES: IChallengeData[] = [
  {
    id: "0",
    name: "Tutorial Challenge",
    description: "Your Experience Multiplier will reset to one.",
    rewards: [
      "+1 experience from enemies with level greater than 100 x 'completions'"
    ],
    unlockLevel: 150,
    startLevel: 100
  },
  {
    id: "1",
    name: "Drones only",
    description:
      "Your Experience Multiplier will reset to one. Space ships bigger than drones don't unlock.",
    rewards: [
      "+" +
        DRONE_CHALLENGE_REWARD * 100 +
        "% ships build speed, speed and acceleration x completion"
    ],
    unlockLevel: 250,
    startLevel: 100
  },
  {
    id: "2",
    name: "XS only",
    description:
      "Your Experience Multiplier will reset to one. You can use only Extra Small ship modules.",
    rewards: [
      "Unlock Titan size",
      "Workers yeild " + XS_CHALLENGE_REWARD * 100 + "% more x completion"
    ],
    unlockLevel: 300,
    startLevel: 100,
    experiencePerCompletions: CHALLENGE_REWARD_EXP * 2
  },
  {
    id: "3",
    name: "Limited Science",
    description:
      "Your Experience Multiplier will reset to one. Science output is capped to " +
      SCIENCE_CHALLENGE_LIMIT +
      ", excess will be lost. Science can be used to search enemies without limitations.",
    rewards: [
      "Repeatable research can be repeated one more times x completion",
      "Scientists yeild " +
        SCIENCE_CHALLENGE_SCIENTIST_MULTI * 100 +
        "% more science",
      "+ " + SCIENCE_CHALLENGE_WAR_MULTI * 100 + "% science from battles"
    ],
    unlockLevel: 600,
    startLevel: 100,
    experiencePerCompletions: CHALLENGE_REWARD_EXP * 5
  },
  {
    id: "4",
    name: "No Nuke",
    description:
      "Your Experience Multiplier will reset to one. Nuke specialist doesn't unlock.",
    rewards: [
      "Nuke specialists yeild " + NUKE_CHALLENGE_EFF_MULTI * 100 + "% more",
      "+" + NUKE_CHALLENGE_STORAGE_MULTI * 100 + " % nuke storage"
    ],
    unlockLevel: 200,
    startLevel: 100,
    experiencePerCompletions: CHALLENGE_REWARD_EXP
  },
  {
    id: "5",
    name: "One Shot",
    description:
      "Your Experience Multiplier will reset to one. Enemies regenerate 100% of their ships after combat, in case the have at least one ship. Nuke can be used normally.",
    rewards: [
      "+" +
        ONE_SHOT_CHALLENGE_REWARD * 100 +
        "% ships build speed, speed and acceleration x completion"
    ],
    unlockLevel: 400,
    startLevel: 100,
    experiencePerCompletions: CHALLENGE_REWARD_EXP * 2
  },
  {
    id: "6",
    name: "No Hab Space",
    description:
      "Your Experience Multiplier will reset to one. You don't gain habitable space from enemies.",
    rewards: [
      "+" +
        NO_HAB_CHALLENGE_MULTI * 100 +
        " space station hab space x completion"
    ],
    unlockLevel: 500,
    startLevel: 100,
    experiencePerCompletions: CHALLENGE_REWARD_EXP * 2
  }
];
