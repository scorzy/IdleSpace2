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
import { ZERO, FLEET_NUMBER } from "../model/CONSTANTS";

@Component({
  selector: "app-fleets-view",
  templateUrl: "./fleets-view.component.html",
  styleUrls: ["./fleets-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetsViewComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  fleets = [0, 1, 2, 3, 4];
  cargo = new Array<Decimal>();
  lab = new Array<Decimal>();
  constructor(ms: MainService, cd: ChangeDetectorRef) {
    super(ms, cd);
    this.cargo = [ZERO, ZERO, ZERO, ZERO, ZERO];
    this.lab = [ZERO, ZERO, ZERO, ZERO, ZERO];
  }
  ngOnInit() {
    this.setStats();

    super.ngOnInit();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe((n) => {
        this.setStats();
      })
    );
  }
  setStats() {
    for (let i = 0; i < FLEET_NUMBER; i++) {
      const newCargo = this.ms.game.enemyManager.getCargo(i, true);
      const newLab = this.ms.game.enemyManager.getLab(i, true);
      if (!this.cargo[i].eq(newCargo)) this.cargo[i] = newCargo;
      if (!this.lab[i].eq(newLab)) this.lab[i] = newLab;
    }
  }
  getEta(fleetNum: number): number {
    const ret =
      this.ms.game.enemyManager.fleetsInBattle[fleetNum].eta -
      performance.now();
    return ret > 0 ? ret : 0;
  }
}
