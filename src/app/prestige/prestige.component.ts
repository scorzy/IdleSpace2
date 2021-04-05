import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { LEVEL_PER_CARD, ENEMY_EXP_START_LEVEL } from "../model/CONSTANTS";

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  newSlots = 0;
  nextEnemy = 0;
  ngOnInit() {
    this.ms.game.prestigeManager.prestigePage = true;
    this.ms.game.prestigeManager.loadNextMultiplier();
    this.newSlots = this.getNextCardSlots();
    this.nextEnemy = Math.max(
      this.ms.game.enemyManager.maxLevel,
      ENEMY_EXP_START_LEVEL
    );
    super.ngOnInit();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe((ev) => {
        this.nextEnemy = Math.max(
          this.ms.game.enemyManager.maxLevel,
          ENEMY_EXP_START_LEVEL
        );
        this.newSlots = this.getNextCardSlots();
      })
    );
  }
  ngOnDestroy() {
    this.ms.game.prestigeManager.prestigePage = true;
    super.ngOnDestroy();
  }
  getMultiplierClass() {
    if (
      this.ms.game.prestigeManager.nextPrestigeMultiplier.gt(
        this.ms.game.prestigeManager.prestigeMultiplier
      )
    ) {
      return "text-success";
    }
    if (
      this.ms.game.prestigeManager.nextPrestigeMultiplier.lt(
        this.ms.game.prestigeManager.prestigeMultiplier
      )
    ) {
      return "text-danger";
    }
    return "";
  }
  getNextCardSlots(): number {
    const newSlot = Math.floor(
      (this.ms.game.enemyManager.maxLevel - 1) / LEVEL_PER_CARD
    );
    return Math.max(newSlot - this.ms.game.prestigeManager.maxCards, 0);
  }
  quitChallenge() {
    this.ms.game.quitChallenge();
  }
}
