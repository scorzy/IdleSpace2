import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { FLEET_NUMBER, ZERO } from "../model/CONSTANTS";
import { Cell } from "../model/enemy/cell";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  fleetNum = 0;
  cell = 0;
  activeCells = new Array<{ label: string; value: number }>();
  needNuke = ZERO;
  nukePercent = 0;
  autoAttackOptions = false;
  expGain = ZERO;
  darkMatterGain = ZERO;

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
        this.reload();
        this.cd.markForCheck();
      })
    );
  }
  reload() {
    if (!this.ms.game.enemyManager.currentEnemy) {
      this.expGain = ZERO;
      this.darkMatterGain = ZERO;
    } else {
      const newExpGain = this.ms.game.enemyManager.getExperience(
        this.ms.game.enemyManager.currentEnemy.level
      );
      if (!newExpGain.eq(this.expGain)) this.expGain = newExpGain;

      const newDm = this.ms.game.enemyManager.getDarkMatter();
      if (!newDm.eq(this.darkMatterGain)) this.darkMatterGain = newDm;
    }
  }
  attack(num = -1) {
    for (
      let i = 0, n = this.ms.game.shipyardManager.shipDesigns.length;
      i < n;
      i++
    ) {
      this.ms.game.shipyardManager.shipDesigns[i].battleTime = -1;
    }
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
      if (cell.enemyStrength > 0) {
        this.activeCells.push({
          label: "" + (1 + cell.index),
          value: cell.index
        });
        if (this.activeCells.length >= FLEET_NUMBER) {
          break;
        }
      }
    }
    if (
      this.cell > -1 &&
      this.activeCells.length > 0 &&
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
      if (c.enemyStrength <= 0) return false;
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
