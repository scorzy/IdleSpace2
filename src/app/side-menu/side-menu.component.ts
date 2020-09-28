import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter
} from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { OptionsService } from "../options.service";
import { BaseComponentComponent } from "../base-component/base-component.component";
import { trigger } from "@angular/animations";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger("noop", [])]
})
export class SideMenuComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() isCollapsed = false;
  @Input() notCollapsed = false;
  @Output() select = new EventEmitter();
  buyString = "Max";

  constructor(
    ms: MainService,
    public os: OptionsService,
    cd: ChangeDetectorRef
  ) {
    super(ms, cd);
  }
  getDesignId(index: number, shipDesign: ShipDesign) {
    return shipDesign.id;
  }
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
