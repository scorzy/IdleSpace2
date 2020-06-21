import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "../main.service";

@Component({
  selector: "app-automation",
  templateUrl: "./automation.component.html",
  styleUrls: ["./automation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomationComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit(): void {}
}
