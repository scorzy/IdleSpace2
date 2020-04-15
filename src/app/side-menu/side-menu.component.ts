import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { fadeIn } from "../animations";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { OptionsService } from "../options.service";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class SideMenuComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() isCollapsed = false;
  @Input() notCollapsed = false;

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
}
