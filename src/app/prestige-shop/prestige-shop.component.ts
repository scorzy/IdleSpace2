import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { PrestigePoint } from "../model/prestige/prestigePoint";

@Component({
  selector: "app-prestige-shop",
  templateUrl: "./prestige-shop.component.html",
  styleUrls: ["./prestige-shop.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeShopComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  buyOptions = [1, 10, 20, 100];
  getTabId(index: number, tab: any) {
    return index;
  }
  getPrestigeId(index: number, prestige: PrestigePoint) {
    return prestige.id;
  }
}
