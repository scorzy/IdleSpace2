import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { MainService } from "../main.service";
import { ActivatedRoute } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  tabPosition = "left";
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
