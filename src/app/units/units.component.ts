import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";
import { ActivatedRoute } from "@angular/router";
import { fadeIn } from "../animations";

@Component({
  selector: "app-units",
  templateUrl: "./units.component.html",
  styleUrls: ["./units.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class UnitsComponent implements OnInit, OnDestroy {
  units = new Array<Unit>();

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.getUnits(this.route.params);
        this.cd.markForCheck();
      }),
      this.route.params.subscribe(this.getUnits.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getUnits(params: any) {
    const param = "" + params.id;
    switch (param) {
      case "b":
        this.units = this.ms.game.resouceManager.unlockedBuildings;
        break;
      default:
        this.units = this.ms.game.resouceManager.unlockedWorkers;
    }
  }

  getId(index: number, unit: Unit) {
    return unit.id;
  }
}
