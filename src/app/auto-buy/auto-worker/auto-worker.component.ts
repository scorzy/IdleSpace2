import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { AutoWorker } from "src/app/model/automation/autoWorker";
import { INTERVALS } from "src/app/model/automation/intervals";

@Component({
  selector: "app-auto-worker",
  templateUrl: "./auto-worker.component.html",
  styleUrls: ["./auto-worker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoWorkerComponent implements OnInit {
  @Input() autoWorker: AutoWorker;
  INTERVALS = INTERVALS;

  constructor() {}

  ngOnInit(): void {}
  getIntervalId(index: number, interval: any) {
    return index;
  }
}
