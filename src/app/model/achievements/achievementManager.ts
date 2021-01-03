import { ACHIEVEMENTS_DATA } from "../data/achievementData";
import { Game } from "../game";
import { Achievement } from "./achievement";

export class AchievementManager {
  achievements: Array<Achievement>;
  //#region Origins
  science1: Achievement;
  science2: Achievement;
  science3: Achievement;

  war1: Achievement;
  war2: Achievement;
  war3: Achievement;

  builders1: Achievement;
  builders2: Achievement;
  builders3: Achievement;

  //#endregion
  constructor() {
    this.achievements = ACHIEVEMENTS_DATA.map(
      (aData) => new Achievement(aData)
    );
    this.science1 = this.achievements.find((a) => a.id === "os1");
    this.science2 = this.achievements.find((a) => a.id === "os2");
    this.science3 = this.achievements.find((a) => a.id === "os3");

    this.war1 = this.achievements.find((a) => a.id === "ow1");
    this.war2 = this.achievements.find((a) => a.id === "ow2");
    this.war3 = this.achievements.find((a) => a.id === "ow3");

    this.builders1 = this.achievements.find((a) => a.id === "ob1");
    this.builders2 = this.achievements.find((a) => a.id === "ob2");
    this.builders3 = this.achievements.find((a) => a.id === "ob3");
  }
  onDefeatEnemyAchievements() {
    let done = false;
    const game = Game.getGame();
    if (
      game.enemyManager.currentEnemy.level === 100 ||
      game.enemyManager.currentEnemy.level === 200 ||
      game.enemyManager.currentEnemy.level === 500
    ) {
      if (game.researchManager.scienceOrigin.quantity.gte(1)) {
        if (game.enemyManager.currentEnemy.level === 100) {
          done = this.science1.complete();
        }
        if (game.enemyManager.currentEnemy.level === 200) {
          done = this.science2.complete();
        }
        if (game.enemyManager.currentEnemy.level === 500) {
          done = this.science3.complete();
        }

        if (done) {
          game.researchManager.researches.forEach((res) => res.loadMax());
        }
      } else if (game.researchManager.warOrigin.quantity.gte(1)) {
        if (game.enemyManager.currentEnemy.level === 100) this.war1.complete();
        if (game.enemyManager.currentEnemy.level === 200) this.war2.complete();
        if (game.enemyManager.currentEnemy.level === 500) this.war3.complete();
      } else if (game.researchManager.buildersOrigin.quantity.gte(1)) {
        if (game.enemyManager.currentEnemy.level === 100) {
          this.builders1.complete();
        }
        if (game.enemyManager.currentEnemy.level === 200) {
          this.builders2.complete();
        }
        if (game.enemyManager.currentEnemy.level === 500) {
          this.builders3.complete();
        }
      }
    }
  }
  //#region Save and Load
  getSave(): any {
    return {
      a: this.achievements.filter((a) => a.done).map((a) => a.id)
    };
  }
  load(data: any) {
    if ("a" in data) {
      for (const aId of data.a) {
        const ack = this.achievements.find((a) => a.id === aId);
        if (ack) ack.done = true;
      }
    }
  }
  //#endregion
}
