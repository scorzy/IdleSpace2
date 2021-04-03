import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
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
import { NzMessageService } from "ng-zorro-antd/message";

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
  private lastErrorMessage = "";
  private lastErrorDate = 0;
  @HostBinding("class.disable-animation") animationDisabled = true;
  constructor(public ms: MainService, private message: NzMessageService) {}

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
  checkAndDrop(event: CdkDragDrop<PrestigeCard[]>) {
    const card = event.previousContainer.data[event.previousIndex];

    if (this.inUse.some((use) => use.requirement && use.requirement === card)) {
      return;
    }

    return this.drop(event);
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
    if (item.data.requirement && !item.data.requirement.selected) {
      this.errorMessage("Requirements conditions not fulfilled!");
      return false;
    }
    const points = list
      .getSortedItems()
      .reduce((p, c) => p + c.data.cardRequired, 0);
    const ret =
      points + item.data.cardRequired - 1 <
      Game.getGame().prestigeManager.maxCards;
    if (!ret) {
      this.errorMessage("Max cards points reached!");
    }
    return ret;
  }
  removePredicate(
    item: CdkDrag<PrestigeCard>,
    list: CdkDropList<PrestigeCard>
  ) {
    if (
      this.inUse.some((use) => use.requirement && use.requirement === item.data)
    ) {
      this.errorMessage(
        item.data.name + " cannot be removed. Please remove dependencies first."
      );

      return false;
    }
    return true;
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
  errorMessage(message: string) {
    if (
      this.lastErrorMessage !== message ||
      Date.now() - 2e3 > this.lastErrorDate
    ) {
      this.message.error(message);
      this.lastErrorDate = Date.now();
    }

    this.lastErrorMessage = message;
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
