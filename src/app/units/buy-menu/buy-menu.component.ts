import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-buy-menu",
  templateUrl: "./buy-menu.component.html",
  styleUrls: ["./buy-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyMenuComponent implements OnInit {
  buyString = "Max";

  constructor(public ms: MainService) {}

  ngOnInit(): void {}
  setCustomBuy(fixed: boolean, num: number, text: string) {
    this.ms.game.buyFixed = fixed;
    if (this.ms.game.buyFixed) {
      this.ms.game.customBuy = new Decimal(num);
    } else {
      this.ms.game.customBuyPercent = num;
    }
    this.buyString = text;
  }
}
