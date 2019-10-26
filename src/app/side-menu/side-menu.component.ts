import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { MainService } from "../main.service";
import { fadeIn } from "../animations";

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
}
