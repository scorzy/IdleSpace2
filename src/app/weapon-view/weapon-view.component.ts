import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Weapon } from "../model/shipyard/weapon";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-weapon-view",
  templateUrl: "./weapon-view.component.html",
  styleUrls: ["./weapon-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeaponViewComponent extends BaseComponentComponent {
  @Input() weapons: Weapon[];
  ngOnInit() {}
}
