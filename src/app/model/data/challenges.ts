import { CHALLENGE_REWARD_EXP } from "../CONSTANTS";

export interface iChallengeData {
  id: string;
  name: string;
  description: string;
  rewards: string[];
  unlockLevel: number;
  startLevel: number;
  experiencePerCompletions?: number;
}
export const CHALLENGES: iChallengeData[] = [
  {
    id: "0",
    name: "Base Challenge",
    description: "Your Experience Multiplier will reset to one.",
    rewards: [
      "+1 experience from enemies with level greater than 100 x 'completions'"
    ],
    unlockLevel: 100,
    startLevel: 100
  }
];
