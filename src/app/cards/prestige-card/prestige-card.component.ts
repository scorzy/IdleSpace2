import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { PrestigeCard } from "src/app/model/prestige/prestigeCard";

@Component({
  selector: "app-prestige-card",
  templateUrl: "./prestige-card.component.html",
  styleUrls: ["./prestige-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeCardComponent implements OnInit, OnDestroy {
  @Input() card: PrestigeCard;
  cardSub: Subscription;

  constructor(public ms: MainService, protected cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    if (this.card.cardRequired) {
      this.cardSub = this.ms.cardChangeEmitter.subscribe(() => {
        this.cd.markForCheck();
        console.log(this.card.id);
      });
    }
  }
  ngOnDestroy(): void {
    if (this.cardSub) this.cardSub.unsubscribe();
  }
}
