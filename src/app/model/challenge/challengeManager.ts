import { CHALLENGES } from "../data/challenges";
import { Challenge } from "./challenge";

export class ChallengeManager {
  challenges: Challenge[];
  activeChallenge: Challenge;
  constructor() {
    this.challenges = [];
    CHALLENGES.forEach((cData) => {
      const challenge = new Challenge();
      challenge.init(cData);
      this.challenges.push(challenge);
    });
  }
  startChallenge(challenge: Challenge): boolean {
    if (this.activeChallenge) return false;
    this.activeChallenge = challenge;
    return true;
  }
  quitChallenge() {
    this.activeChallenge = null;
  }

  //#region Save and Load
  getSave(): any {
    const save: any = {
      c: this.challenges.map((ch) => ch.getSave())
    };
    if (this.activeChallenge) save.a = this.activeChallenge.id;
    return save;
  }
  load(save: any) {
    if ("c" in save) {
      for (const data of save.c) {
        const challenge = this.challenges.find((ch) => ch.id === data.i);
        if (challenge) challenge.load(data);
      }
    }
    if ("a" in save) {
      this.activeChallenge = this.challenges.find((ch) => ch.id === save.a);
    }
  }
  //#endregion
}
