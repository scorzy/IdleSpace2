import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { FleetShips } from "../model/shipyard/fleetShips";
import { fadeIn } from "../animations";

@Component({
  selector: "app-shipyard",
  templateUrl: "./shipyard.component.html",
  styleUrls: ["./shipyard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class ShipyardComponent implements OnInit, OnDestroy {
  fleetNum = 0;
  fleetNames = [];
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fleetNames = ["Fleet 1", "Fleet 2", "Fleet 3", "Fleet 4", "Fleet 5"];
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.ms.game.reloadNavalCapacity();
        this.cd.markForCheck();
      }),
      this.route.paramMap.subscribe(paramMap =>
        this.getFleet(paramMap.get("id"))
      )
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getFleet(id: string): void {
    this.fleetNum = parseInt(id, 10);
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.shipyardManager.toDo,
      event.previousIndex,
      event.currentIndex
    );
  }
  getDesignId(index: number, design: ShipDesign) {
    return design.id;
  }
  getNameId(index: number, name: string) {
    return index + name;
  }
  getFleetId(index: number, fleet: FleetShips) {
    return index;
  }
  confirm() {
    this.ms.game.shipyardManager.shipDesigns.forEach(des => {
      des.fleets.forEach(fl => {
        fl.navalCapPercent = fl.navalCapPercentUi;
      });
    });
  }
  reinforceAll() {
    this.ms.game.shipyardManager.reinforceAll();
  }
  reinforce(i: number) {
    this.ms.game.shipyardManager.reinforce(i);
  }
}
