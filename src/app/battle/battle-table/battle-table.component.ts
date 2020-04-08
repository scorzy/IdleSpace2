import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Input
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { Enemy } from "src/app/model/enemy/enemy";

@Component({
  selector: "app-battle-table",
  templateUrl: "./battle-table.component.html",
  styleUrls: ["./battle-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() currentEnemy: Enemy;
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
  getNumId(index: number, num: number) {
    return "" + num + (this.currentEnemy ? this.currentEnemy.id : "");
  }
}
