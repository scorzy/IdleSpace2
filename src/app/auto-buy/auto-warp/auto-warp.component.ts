import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { INTERVALS } from "src/app/model/automation/intervals";

@Component({
  selector: "app-auto-warp",
  templateUrl: "./auto-warp.component.html",
  styleUrls: ["./auto-warp.component.scss"]
})
export class AutoWarpComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INTERVALS = INTERVALS;

  getIntervalId(index: number, interval: any) {
    return index;
  }
}
