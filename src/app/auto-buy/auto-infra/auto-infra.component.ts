import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { InfrastructureAutoBuyTypes } from "src/app/model/automation/infrastructureAutoBuyer";
import { INTERVALS } from "src/app/model/automation/intervals";

@Component({
  selector: "app-auto-infra",
  templateUrl: "./auto-infra.component.html",
  styleUrls: ["./auto-infra.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoInfraComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS;
  InfrastructureAutoBuyTypes = InfrastructureAutoBuyTypes;

  getIntervalId(index: number, interval: any) {
    return index;
  }
  buildingAutoBuyChange() {
    this.ms.game.automationManager.autoInfrastructure.on =
      this.ms.game.automationManager.autoInfrastructure.autoBuyType !==
      InfrastructureAutoBuyTypes.OFF;
  }
}
