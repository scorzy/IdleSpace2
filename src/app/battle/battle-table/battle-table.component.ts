import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-battle-table",
  templateUrl: "./battle-table.component.html",
  styleUrls: ["./battle-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
