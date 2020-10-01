import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { INTERVALS } from "src/app/model/automation/intervals";
import { StationAutoBuyTypes } from "src/app/model/automation/spaceStationAutoBuyer";

@Component({
  selector: "app-auto-space",
  templateUrl: "./auto-space.component.html",
  styleUrls: ["./auto-space.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoSpaceComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS;
  StationAutoBuyTypes = StationAutoBuyTypes;

  getIntervalId(index: number, interval: any) {
    return index;
  }
  buildingAutoBuyChange() {
    this.ms.game.automationManager.spaceStationAutoBuyer.on =
      this.ms.game.automationManager.spaceStationAutoBuyer.autoBuyType !==
      StationAutoBuyTypes.OFF;
  }
}
