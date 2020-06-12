import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { AutoWorker } from "src/app/model/automation/autoWorker";
import { INTERVALS } from "src/app/model/automation/intervals";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-auto-worker",
  templateUrl: "./auto-worker.component.html",
  styleUrls: ["./auto-worker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoWorkerComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() autoWorker: AutoWorker;
  INTERVALS = INTERVALS;

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
