import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
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
  buyOptions = [1, 10, 20, 100, 1e3];

  getPrestigeId(index: number, prestige: PrestigePoint) {
    return prestige.id;
  }
}
