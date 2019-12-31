import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { FLEET_NUMBER } from "../model/CONSTANTS";

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  fleetNum = 0;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  attack(num = -1) {
    if (num === -1) {
      for (let i = 0; i < FLEET_NUMBER; i++) {
        this.ms.game.enemyManager.attackCell(i);
      }
    } else this.ms.game.enemyManager.attackCell(num);
  }
}
