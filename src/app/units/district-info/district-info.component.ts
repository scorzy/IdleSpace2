import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";
import { BaseComponentComponent } from "src/app/base-component/base-component.component";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-district-info",
  templateUrl: "./district-info.component.html",
  styleUrls: ["./district-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistrictInfoComponent
  extends BaseComponentComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() district: Unit;
  constructor(ms: MainService, cd: ChangeDetectorRef) {
    super(ms, cd);
  }
}
