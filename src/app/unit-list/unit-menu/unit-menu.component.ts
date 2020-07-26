import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  Input
} from "@angular/core";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { Unit } from "src/app/model/units/unit";

@Component({
  selector: "app-unit-menu",
  templateUrl: "./unit-menu.component.html",
  styleUrls: ["./unit-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitMenuComponent extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() unit: Unit;
  Decimal = Decimal;
  hasProd = false;
  ngOnInit() {
    super.ngOnInit();
    this.hasProd = this.unit.production.length > 0;
  }
}
