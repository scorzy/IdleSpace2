import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ShipDesign } from "src/app/model/shipyard/shipDesign";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent
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
        .observe(["(min-width: 599px)"])
        .subscribe((state: BreakpointState) => {
          this.isLarge = state.matches;
          if (!this.isLarge) this.ms.designListCollapsed = false;
          this.cd.markForCheck();
        })
    );
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (!this.breakpointObserver.isMatched("(min-width: 599px)")) {
      setTimeout(() => {
        this.ms.designListCollapsed = false;
      });
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.ms.innerContent = true;
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.shipyardManager.shipDesigns,
      event.previousIndex,
      event.currentIndex
    );
  }
  getDesignId(index: number, design: ShipDesign) {
    return index + "" + design.id;
  }
}
