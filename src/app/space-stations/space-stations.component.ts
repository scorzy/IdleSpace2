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
import { fadeIn } from "../animations";

@Component({
  selector: "app-space-stations",
  templateUrl: "./space-stations.component.html",
  styleUrls: ["./space-stations.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class SpaceStationsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  currentUnit: Unit;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.currentUnit = this.ms.game.resourceManager.spaceStations[0];
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
    this.ms.game.spaceStationManager.addJob(unit);
  }
  setDetails(unit: Unit) {
    this.currentUnit = unit;
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
  formatter(value: number): string {
    return `${value}%`;
  }
}
