import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";

@Component({
  selector: "app-fleets-view",
  templateUrl: "./fleets-view.component.html",
  styleUrls: ["./fleets-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetsViewComponent implements OnInit {
  fleets = [0, 1, 2, 3, 4, 5];
  private subscriptions: Subscription[] = [];
  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getEta(fleetNum: number): number {
    const ret =
      this.ms.game.enemyManager.fleetsInBattle[fleetNum].eta -
      performance.now();
    // console.log(ret);
    return ret > 0 ? ret : 0;
  }
}
