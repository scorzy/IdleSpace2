import { CHALLENGES } from "../data/challenges";
import { Challenge } from "./challenge";
import { Game } from "../game";
import { Bonus } from "../bonus/bonus";
import {
  DRONE_CHALLENGE_REWARD,
  XS_CHALLENGE_REWARD,
  SCIENCE_CHALLENGE_SCIENTIST_MULTI,
  SCIENCE_CHALLENGE_WAR_MULTI,
  ONE_SHOT_CHALLENGE_REWARD,
  ZERO,
  NO_HAB_CHALLENGE_MULTI,
  ONE,
  EXPANDING_CHALLENGE_DOUBLING_TIME,
  EXPANDING_CHALLENGE_REWARD
} from "../CONSTANTS";

export class ChallengeManager {
  challenges: Challenge[];
  activeChallenge: Challenge;
  completed = ZERO;
  expandingFactor = ONE;
  expandingStartDate = 0;
  //#region Challenges
  baseChallenge: Challenge;
  droneChallenge: Challenge;
  xsChallenge: Challenge;
  scienceChallenge: Challenge;
  noNukeChallenge: Challenge;
  oneShotChallenge: Challenge;
  noHabSpaceChallenge: Challenge;
  noPhysics: Challenge;
  expandingChallenge: Challenge;
  noMultiplierChallenge: Challenge;
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
    this.oneShotChallenge = this.challenges.find((c) => c.id === "5");
    this.noHabSpaceChallenge = this.challenges.find((c) => c.id === "6");
    this.noPhysics = this.challenges.find((c) => c.id === "7");
    this.expandingChallenge = this.challenges.find((c) => c.id === "8");
    this.noMultiplierChallenge = this.challenges.find((c) => c.id === "9");

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

    //  One Shot challenge
    const oneShotChallengeBonus = new Bonus(
      this.droneChallenge,
      new Decimal(ONE_SHOT_CHALLENGE_REWARD)
    );
    sm.velocityBonusStack.bonuses.push(oneShotChallengeBonus);
    sm.accelerationStack.bonuses.push(oneShotChallengeBonus);
    sm.shipsProductionBonuses.push(oneShotChallengeBonus);

    //  No hab space challenge
    const moreHabBonus = new Bonus(
      this.noHabSpaceChallenge,
      new Decimal(NO_HAB_CHALLENGE_MULTI)
    );
    rm.spaceStations.forEach((spaceStation) => {
      spaceStation.habSpaceStack.bonuses.push(moreHabBonus);
    });

    //  Expanding challenge
    const expandingBonus = new Bonus(
      this.expandingChallenge,
      new Decimal(EXPANDING_CHALLENGE_REWARD)
    );
    sm.velocityBonusStack.bonuses.push(expandingBonus);
    sm.accelerationStack.bonuses.push(expandingBonus);
    rm.searcher.prodEfficiency.bonuses.push(expandingBonus);
  }
  startChallenge(challenge: Challenge): boolean {
    if (this.activeChallenge) return false;
    this.activeChallenge = challenge;
    if (this.expandingChallenge.isActive) {
      this.expandingStartDate = Date.now();
    }
    return true;
  }
  quitChallenge() {
    this.activeChallenge = null;
    this.expandingFactor = ONE;
    this.expandingStartDate = 0;
  }
  onEnemyDefeated(enemyLevel: number) {
    this.activeChallenge?.advance(enemyLevel);
    for (const challenge of this.challenges) {
      if (enemyLevel >= challenge.unlockLevel) {
        challenge.unlocked = true;
      }
    }
  }
  postUpdate() {
    this.completed = ZERO;
    for (let i = 0, n = this.challenges.length; i < n; i++) {
      this.completed = this.completed.plus(this.challenges[i].quantity);
    }
    if (this.expandingChallenge.isActive) {
      const diff = (Date.now() - this.expandingStartDate) / 1000;
      this.expandingFactor = Decimal.pow(
        2,
        diff / EXPANDING_CHALLENGE_DOUBLING_TIME
      );
    } else {
      this.expandingFactor = ONE;
    }
  }

  //#region Save and Load
  getSave(): any {
    const save: any = {
      c: this.challenges.map((ch) => ch.getSave())
    };
    if (this.activeChallenge) save.a = this.activeChallenge.id;
    if (this.expandingStartDate > 0) save.e = this.expandingStartDate;
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
    if ("e" in save) {
      this.expandingStartDate = save.e;
    }
    this.challenges[0].nextLevel = 100;
    this.challenges[0].quantity = ZERO;
  }
  afterLoad() {
    const maxLevel = Game.getGame().enemyManager.maxLevel - 1;
    for (const challenge of this.challenges) {
      if (maxLevel >= challenge.unlockLevel) {
        challenge.unlocked = true;
      }
    }
  }
  //#endregion
}
