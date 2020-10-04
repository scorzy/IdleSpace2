import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-speed-stats",
  templateUrl: "./speed-stats.component.html",
  styleUrls: ["./speed-stats.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeedStatsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {}
