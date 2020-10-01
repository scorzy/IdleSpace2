import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";
import { ActivatedRoute } from "@angular/router";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { OptionsService } from "../options.service";
import { trigger } from "@angular/animations";

@Component({
  selector: "app-units",
  templateUrl: "./units.component.html",
  styleUrls: ["./units.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger("noop", [])]
})
export class UnitsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public get units(): Array<Unit> {
    if (this.param === "b") {
      return this.ms.game.resourceManager.unlockedBuildings;
    } else return this.ms.game.resourceManager.unlockedWorkers;
  }
  param = "";
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public os: OptionsService,
    private route: ActivatedRoute
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.route.params.subscribe(this.getUnits.bind(this))
    );
  }
  getUnits(params: any) {
    this.param = "" + params.id;
  }
  getId(index: number, unit: Unit) {
    return unit.id;
  }
  closeOperativityInfo() {
    this.os.operativityInfo = false;
  }
  closeDistrictInfo() {
    this.os.districtInfo = false;
  }
}
