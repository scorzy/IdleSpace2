import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  AfterViewInit
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { Enemy } from "src/app/model/enemy/enemy";
import { fadeIn } from "src/app/animations";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { OptionsService } from "src/app/options.service";

@Component({
  selector: "app-enemies-list",
  templateUrl: "./enemies-list.component.html",
  styleUrls: ["./enemies-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,

  animations: [fadeIn]
})
export class EnemiesListComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  isLarge = true;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public os: OptionsService,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver
  ) {
    super(ms, cd);
  }
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
          if (!this.isLarge) this.ms.enemyListCollapsed = false;
          this.cd.markForCheck();
        })
    );
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.ms.innerContent = true;
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
