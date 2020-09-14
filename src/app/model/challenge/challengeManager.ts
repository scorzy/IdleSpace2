import { CHALLENGES } from "../data/challenges";
import { Challenge } from "./challenge";
import { Game } from "../game";

export class ChallengeManager {
  challenges: Challenge[];
  activeChallenge: Challenge;
  baseChallenge: Challenge;
  constructor() {
    this.challenges = [];
    CHALLENGES.forEach((cData) => {
      const challenge = new Challenge();
      challenge.init(cData);
      this.challenges.push(challenge);
    });
    this.baseChallenge = this.challenges.find((c) => c.id === "0");
  }
  startChallenge(challenge: Challenge): boolean {
    if (this.activeChallenge) return false;
    this.activeChallenge = challenge;
    return true;
  }
  quitChallenge() {
    this.activeChallenge = null;
  }
  onEnemyDefeated(enemyLevel: number) {
    this.activeChallenge?.advance(enemyLevel);
    for (let challenge of this.challenges) {
      if (enemyLevel >= challenge.unlockLevel) {
        challenge.unlocked = true;
      }
    }
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
  afterLoad() {
    const maxLevel = Game.getGame().enemyManager.maxLevel - 1;
    for (let challenge of this.challenges) {
      if (maxLevel >= challenge.unlockLevel) {
        challenge.unlocked = true;
      }
    }
  }
  //#endregion
}
