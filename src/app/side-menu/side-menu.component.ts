import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { MainService } from "../main.service";
import { fadeIn } from "../animations";
import { ShipDesign } from "../model/shipyard/shipDesign";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
  animations: [fadeIn]
})
export class SideMenuComponent implements OnInit {
  @Input() notCollapsed = false;

  constructor(public ms: MainService) {}

  ngOnInit() {}

  getDesignId(index: number, shipDesign: ShipDesign) {
    return shipDesign.id;
  }
}
