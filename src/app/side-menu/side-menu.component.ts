import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "../main.service";
import { fadeIn } from "../animations";
import { ShipDesign } from "../model/shipyard/shipDesign";
import { OptionsService } from "../options.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn]
})
export class SideMenuComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  @Input() isCollapsed = false;
  @Input() notCollapsed = false;

  constructor(
    public ms: MainService,
    public os: OptionsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getDesignId(index: number, shipDesign: ShipDesign) {
    return shipDesign.id;
  }
}
