import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { MainService } from "../main.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-ships-view",
  templateUrl: "./ships-view.component.html",
  styleUrls: ["./ships-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipsViewComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  @Input() designs: ShipDesign[];
  @Input() isEnemy = false;
  @Input() enemyCell = false;
  @Input() fleetNum = 0;
  @Input() nzSize = "middle";
  @Input() update = false;
  mapOfExpandData: { [key: string]: boolean } = {};

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.update) {
      this.subscriptions.push(
        this.ms.updateEmitter.subscribe(() => {
          this.cd.markForCheck();
        })
      );
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
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
  getDesignId(index: number, design: ShipDesign) {
    return design.id;
  }
}
