import { ACHIEVEMENTS_DATA } from "../data/achievementData";
import { Game } from "../game";
import { Achievement } from "./achievement";
import { maxEnemyLevelAck } from "./maxEnemyLevelAck";

export class AchievementManager {
  achievements: Array<Achievement>;
  groups: Array<{ id: string; name: string; list: Array<Achievement> }>;
  //#region Origins
  scienceAck: Achievement;
  warAck: Achievement;
  buildersAck: Achievement;

  //#endregion
  constructor() {
    this.groups = [
      {
        id: "or",
        name: "Origins",
        list: []
      }
    ];
    this.achievements = ACHIEVEMENTS_DATA.map((aData) => {
      let ret: Achievement;
      switch (aData.groupId) {
        case "or":
          ret = new maxEnemyLevelAck(aData);
        default:
          ret = new Achievement(aData);
      }
      return ret;
    });
    this.achievements.forEach((ack) => {
      const group = this.groups.find((gr) => gr.id === ack.groupId);
      group.list.push(ack);
    });

    this.scienceAck = this.achievements.find((a) => a.id === "os");
    this.warAck = this.achievements.find((a) => a.id === "ow");
    this.buildersAck = this.achievements.find((a) => a.id === "ob");
  }
  onDefeatEnemyAchievements() {
    let done = false;
    const game = Game.getGame();

    if (game.researchManager.scienceOrigin.quantity.gte(1)) {
      done = this.scienceAck.complete();
      if (done) game.researchManager.researches.forEach((res) => res.loadMax());
    } else if (game.researchManager.warOrigin.quantity.gte(1)) {
      done = this.warAck.complete();
    } else if (game.researchManager.buildersOrigin.quantity.gte(1)) {
      done = this.buildersAck.complete();
    }
  }
  //#region Save and Load
  getSave(): any {
    return {
      k: this.achievements.map((ack) => ack.getSave())
    };
  }
  load(data: any) {
    if ("k" in data) {
      for (const aData of data.k) {
        const ack = this.achievements.find((a) => a.id === aData.i);
        if (ack) ack.load(aData);
      }
    }
  }
  //#endregion
}
