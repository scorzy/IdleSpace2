import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-research-priorities",
  templateUrl: "./research-priorities.component.html",
  styleUrls: ["./research-priorities.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchPrioritiesComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit() {}
}
