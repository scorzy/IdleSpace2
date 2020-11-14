import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { ONE, PRESTIGE_TECH_UNLOCK } from "../model/CONSTANTS";
import { PrestigePoint } from "../model/prestige/prestigePoint";
import { parseDecimal } from "../model/utility/parseDecimal";

@Component({
  selector: "app-prestige-shop",
  templateUrl: "./prestige-shop.component.html",
  styleUrls: ["./prestige-shop.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeShopComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  techExpanded = true;
  PRESTIGE_TECH_UNLOCK = PRESTIGE_TECH_UNLOCK;

  ngOnInit() {
    this.reload();
    super.ngOnInit();
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.reload();
      })
    );
  }
  reload() {
    this.ms.game.prestigeManager.prestigePoints.forEach((p) => p.reload());
  }
  reloadCustomBuy() {
    this.ms.game.prestigeManager.customBuy = parseDecimal(
      this.ms.game.prestigeManager.customBuyString
    );
  }
  getTabId(index: number, tab: any) {
    return index;
  }
  getPrestigeId(index: number, prestige: PrestigePoint) {
    return prestige.id;
  }
}
