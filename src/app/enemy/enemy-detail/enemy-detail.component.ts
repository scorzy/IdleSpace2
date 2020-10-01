import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Enemy, ExtraTile } from "src/app/model/enemy/enemy";
import { MainService } from "src/app/main.service";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-enemy-detail",
  templateUrl: "./enemy-detail.component.html",
  styleUrls: ["./enemy-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemyDetailComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() enemy: Enemy;

  constructor(
    ms: MainService,
    private route: ActivatedRoute,
    cd: ChangeDetectorRef,
    private router: Router
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.subscriptions.push(
      this.route.paramMap.subscribe((paramMap) => {
        this.getEnemy(paramMap.get("id"));
        this.cd.markForCheck();
      })
    );
  }
  getEnemy(idString: string) {
    const id = parseInt(idString, 10);
    this.enemy = this.ms.game.enemyManager.enemies.find((e) => e.id === id);
    if (!this.enemy) this.enemy = this.ms.game.enemyManager.enemies[0];
  }
  attack() {
    if (this.ms.game.enemyManager.attackEnemy(this.enemy)) {
      this.router.navigate(["/battle"]);
    }
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
      } else this.router.navigate(["/enemyList/search"]);
    }
  }
  getTileId(index: number, tile: ExtraTile) {
    return tile.unit.id + index;
  }
}
