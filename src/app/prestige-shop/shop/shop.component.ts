import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { ONE } from "src/app/model/CONSTANTS";
import { PrestigePoint } from "src/app/model/prestige/prestigePoint";

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() prestiges: PrestigePoint[];
  @Input() customBuy: Decimal;
  buyOptions = [
    ONE,
    new Decimal(10),
    new Decimal(20),
    new Decimal(100),
    new Decimal(1e3),
    new Decimal(1e4),
    new Decimal(1e5),
    new Decimal(1e6)
  ];

  getPrestigeId(index: number, prestige: PrestigePoint) {
    return prestige.id;
  }
  getBuyOpt(index: number, buyOpt: Decimal) {
    return buyOpt;
  }
}
