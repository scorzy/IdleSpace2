import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-shipyard",
  templateUrl: "./shipyard.component.html",
  styleUrls: ["./shipyard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipyardComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit() {}
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.shipyardManager.shipDesigns,
      event.previousIndex,
      event.currentIndex
    );
  }
  getDesignId(index: number, design: ShipDesign) {
    return design.id;
  }
}
