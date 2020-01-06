import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Weapon } from "../model/shipyard/weapon";

@Component({
  selector: "app-weapon-view",
  templateUrl: "./weapon-view.component.html",
  styleUrls: ["./weapon-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeaponViewComponent implements OnInit {
  @Input() weapons: Weapon[];
  @Input() size = "middle";

  constructor() {}

  ngOnInit() {}
}
