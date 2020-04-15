import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-fleets-view",
  templateUrl: "./fleets-view.component.html",
  styleUrls: ["./fleets-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetsViewComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  fleets = [0, 1, 2, 3, 4, 5];
  constructor(ms: MainService, cd: ChangeDetectorRef) {
    super(ms, cd);
  }
  getEta(fleetNum: number): number {
    const ret =
      this.ms.game.enemyManager.fleetsInBattle[fleetNum].eta -
      performance.now();
    // console.log(ret);
    return ret > 0 ? ret : 0;
  }
}
