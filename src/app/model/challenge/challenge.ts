import forOwn from "lodash-es/forOwn";
import {
  CHALLENGE_REPEAT_LEVEL,
  ZERO,
  CHALLENGE_REWARD_EXP,
  CHALLENGE_ICON
} from "../CONSTANTS";
import { IChallengeData } from "../data/challenges";
import { IBase } from "../iBase";
import { Game } from "../game";
import {
  MyNotification,
  NotificationTypes
} from "../notifications/myNotification";
import { MainService } from "src/app/main.service";

export class Challenge implements IBase {
  id = "";
  name = "";
  description = "";
  rewards: string[] = new Array<string>();
  quantity = ZERO;
  unlockLevel = 0;
  startLevel = 100;
  nextLevel = 100;
  unlocked = false;
  experiencePerCompletions = CHALLENGE_REWARD_EXP;

  icon = "";
  colorClass = "";
  typeIcon = CHALLENGE_ICON;

  init(data: IChallengeData) {
    forOwn(
      this,
      function (value: any, key: string) {
        if (data.hasOwnProperty(key) && typeof data[key] === typeof this[key]) {
          this[key] = data[key];
        }
      }.bind(this)
    );
  }
  reload() {
    this.nextLevel = Math.floor(
      this.quantity.toNumber() * CHALLENGE_REPEAT_LEVEL + this.startLevel
    );
  }
  advance(enemyLevel: number) {
    if (enemyLevel >= this.nextLevel) {
      const game = Game.getGame();
      this.quantity = this.quantity.plus(1);
      const expToAdd = this.quantity.times(this.experiencePerCompletions);
      if (expToAdd.gt(0)) {
        game.prestigeManager.addExperience(expToAdd);
        game.notificationManager.addNotification(
          new MyNotification(
            NotificationTypes.CHALLENGE,
            this.name + " " + MainService.formatPipe.transform(this.quantity),
            "+" + MainService.formatPipe.transform(expToAdd) + " exp"
          )
        );
      }
      this.reload();
      game.researchManager.researches.forEach((res) => res.loadMax());
    }
  }
  get isActive(): boolean {
    return Game.getGame().challengeManager.activeChallenge?.id === this.id;
  }

  //#region Save and Load
  getSave(): any {
    return {
      i: this.id,
      q: this.quantity,
      u: this.unlocked
    };
  }
  load(save: any) {
    if (!("i" in save && save.i === this.id)) return;
    if ("q" in save) this.quantity = new Decimal(save.q);
    if ("u" in save) this.unlocked = save.u;
    this.reload();
  }
  //#endregion
}
