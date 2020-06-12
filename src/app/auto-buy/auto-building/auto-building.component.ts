import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  AutoBuilding,
  BuildingAutoBuyTypes
} from "src/app/model/automation/autoBuilding";
import { INTERVALS } from "src/app/model/automation/intervals";

@Component({
  selector: "app-auto-building",
  templateUrl: "./auto-building.component.html",
  styleUrls: ["./auto-building.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoBuildingComponent implements OnInit {
  @Input() autoBuilding: AutoBuilding;
  BuildingAutoBuyTypes = BuildingAutoBuyTypes;
  INTERVALS = INTERVALS;

  constructor() {}

  ngOnInit(): void {}

  getIntervalId(index: number, interval: any) {
    return index;
  }
  buildingAutoBuyChange() {
    this.autoBuilding.on =
      this.autoBuilding.autoBuyType !== BuildingAutoBuyTypes.OFF;
  }
}
