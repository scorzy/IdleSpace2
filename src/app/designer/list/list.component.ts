import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ShipDesign } from "src/app/model/shipyard/shipDesign";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isLarge = true;
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public breakpointObserver: BreakpointObserver
  ) {}
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
          this.cd.markForCheck();
        })
    );
  }
  ngOnDestroy() {
    this.ms.innerContent = true;
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
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
