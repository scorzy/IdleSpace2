import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { MainService } from "../main.service";
import { Challenge } from "../model/challenge/challenge";

@Component({
  selector: "app-challenge-list",
  templateUrl: "./challenge-list.component.html",
  styleUrls: ["./challenge-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeListComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  isLarge = true;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute,
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
        .observe(["(min-width: 699px)"])
        .subscribe((state: BreakpointState) => {
          this.isLarge = state.matches;
          if (!this.isLarge) this.ms.designListCollapsed = false;
          this.cd.markForCheck();
        })
    );
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (!this.breakpointObserver.isMatched("(min-width: 699px)")) {
      setTimeout(() => {
        this.ms.designListCollapsed = false;
      });
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.ms.innerContent = true;
  }
  getId(index: number, challenge: Challenge) {
    return challenge.id;
  }
}
