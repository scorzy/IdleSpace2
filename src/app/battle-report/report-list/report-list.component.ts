import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { FLEET_NUMBER } from "src/app/model/CONSTANTS";

@Component({
  selector: "app-report-list",
  templateUrl: "./report-list.component.html",
  styleUrls: ["./report-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportListComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  listOfFleets: Array<{ label: string; value: string }> = [];
  ngOnInit() {
    this.ms.game.updateStats = false;
    super.ngOnInit();
    for (let i = 0; i < FLEET_NUMBER; i++) {
      this.listOfFleets.push({
        label: "Fleet " + (1 + i),
        value: "" + i
      });
    }
  }
  ngOnDestroy() {
    this.ms.game.updateStats = true;
    super.ngOnDestroy();
  }
}
