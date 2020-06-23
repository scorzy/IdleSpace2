import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Research } from "../model/researches/research";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragStart,
  CdkDragEnd
} from "@angular/cdk/drag-drop";
import { IJobType } from "../model/data/iResearchData";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-laboratory",
  templateUrl: "./laboratory.component.html",
  styleUrls: ["./laboratory.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaboratoryComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  ngOnInit() {
    this.reloadUi();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.reloadUi();
        this.cd.markForCheck();
      })
    );
  }
  reloadUi() {
    this.ms.game.researchManager.technologies.forEach((t) =>
      t.bonus.reloadBonusUi()
    );
  }
  getResId(index: number, research: Research) {
    return research.id;
  }
  drop(event: CdkDragDrop<Research[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const res = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (event.container.id === "toDo" && res.exclusiveGroup) {
        let indexToRemove = 0;
        let n = 0;
        while (indexToRemove > -1 && n < 10) {
          n++;
          indexToRemove = this.ms.game.researchManager.toDo.findIndex(
            (r) => res.exclusiveGroup === r.exclusiveGroup && res !== r
          );
          if (indexToRemove > -1) {
            transferArrayItem(
              this.ms.game.researchManager.toDo,
              this.ms.game.researchManager.backlog,
              indexToRemove,
              0
            );
          }
        }
      }
    }
  }
  getTypeId(num: number, data: IJobType) {
    return data.id;
  }
  start(event: CdkDragStart) {
    this.ms.game.researchManager.drag = true;
  }
  end(event: CdkDragEnd) {
    this.ms.game.researchManager.drag = false;
  }
  sort() {
    this.ms.game.researchManager.sortJobs();
  }
}
