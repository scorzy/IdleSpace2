import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-auto-refresh",
  templateUrl: "./auto-refresh.component.html",
  styleUrls: ["./auto-refresh.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoRefreshComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = [
    // {
    //   value: 1e3 * 10,
    //   label: "10 sec"
    // },
    {
      value: 1e3 * 3600,
      label: "1 hour"
    },
    {
      value: 2e3 * 3600,
      label: "2 hours"
    },
    {
      value: 4e4,
      label: "4 hours"
    }
  ];

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
