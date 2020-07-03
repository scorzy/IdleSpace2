import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { PrestigeCard } from "../model/prestige/prestigeCard";
import { MainService } from "../main.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-cards",
  templateUrl: "./cards.component.html",
  styleUrls: ["./cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnInit {
  available: Array<PrestigeCard>;
  inUse: Array<PrestigeCard>;
  constructor(public ms: MainService) {}

  ngOnInit(): void {
    this.available = this.ms.game.prestigeManager.cards.filter(
      (c) => !c.active
    );
    this.inUse = this.ms.game.prestigeManager.cards.filter((c) => c.active);
  }
  getCardId(index: number, card: PrestigeCard) {
    return card.id;
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
