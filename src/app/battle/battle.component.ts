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
  cell = 0;
  activeCells = new Array<{ label: string; value: number }>();

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.selectActiveCells();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.selectActiveCells();
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
  selectActiveCells() {
    this.activeCells = [];
    if (!this.ms.game.enemyManager.currentEnemy) return;

    for (let i = 0; i < 100; i++) {
      const cell = this.ms.game.enemyManager.currentEnemy.cells[i];
      if (!cell.done) {
        this.activeCells.push({
          label: "" + (1 + cell.index),
          value: cell.index
        });
        if (this.activeCells.length >= this.ms.game.shipyardManager.maxFleet) {
          break;
        }
      }
    }
  }
  surrender() {
    this.ms.game.enemyManager.surrender();
  }
  getCellId(index: number, cell: any) {
    return cell.value;
  }
}
