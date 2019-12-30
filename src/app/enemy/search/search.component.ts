import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SearchJob } from "src/app/model/enemy/searchJob";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  searchLevel = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

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

  search() {
    const searchJob = new SearchJob();
    searchJob.enemyLevel = this.searchLevel;
    searchJob.init();
    this.ms.game.enemyManager.toDo.push(searchJob);
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
}
