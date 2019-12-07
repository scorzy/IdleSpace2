import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";
import { ShipDesign } from "src/app/model/shipyard/shipDesign";

@Component({
  selector: "app-design-list",
  templateUrl: "./design-list.component.html",
  styleUrls: ["./design-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignListComponent implements OnInit {
  isCollapsed = true;
  constructor(public ms: MainService) {}

  ngOnInit() {}

  getDesignId(index: number, shipDesign: ShipDesign) {
    return shipDesign.id;
  }
}
