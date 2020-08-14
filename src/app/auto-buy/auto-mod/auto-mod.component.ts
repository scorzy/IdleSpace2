import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  Input
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { AutoWorker } from "src/app/model/automation/autoWorker";
import { INTERVALS } from "src/app/model/automation/intervals";
import { AutoMod } from "src/app/model/automation/autoMod";

@Component({
  selector: "app-auto-mod",
  templateUrl: "./auto-mod.component.html",
  styleUrls: ["./auto-mod.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoModComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() autoMod: AutoMod;
  INTERVALS = INTERVALS;

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
