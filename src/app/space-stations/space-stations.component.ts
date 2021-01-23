import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Unit } from "../model/units/unit";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { UNIT_TYPES } from "../model/data/units";
import { trigger } from "@angular/animations";
import { AbstractSpaceStation } from "../model/units/abstractSpaceStation";

@Component({
  selector: "app-space-stations",
  templateUrl: "./space-stations.component.html",
  styleUrls: ["./space-stations.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger("noop", [])]
})
export class SpaceStationsComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  sortName: string | null = "id";
  sortValue: string | null = "ascend";
  listOfStations: Unit[];
  megaQueue = 0;
  ngOnInit() {
    this.search();
    this.reloadMegaQueue();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.reloadMegaQueue();
        this.cd.markForCheck();
      })
    );
  }
  addStation(unit: AbstractSpaceStation) {
    if (!unit) return false;
    this.ms.game.spaceStationManager.addJob(unit);
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
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  search() {
    /* eslint-disable */
    if (this.ms.game.resourceManager.unlockedSpaceStations.length < 1) return;
    if (this.sortName && this.sortValue) {
      if (
        this.ms.game.resourceManager.unlockedSpaceStations[0][
          this.sortName!
        ] instanceof Decimal
      ) {
        this.listOfStations = this.ms.game.resourceManager.unlockedSpaceStations
          .slice()
          .sort((a, b) =>
            this.sortValue === "ascend"
              ? a[this.sortName!].cmp(b[this.sortName!])
              : b[this.sortName!].cmp(a[this.sortName!])
          );
      } else {
        this.listOfStations = this.ms.game.resourceManager.unlockedSpaceStations
          .slice()
          .sort((a, b) =>
            this.sortValue === "ascend"
              ? a[this.sortName!] > b[this.sortName!]
                ? 1
                : -1
              : b[this.sortName!] > a[this.sortName!]
              ? 1
              : -1
          );
      }
    }
    /* eslint-enable */
  }
  reloadMegaQueue() {
    this.megaQueue = 0;
    for (
      let i = 0, n = this.ms.game.spaceStationManager.toDo.length;
      i < n;
      i++
    ) {
      if (
        this.ms.game.spaceStationManager.toDo[i].spaceStation.unitData
          .unitType === UNIT_TYPES.MEGASTRUCTURE
      ) {
        this.megaQueue++;
      }
    }
  }
}
