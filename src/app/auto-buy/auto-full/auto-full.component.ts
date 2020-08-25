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
  selector: "app-auto-full",
  templateUrl: "./auto-full.component.html",
  styleUrls: ["./auto-full.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoFullComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS.filter((int) => int.value > 1e3);
  getIntervalId(index: number, interval: any) {
    return index;
  }
}
