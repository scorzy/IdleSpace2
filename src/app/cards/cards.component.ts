import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit,
  EventEmitter
} from "@angular/core";
import { PrestigeCard } from "../model/prestige/prestigeCard";
import { MainService } from "../main.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList
} from "@angular/cdk/drag-drop";
import { Game } from "../model/game";
import { LEVEL_PER_CARD } from "../model/CONSTANTS";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import { Spell } from "../model/computing/spell";

@Component({
  selector: "app-cards",
  templateUrl: "./cards.component.html",
  styleUrls: ["./cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnInit, AfterViewInit {
  available: Array<PrestigeCard>;
  inUse: Array<PrestigeCard>;
  points = 0;
  LEVEL_PER_CARD = LEVEL_PER_CARD;
  nzOptions: NzCascaderOption[];
  favouriteModuleInUse = false;
  favouriteSpellInUse = false;
  favouriteModuleUi: [number, string] = [0, ""];
  @HostBinding("class.disable-animation") animationDisabled = true;
  constructor(public ms: MainService) {}

  ngOnInit(): void {
    this.available = this.ms.game.prestigeManager.cards.filter(
      (c) => !c.active
    );
    this.inUse = this.ms.game.prestigeManager.cards.filter((c) => c.active);
    if (this.ms.game.prestigeManager.favouriteModule) {
      this.favouriteModuleUi = [
        this.ms.game.prestigeManager.favouriteModule.groupId,
        this.ms.game.prestigeManager.favouriteModule.id
      ];
    }

    this.nzOptions = this.ms.game.shipyardManager.groups.map((group) => ({
      value: group.id,
      label: group.name,
      group,
      children: group.all
        .filter((mod) => mod.unlocked)
        .map((mod) => ({
          value: mod.id,
          label: mod.name,
          mod,
          isLeaf: true
        }))
    }));

    this.reloadPoints();
    this.reloadFavourite();
    for (let i = 0, n = this.ms.game.prestigeManager.cards.length; i < n; i++) {
      this.ms.game.prestigeManager.cards[
        i
      ].selected = this.ms.game.prestigeManager.cards[i].active;
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.animationDisabled = false;
    });
  }
  reloadPoints() {
    this.points = this.inUse.reduce((p, c) => p + c.cardRequired, 0);
  }
  getCardId(index: number, card: PrestigeCard) {
    return card.id;
  }
  drop(event: CdkDragDrop<PrestigeCard[]>) {
    const card = event.previousContainer.data[event.previousIndex];
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
    this.reloadPoints();
    this.reloadFavourite();
    card.selected = this.inUse.some((c) => c === card);
    this.ms.cardChangeEmitter.next(Date.now());
  }
  maxPredicate(item: CdkDrag<PrestigeCard>, list: CdkDropList<PrestigeCard>) {
    if (item.data.requirement && !item.data.requirement.active) return false;
    const points = list
      .getSortedItems()
      .reduce((p, c) => p + c.data.cardRequired, 0);
    return (
      points + item.data.cardRequired - 1 <
      Game.getGame().prestigeManager.maxCards
    );
  }
  confirm() {
    this.ms.game.prestigeManager.cards.forEach((card) => (card.active = false));
    this.inUse.forEach((card) => (card.active = true));
    this.ms.game.prestigeManager.lockedCars = true;
    this.ms.game.researchManager.researches.forEach((res) => res.loadMax());
  }
  isCardInUse(card: PrestigeCard): boolean {
    return this.inUse.some((c) => c === card);
  }
  getSpellId(index: number, spell: Spell) {
    return spell.id;
  }
  reloadFavourite() {
    this.favouriteModuleInUse = this.inUse.some(
      (c) => c.id === this.ms.game.prestigeManager.favouriteModuleCard.id
    );
    this.favouriteSpellInUse = this.inUse.some(
      (c) => c.id === this.ms.game.prestigeManager.favouriteSpellCard.id
    );
  }
  onModuleChanges(values: string[]): void {
    const modId = values[values.length - 1];
    this.ms.game.prestigeManager.favouriteModule = this.ms.game.shipyardManager.modules.find(
      (mod) => mod.id === modId
    );
  }
}
