import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MegaStructure } from "src/app/model/units/megaStructure";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-auto-mega",
  templateUrl: "./auto-mega.component.html",
  styleUrls: ["./auto-mega.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoMegaComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  maxQueue = 20;
  ngOnInit(): void {
    // Nothing
  }
  ngOnDestroy(): void {
    this.ms.game.automationManager.autoMega.megaQueue = this.ms.game.automationManager.autoMega.megaQueue.filter(
      (q) => q.mega && q.quantity > 0
    );
    super.ngOnDestroy();
  }
  add() {
    if (
      this.ms.game.automationManager.autoMega.megaQueue.length > this.maxQueue
    ) {
      return false;
    }

    this.animationDisabled = true;
    this.ms.game.automationManager.autoMega.megaQueue.push({
      mega: null,
      quantity: 1
    });
    setTimeout(() => {
      this.animationDisabled = false;
    });
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  drop(event: CdkDragDrop<{}>) {
    moveItemInArray(
      this.ms.game.automationManager.autoMega.megaQueue,
      event.previousIndex,
      event.currentIndex
    );
  }
  getMegaId(index: number, mega: MegaStructure) {
    return mega.id;
  }
  getQId(index: number, megaQ: any) {
    return megaQ.mega ? megaQ.mega.id : index;
  }
  delete(mq: any) {
    this.ms.game.automationManager.autoMega.megaQueue = this.ms.game.automationManager.autoMega.megaQueue.filter(
      (q) => q !== mq
    );
  }
}
