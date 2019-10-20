import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";
import { Unit } from "../model/units/unit";

@Component({
  selector: "app-material-top",
  templateUrl: "./material-top.component.html",
  styleUrls: ["./material-top.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialTopComponent implements OnInit {
  constructor(public ms: MainService) {
    const ad = new Decimal();
  }

  ngOnInit() {}

  getId(index: number, mat: Unit) {
    return mat.id;
  }
}
