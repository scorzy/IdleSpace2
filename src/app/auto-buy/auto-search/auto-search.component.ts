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
  selector: "app-auto-search",
  templateUrl: "./auto-search.component.html",
  styleUrls: ["./auto-search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoSearchComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS;

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
