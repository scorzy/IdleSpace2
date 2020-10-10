import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Unit } from "src/app/model/units/unit";
import { MainService } from "src/app/main.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Router, ActivatedRoute } from "@angular/router";
import { Building } from "src/app/model/units/building";
import { IDS } from "src/app/model/CONSTANTS";
import { OptionsService } from "src/app/options.service";

@Component({
  selector: "app-unit-detail",
  templateUrl: "./unit-detail.component.html",
  styleUrls: ["./unit-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitDetailComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Unit;
  @Input() building: Building;
  @Input() storage: Building;
  Number = Number;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public os: OptionsService,
    private modalService: NzModalService,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(ms, cd);
  }
  ngOnInit(): void {
    this.unit = this.ms.game.resourceManager.unlockedUnits[0];
    this.getUnits(this.route.snapshot.params);
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.route.params.subscribe(this.getUnits.bind(this))
    );
  }
  getUnits(params: any) {
    this.unit = this.ms.game.resourceManager.units.find(
      // tslint:disable-next-line:triple-equals
      (u) => u.id == params.id
    );
    if (!this.unit) this.unit = this.ms.game.resourceManager.unlockedUnits[0];
    this.ms.lastUnitId = this.unit.id;

    this.building = null;
    this.storage = null;
    switch (this.unit.id) {
      case IDS.Miner:
        this.building = this.ms.game.resourceManager.mine;
        break;
      case IDS.Technician:
        this.building = this.ms.game.resourceManager.powerPlant;
        this.storage = this.ms.game.resourceManager.batteries;
        break;
      case IDS.Scientist:
        this.building = this.ms.game.resourceManager.laboratory;
        break;
      case IDS.Metallurgist:
        this.building = this.ms.game.resourceManager.foundry;
        break;
      case IDS.Worker:
        this.building = this.ms.game.resourceManager.factory;
        break;
      case IDS.Searcher:
        this.building = this.ms.game.resourceManager.observatory;
        break;
      case IDS.Replicator:
        this.building = this.ms.game.resourceManager.droneFactory;
        this.storage = this.ms.game.resourceManager.droneDepot;
        break;
      case IDS.NukeSpecialist:
        this.building = this.ms.game.resourceManager.nukeFactory;
        this.storage = this.ms.game.resourceManager.nukeSilos;
        break;
    }
  }
  closeOperativityInfo() {
    this.os.operativityInfo = false;
  }
  closeDistrictInfo() {
    this.os.districtInfo = false;
  }
}
