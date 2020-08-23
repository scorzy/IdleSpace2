import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { ZERO } from "../model/CONSTANTS";
import { Enemy } from "../model/enemy/enemy";

@Component({
  selector: "app-ships-view",
  templateUrl: "./ships-view.component.html",
  styleUrls: ["./ships-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipsViewComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() designs: ShipDesign[];
  @Input() isEnemy = false;
  @Input() enemyCell = false;
  @Input() fleetNum = 0;
  @Input() nzSize = "middle";
  @Input() update = false;
  @Input() enemy: Enemy;
  mapOfExpandData: { [key: string]: boolean } = {};
  ngOnInit() {
    if (this.update) {
      this.subscriptions.push(
        this.ms.updateEmitter.subscribe(() => {
          this.cd.markForCheck();
        })
      );
    }
  }
  getQuantity(design: ShipDesign, index: number): number {
    return this.isEnemy
      ? this.enemyCell && this.fleetNum >= 0
        ? this.ms.game.enemyManager.currentEnemy.cells[this.fleetNum].ships[
            index
          ]
        : design.enemyQuantity
      : design.fleets[this.fleetNum].shipsQuantity;
  }
  getAntiMissiles(): Decimal {
    if (!this.enemy) return ZERO;

    return this.enemyCell && this.fleetNum >= 0
      ? this.ms.game.enemyManager.currentEnemy.cells[this.fleetNum].antiMissiles
      : this.enemy.antiMissiles;
  }
  getDesignId(index: number, design: ShipDesign) {
    return design.id;
  }
}
