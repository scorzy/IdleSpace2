export interface iChallengeData {
  id: string;
  name: string;
  description: string;
  reward: string;
  unlockLevel: number;
  startLevel: number;
}
export const CHALLENGES: iChallengeData[] = [
  {
    id: "0",
    name: "Base Challenge",
    description: "",
    reward: "",
    unlockLevel: 100,
    startLevel: 100
  }
];
