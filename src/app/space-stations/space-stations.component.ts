import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";
import { SpaceStationJob } from "../model/space/spaceStationJob";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Subscription } from "rxjs";

@Component({
  selector: "app-space-stations",
  templateUrl: "./space-stations.component.html",
  styleUrls: ["./space-stations.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpaceStationsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  addStation(unit: Unit) {
    if (!unit) return false;
    const job = new SpaceStationJob(unit);
    this.ms.game.spaceStationManager.toDo.push(job);
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.spaceStationManager.toDo,
      event.previousIndex,
      event.currentIndex
    );
    this.ms.game.spaceStationManager.postUpdate();
  }
  getUnitId(index: number, unit: Unit) {
    return unit.id;
  }
}
