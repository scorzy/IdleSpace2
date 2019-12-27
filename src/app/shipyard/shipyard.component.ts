import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-shipyard",
  templateUrl: "./shipyard.component.html",
  styleUrls: ["./shipyard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipyardComponent implements OnInit {
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
  getFleet(id: string): void {
    this.fleetNum = parseInt(id, 10);
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.shipyardManager.shipDesigns,
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
  confirm() {
    this.ms.game.shipyardManager.shipDesigns.forEach(des => {
      des.fleets.forEach(fl => {
        fl.navalCapPercent = fl.navalCapPercentUi;
      });
    });
  }
  reinforce() {
    this.ms.game.shipyardManager.reinforce();
  }
}
