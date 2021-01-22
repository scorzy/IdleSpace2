import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { MainService } from "src/app/main.service";
import { Unit } from "src/app/model/units/unit";
import { OptionsService } from "src/app/options.service";
import { Worker } from "src/app/model/units/worker";
import { Building } from "src/app/model/units/building";

@Component({
  selector: "app-unit-tabs",
  templateUrl: "./unit-tabs.component.html",
  styleUrls: ["./unit-tabs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitTabsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  unitId = "";
  unit: Unit;
  hasMods = false;
  worker: Worker;
  hasDepartments = false;
  building: Building;
  options = false;
  buyString = "Max";

  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public os: OptionsService,
    private route: ActivatedRoute
  ) {
    super(ms, cd);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(this.getUnits.bind(this))
    );
  }
  getUnits(params: any) {
    this.unitId = params.id;
    this.unit = this.ms.game.resourceManager.units.find(
      // eslint-disable-next-line eqeqeq
      (u) => u.id == this.unitId
    );
    this.hasMods = false;
    this.worker = null;
    this.hasDepartments = false;
    this.building = null;
    if (this.unit instanceof Worker) {
      this.worker = this.unit;
      this.hasMods = !!this.unit.modStack;
      this.building = this.worker.relativeBuilding;
      if (this.building) {
        this.hasDepartments = this.building?.departments?.length > 0;
      }
    }
  }
  setCustomBuy(fixed: boolean, num: number, text: string) {
    this.ms.game.buyFixed = fixed;
    if (this.ms.game.buyFixed) {
      this.ms.game.customBuy = new Decimal(num);
    } else {
      this.ms.game.customBuyPercent = num;
    }
    this.buyString = text;
  }
  open(): void {
    this.options = true;
  }

  close(): void {
    this.options = false;
  }
}
