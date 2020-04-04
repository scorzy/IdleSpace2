import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { FLEET_NUMBER, ZERO } from "../model/CONSTANTS";
import { Cell } from "../model/enemy/cell";

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  fleetNum = 0;
  cell = 0;
  activeCells = new Array<{ label: string; value: number }>();
  needNuke = ZERO;
  nukePercent = 0;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.selectActiveCells();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.selectActiveCells();
        const cellNuke = this.findNextNuke();
        if (cellNuke) {
          this.needNuke = cellNuke.getNuke();
          this.nukePercent = this.ms.game.resourceManager.nuke.quantity
            .div(this.needNuke)
            .min(1)
            .toNumber();
        }
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
          value: cell.index,
        });
        if (this.activeCells.length >= this.ms.game.shipyardManager.maxFleet) {
          break;
        }
      }
    }
    if (
      this.cell > -1 &&
      this.activeCells.findIndex((c) => c.value === this.cell) < 0
    ) {
      this.cell = this.activeCells[0].value;
    }
  }
  surrender() {
    this.ms.game.enemyManager.surrender();
  }
  getCellId(index: number, cell: any) {
    return cell.value;
  }
  findNextNuke(): Cell {
    if (!this.ms.game.enemyManager.currentEnemy) return null;
    return this.ms.game.enemyManager.currentEnemy.cells.find((c) => {
      if (c.done) return false;
      let ret = false;
      for (
        let i = 0, n = this.ms.game.enemyManager.currentEnemy.designs.length;
        i < n;
        i++
      ) {
        if (
          c.ships[i] > 0 &&
          this.ms.game.enemyManager.currentEnemy.designs[i].isDefence
        ) {
          ret = true;
        }
      }
      return ret;
    });
  }
  nuke() {
    const cell = this.findNextNuke();
    if (cell) {
      this.ms.game.enemyManager.nuke(cell.index);
    }
  }
}
