import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { LEVEL_PER_CARD } from "../model/CONSTANTS";

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  newSlots = 0;
  ngOnInit() {
    this.newSlots = this.getNextCardSlots();
    super.ngOnInit();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe((ev) => {
        this.newSlots = this.getNextCardSlots();
      })
    );
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
      return "text-error";
    }
    return "";
  }
  getNextCardSlots(): number {
    const newSlot = Math.floor(
      this.ms.game.enemyManager.maxLevel / LEVEL_PER_CARD
    );
    return this.ms.game.prestigeManager.maxCards - newSlot;
  }
}
