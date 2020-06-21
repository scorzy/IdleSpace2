import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { INTERVALS } from "src/app/model/automation/intervals";

@Component({
  selector: "app-auto-fleet-up",
  templateUrl: "./auto-fleet-up.component.html",
  styleUrls: ["./auto-fleet-up.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoFleetUpComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS;

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
