import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { MainService } from "../main.service";

@Component({
  selector: "app-ships-view",
  templateUrl: "./ships-view.component.html",
  styleUrls: ["./ships-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipsViewComponent implements OnInit {
  @Input() designs: ShipDesign[];
  @Input() isEnemy = false;
  @Input() enemyCell = false;
  @Input() fleetNum = 0;
  @Input() nzSize = "middle";
  mapOfExpandData: { [key: string]: boolean } = {};

  constructor(public ms: MainService) {}

  ngOnInit() {}

  getQuantity(design: ShipDesign, index: number): number {
    return this.isEnemy
      ? this.enemyCell
        ? !this.ms.game.enemyManager.fleetsInBattle[this.fleetNum]
          ? design.enemyQuantity
          : this.ms.game.enemyManager.fleetsInBattle[this.fleetNum].ships[index]
        : design.enemyQuantity
      : design.fleets[this.fleetNum].shipsQuantity;
  }
  getDesignId(index: number, design: ShipDesign) {
    return design.id;
  }
}
