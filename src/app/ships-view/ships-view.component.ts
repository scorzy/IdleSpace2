import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { ShipDesign } from "../model/shipyard/shipDesign";

@Component({
  selector: "app-ships-view",
  templateUrl: "./ships-view.component.html",
  styleUrls: ["./ships-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipsViewComponent implements OnInit {
  @Input() designs: ShipDesign[];
  @Input() isEnemy = false;
  @Input() fleetNum = 0;
  mapOfExpandData: { [key: string]: boolean } = {};

  constructor() {}

  ngOnInit() {}

  getQuantity(design: ShipDesign): number {
    return this.isEnemy
      ? design.enemyQuantity
      : design.fleets[this.fleetNum].shipsQuantity;
  }

  getDesignId(index: number, design: ShipDesign) {
    return design.id;
  }
}
