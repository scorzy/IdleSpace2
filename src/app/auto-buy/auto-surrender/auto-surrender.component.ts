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
  selector: "app-auto-surrender",
  templateUrl: "./auto-surrender.component.html",
  styleUrls: ["./auto-surrender.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoSurrenderComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS;

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
