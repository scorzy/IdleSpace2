import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Unit } from "../model/units/unit";

@Component({
  selector: "app-unit-list",
  templateUrl: "./unit-list.component.html",
  styleUrls: ["./unit-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitListComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  isLarge = true;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    public os: OptionsService,
    private route: ActivatedRoute,
    private router: Router,
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
  navigate(id: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id },
      queryParamsHandling: "merge" // remove to replace all query params by provided
    });
  }
  getId(index: number, unit: Unit) {
    return unit.id;
  }
  getListId(index: number, sub: any) {
    return index;
  }
  getWidth(): string {
    const pageW = window.innerWidth;
    if (pageW > 599) {
      return "300px";
    } else {
      return pageW + "px";
    }
  }
}
