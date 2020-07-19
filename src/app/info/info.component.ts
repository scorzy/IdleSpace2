import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { INSPIRATION_PERCENT, FLEET_CAPACITY } from "../model/CONSTANTS";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent implements OnInit {
  INSPIRATION_PERCENT = INSPIRATION_PERCENT;
  FLEET_CAPACITY = FLEET_CAPACITY;
  constructor() {}

  ngOnInit(): void {}
}
