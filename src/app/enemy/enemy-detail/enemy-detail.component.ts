import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Enemy } from "src/app/model/enemy/enemy";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-enemy-detail",
  templateUrl: "./enemy-detail.component.html",
  styleUrls: ["./enemy-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemyDetailComponent implements OnInit, OnDestroy {
  @Input() enemy: Enemy;

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe(paramMap => {
        this.getEnemy(paramMap.get("id"));
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getEnemy(idString: string) {
    const id = parseInt(idString, 10);
    this.enemy = this.ms.game.enemyManager.enemies.find(e => e.id === id);
    if (!this.enemy) this.enemy = this.ms.game.enemyManager.enemies[0];
  }
  attack() {
    this.ms.game.enemyManager.attackEnemy(this.enemy);
  }
  delete() {
    const id = this.ms.game.enemyManager.enemies.indexOf(this.enemy);
    this.ms.game.enemyManager.enemies.splice(id, 1);
    if (id > 0) {
      this.router.navigate([
        "/enemyList/enemyDetail/" + this.ms.game.enemyManager.enemies[id - 1].id
      ]);
    } else {
      if (this.ms.game.enemyManager.enemies.length > 0) {
        this.router.navigate([
          "/enemyList/enemyDetail/" + this.ms.game.enemyManager.enemies[0].id
        ]);
      } else this.router.navigate(["/search"]);
    }
  }
}
