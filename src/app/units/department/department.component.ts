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
import { Building, Department } from "src/app/model/units/building";
import { MainService } from "src/app/main.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() building: Building;
  isLarge = true;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe((n) => {
        this.cd.markForCheck();
      }),
      this.route.paramMap.subscribe((paramMap: ParamMap) =>
        this.getUnit(paramMap.get("id"))
      ),
      this.breakpointObserver
        .observe(["(min-width: 899px)"])
        .subscribe((state: BreakpointState) => {
          this.isLarge = state.matches;
          this.cd.markForCheck();
        })
    );
  }
  getUnit(id: string) {
    this.building = this.ms.game.resourceManager.buildings.find(
      (u) => id === u.id
    );
    this.cd.markForCheck();
  }
  getDepId(index: number, department: Department) {
    return department.id;
  }
}
