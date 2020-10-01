import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Job } from "../model/job/job";
import { Research } from "../model/researches/research";
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.scss"]
})
export class JobComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() job: Job;
  @Input() collection: Job[];
  @Input() showDescription = true;
  isResearch = false;
  research: Research;
  totalResearchBonus: Decimal;
  ngOnInit() {
    this.job.reloadUi();
    if (this.job instanceof Research) {
      this.research = this.job;
    }

    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.job.reloadUi();
        this.cd.markForCheck();
      })
    );
  }
  moveUp() {
    moveItemInArray(
      this.collection,
      this.collection.findIndex((e) => e === this.job),
      0
    );
  }
  moveDown() {
    moveItemInArray(
      this.collection,
      this.collection.findIndex((e) => e === this.job),
      this.collection.length - 1
    );
  }
}
