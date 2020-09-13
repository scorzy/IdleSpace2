import forOwn from "lodash-es/forOwn";
import { CHALLENGE_REPEAT_LEVEL, ZERO } from "../CONSTANTS";
import { iChallengeData } from "../data/challenges";
import { IBase } from "../iBase";

export class Challenge implements IBase {
  id = "";
  name = "";
  description = "";
  reward = "";
  quantity = ZERO;
  unlockLevel = 0;
  startLevel = 100;
  nextLevel = 100;

  icon = "";
  colorClass = "";

  init(data: iChallengeData) {
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
      this.quantity = this.quantity.plus(1);
      this.reload();
    }
  }

  //#region Save and Load
  getSave(): any {
    return {
      i: this.id,
      q: this.quantity
    };
  }
  load(save: any) {
    if (!("i" in save && save.i === this.id)) return;
    if ("q" in save) this.quantity = new Decimal(save.q);
    this.reload();
  }
  //#endregion
}
