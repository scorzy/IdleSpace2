import { CHALLENGES } from "../data/challenges";
import { Challenge } from "./challenge";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import {
  DRONE_CHALLENGE_REWARD,
  XS_CHALLENGE_REWARD,
  SCIENCE_CHALLENGE_SCIENTIST_MULTI,
  SCIENCE_CHALLENGE_WAR_MULTI
} from "../CONSTANTS";

export class ChallengeManager {
  challenges: Challenge[];
  activeChallenge: Challenge;
  //#region Challenges
  baseChallenge: Challenge;
  droneChallenge: Challenge;
  xsChallenge: Challenge;
  scienceChallenge: Challenge;
  noNukeChallenge: Challenge;
  oneShot: Challenge;
  //#endregion
  constructor() {
    this.challenges = [];
    CHALLENGES.forEach((cData) => {
      const challenge = new Challenge();
      challenge.init(cData);
      this.challenges.push(challenge);
    });
    this.challenges = this.challenges.sort(
      (a, b) => a.unlockLevel - b.unlockLevel
    );
    const sm = Game.getGame().shipyardManager;
    const rm = Game.getGame().resourceManager;
    const tm = Game.getGame().researchManager;

    this.baseChallenge = this.challenges.find((c) => c.id === "0");
    this.droneChallenge = this.challenges.find((c) => c.id === "1");
    this.xsChallenge = this.challenges.find((c) => c.id === "2");
    this.scienceChallenge = this.challenges.find((c) => c.id === "3");
    this.noNukeChallenge = this.challenges.find((c) => c.id === "4");
    this.oneShot = this.challenges.find((c) => c.id === "5");

    //  Drone challenge
    const droneChallengeBonus = new Bonus(
      this.droneChallenge,
      new Decimal(DRONE_CHALLENGE_REWARD)
    );
    sm.velocityBonusStack.bonuses.push(droneChallengeBonus);
    sm.accelerationStack.bonuses.push(droneChallengeBonus);
    sm.shipsProductionBonuses.push(droneChallengeBonus);

    //  XS challenge
    rm.worker.prodEfficiency.bonuses.push(
      new Bonus(this.xsChallenge, new Decimal(XS_CHALLENGE_REWARD))
    );

    //  Science challenge
    rm.scientist.prodEfficiency.bonuses.push(
      new Bonus(
        this.scienceChallenge,
        new Decimal(SCIENCE_CHALLENGE_SCIENTIST_MULTI)
      )
    );
    rm.science.battleGainMulti.bonuses.push(
      new Bonus(this.scienceChallenge, new Decimal(SCIENCE_CHALLENGE_WAR_MULTI))
    );

    //  No Nuke challenge
    tm.nukeResearch.noUnlockChallenges = [this.noNukeChallenge];
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
