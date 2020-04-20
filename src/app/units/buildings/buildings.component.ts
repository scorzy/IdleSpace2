import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Unit } from "src/app/model/units/unit";

@Component({
  selector: "app-buildings",
  templateUrl: "./buildings.component.html",
  styleUrls: ["./buildings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingsComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  units: Unit[];
  ngOnInit() {
    this.units = this.ms.game.resourceManager.unlockedBuildings;
    super.ngOnInit();
  }
  getId(index: number, unit: Unit) {
    return unit.id;
  }
}
