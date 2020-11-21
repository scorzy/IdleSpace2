import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit(): void {}
}
