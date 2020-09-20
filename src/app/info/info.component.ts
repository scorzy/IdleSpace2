import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import {
  INSPIRATION_PERCENT,
  FLEET_CAPACITY,
  AUTOMATION_UNLOCKED_LEVEL
} from "../model/CONSTANTS";
import { MainService } from "../main.service";
import { ActivatedRoute } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  INSPIRATION_PERCENT = INSPIRATION_PERCENT;
  FLEET_CAPACITY = FLEET_CAPACITY;
  tabPosition = "left";
  AUTOMATION_UNLOCKED_LEVEL = AUTOMATION_UNLOCKED_LEVEL;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver
  ) {
    super(ms, cd);
  }
  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.breakpointObserver
        .observe(["(min-width: 599px)"])
        .subscribe((state: BreakpointState) => {
          this.tabPosition = state.matches ? "left" : "top";
          this.cd.markForCheck();
        })
    );
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (!this.breakpointObserver.isMatched("(min-width: 599px)")) {
      setTimeout(() => {
        this.tabPosition = "top";
        this.cd.markForCheck();
      });
    }
  }
}
