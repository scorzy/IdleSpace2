import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Unit } from "src/app/model/units/unit";

@Component({
  selector: "app-district-info",
  templateUrl: "./district-info.component.html",
  styleUrls: ["./district-info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistrictInfoComponent implements OnInit {
  @Input() district: Unit;

  constructor() {}

  ngOnInit(): void {}
}
