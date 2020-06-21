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
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SearchJob } from "src/app/model/enemy/searchJob";
import { SearchOption, SearchRange } from "src/app/model/enemy/searchOption";
import { ZERO, MAX_SEARCH_JOB } from "src/app/model/CONSTANTS";
import { Unit } from "src/app/model/units/unit";
import { Enemy } from "src/app/model/enemy/enemy";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  MAX_SEARCH_JOB = MAX_SEARCH_JOB;
  searchLevel = 0;
  expectedPrice = ZERO;
  expectedTiles: { unit: Unit; range: SearchRange }[];
  fleetPowerRange: SearchRange = new SearchRange();
  minDistance = ZERO;
  maxDistance = ZERO;
  pointBalance = 0;
  constructor(
    ms: MainService,
    cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super(ms, cd);
    this.expectedTiles = [
      {
        unit: this.ms.game.resourceManager.habitableSpace,
        range: { min: 0, max: 0 }
      },
      {
        unit: this.ms.game.resourceManager.miningDistrict,
        range: { min: 0, max: 0 }
      },
      {
        unit: this.ms.game.resourceManager.energyDistrict,
        range: { min: 0, max: 0 }
      },
      {
        unit: this.ms.game.resourceManager.science,
        range: { min: 0, max: 0 }
      },
      {
        unit: this.ms.game.resourceManager.components,
        range: { min: 0, max: 0 }
      }
    ];
  }
  ngOnInit() {
    this.reload();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  search() {
    this.ms.game.enemyManager.search(this.searchLevel);
  }
  getJobId(index: number, searchJob: SearchJob) {
    return searchJob.id;
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.ms.game.enemyManager.toDo,
      event.previousIndex,
      event.currentIndex
    );
  }
  getOptId(index: number, opt: SearchOption) {
    return opt.id;
  }
  reset() {
    this.ms.game.enemyManager.searchOptions.forEach((so) => {
      so.quantity = 0;
    });
    this.reload();
  }
  reload() {
    this.pointBalance =
      this.ms.game.enemyManager.habitabilityOpt.quantity +
      this.ms.game.enemyManager.difficultyOpt.quantity * -1 +
      this.ms.game.enemyManager.distanceOpt.quantity * -1 +
      this.ms.game.enemyManager.energyOpt.quantity +
      this.ms.game.enemyManager.metalOpt.quantity +
      this.ms.game.enemyManager.scienceOpt.quantity +
      this.ms.game.enemyManager.componentOpt.quantity;
    this.expectedPrice = SearchJob.getPrice(
      this.searchLevel,
      this.pointBalance
    );

    this.expectedTiles[0].range = this.ms.game.enemyManager.habitabilityOpt.getRange();
    this.expectedTiles[1].range = this.ms.game.enemyManager.metalOpt.getRange();
    this.expectedTiles[2].range = this.ms.game.enemyManager.energyOpt.getRange();
    this.expectedTiles[3].range = this.ms.game.enemyManager.scienceOpt.getRange();
    this.expectedTiles[4].range = this.ms.game.enemyManager.componentOpt.getRange();
    this.fleetPowerRange = this.ms.game.enemyManager.difficultyOpt.getRange();
    const distanceRange = Enemy.getDistance(
      this.searchLevel,
      this.ms.game.enemyManager.distanceOpt.quantity
    );
    this.minDistance = distanceRange.min;
    this.maxDistance = distanceRange.max;
  }
  getExpTileId(index: number, tile: { unit: Unit; range: SearchRange }) {
    return tile.unit.id;
  }
}
