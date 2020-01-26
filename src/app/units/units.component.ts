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
  public get units(): Array<Unit> {
    if (this.param === "b")
      return this.ms.game.resourceManager.unlockedBuildings;
    else return this.ms.game.resourceManager.unlockedWorkers;
  }

  param = "";

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.route.params.subscribe(this.getUnits.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getUnits(params: any) {
    this.param = "" + params.id;
  }
  getId(index: number, unit: Unit) {
    return unit.id;
  }
}
