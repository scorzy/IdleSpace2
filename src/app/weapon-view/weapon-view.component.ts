import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Weapon } from "../model/shipyard/weapon";
import { BaseComponentComponent } from "../base-component/base-component.component";

@Component({
  selector: "app-weapon-view",
  templateUrl: "./weapon-view.component.html",
  styleUrls: ["./weapon-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeaponViewComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() weapons: Weapon[];
  ngOnInit() {}
}
