import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { Enemy } from "src/app/model/enemy/enemy";
import { Game } from "src/app/model/game";
import { fadeIn } from "src/app/animations";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-enemies-list",
  templateUrl: "./enemies-list.component.html",
  styleUrls: ["./enemies-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,

  animations: [fadeIn]
})
export class EnemiesListComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isLarge = true;
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.ms.innerContent = false;

    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.breakpointObserver
        .observe(["(min-width: 599px)"])
        .subscribe((state: BreakpointState) => {
          this.isLarge = state.matches;
          this.cd.markForCheck();
        })
    );
  }
  ngOnDestroy() {
    this.ms.innerContent = true;
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.enemyManager.enemies,
      event.previousIndex,
      event.currentIndex
    );
  }
  delete(enemy: Enemy) {
    this.ms.game.enemyManager.enemies.splice(
      this.ms.game.enemyManager.enemies.indexOf(enemy),
      1
    );
  }

  getEnemyId(index: number, enemy: Enemy) {
    return enemy.id;
  }
}
